import React from 'react';
import { ReactElement, PureComponent, FormEvent } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Authorization.module.scss';

import { phoneMask } from '@src/config.json';
import { TStores } from '@stores';
import { TAuthorizationProps, TState } from './@types';
import {
  BUTTON_TYPE,
  FIELD_NAME,
  INPUT_TYPE,
  URIS_SUFFIX,
} from '@src/constants';
import { TOnInputChangeHandler } from '@interfaces';
import { gt, validator } from '@utils';
import { WithTracking } from '@components/hocs';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { Otp } from '@components/Otp';
import { TField, TUserObligatory } from '@stores-types/userStore';

@observer
export class Authorization extends PureComponent<
  TStores & TAuthorizationProps
> {
  public readonly state: TState = {
    name: '',
    phoneNumber: '',
    invalidFields: [],
  };

  componentWillUnmount(): void {
    const { otpStore } = this.props;
    otpStore.resetOtpParams();
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const { page } = this.props;
    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;
    let validateItems: TField[] = [];

    if (itsSignUp) {
      validateItems = [
        { name: FIELD_NAME.NAME, value: this.state.name! },
        { name: FIELD_NAME.PHONE_NUMBER, value: this.state.phoneNumber! },
      ];
    } else {
      validateItems = [
        { name: FIELD_NAME.PHONE_NUMBER, value: this.state.phoneNumber! },
      ];
    }

    return validateItems;
  }

  private async submitForm() {
    const { userStore, otpStore, page } = this.props;
    const validateItems = await this.validateItems();
    const res = await this.validateForm(validateItems);

    if (!res) return;

    otpStore.updateUrisKey(page);
    userStore.sendUserData(this.state, otpStore);
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submitForm();
  };

  private validateField: TOnInputChangeHandler = async ({
    currentTarget: { name, value },
  }) => {
    this.validateForm([{ name, value }]);
  };

  private async validateForm(validateItems: TField[]): Promise<boolean> {
    const { userStore } = this.props;

    const validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    //let invalidFields: string[] = this.state.invalidFields;
    const validateResult: string[] = await validator(validateItems, userStore);

    await this.setInvalidFields(validateResult, validateItemsNames);

    return !_.size(this.state.invalidFields);
  }

  /** добавить невалидные/убрать валидные поля из State
   * @param validateResult - список невалидных полей
   * @param validateItemsNames - список имен полей для валидации
   */
  private setInvalidFields = async (
    validateResult: string[],
    validateItemsNames: string[]
  ) => {
    const invalidFields: string[] = this.state.invalidFields;

    if (_.size(validateResult)) {
      this.setState(
        (state: TState): TState => {
          return {
            ...state,
            invalidFields: _.union(validateResult, invalidFields),
          };
        }
      );
    } else {
      this.setState(
        (state: TState): TState => {
          return {
            ...state,
            invalidFields: _.difference(invalidFields, validateItemsNames),
          };
        }
      );
    }
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TUserObligatory): TUserObligatory => {
        return {
          ...state,
          [name]: value,
        };
      }
    );
  };

  private onChangeHandlerPhone: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TUserObligatory): TUserObligatory => {
        return {
          ...state,
          [name]: value.replace(/[\s-_]/g, ''),
        };
      }
    );
  };

  render(): ReactElement {
    const { name, phoneNumber, invalidFields } = this.state;
    const {
      pageStore: {
        pageData: { formTitle, pageTitle, namePlaceholder, phonePlaceHolder },
      },
      otpStore: { otpReady },
      otpStore,
      userStore,
      page,
    } = this.props;

    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

    return (
      <form className={style.authorization} onSubmit={this.onSubmitHandler}>
        <h2 className={style.formTitle}>{itsSignUp ? formTitle : pageTitle}</h2>
        {itsSignUp && (
          <WithTracking
            id={`Authorization-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.NAME}`}
            events={[
              EFocusEvents.FOCUS,
              EFocusEvents.BLUR,
              EKeyboardEvents.KEY_UP,
            ]}
          >
            <input
              name={FIELD_NAME.NAME}
              className={classNames(style.input, {
                [style.error]: invalidFields.includes(FIELD_NAME.NAME),
              })}
              type={INPUT_TYPE.TEXT}
              value={name}
              placeholder={namePlaceholder}
              onChange={this.onChangeHandler}
              disabled={otpReady}
              maxLength={50}
              // pattern='[\s\p{L}]*'
              onBlur={this.validateField}
              role={AbstractRoles.input}
              //required
            />
          </WithTracking>
        )}
        <WithTracking
          id={`Authorization-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.PHONE_NUMBER}`}
          events={[
            EFocusEvents.FOCUS,
            EFocusEvents.BLUR,
            EKeyboardEvents.KEY_UP,
          ]}
        >
          <ReactInputMaskWidget
            name={FIELD_NAME.PHONE_NUMBER}
            value={phoneNumber}
            className={style.input}
            invalid={invalidFields.includes(FIELD_NAME.PHONE_NUMBER)}
            type={INPUT_TYPE.TEL}
            mask={phoneMask}
            placeholder={phonePlaceHolder || phoneMask.replace(/9/g, '*')}
            onChange={this.onChangeHandlerPhone}
            onBlur={this.validateField}
            role={AbstractRoles.input}
            disabled={otpReady}
          />
        </WithTracking>

        {otpReady && (
          <Otp
            className={style.otp}
            action={() => {
              otpStore.validateOtp(userStore);
            }}
            page={URIS_SUFFIX.SIGN_UP}
          />
        )}

        {!otpReady && (
          <WithTracking
            id={`Authorization-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
            events={[EMouseEvents.CLICK]}
          >
            <button
              className={style.button}
              type={BUTTON_TYPE.SUBMIT}
              role={WidgetRoles.button}
              //disabled={!this.validate()}
            >
              {itsSignUp ? gt.gettext('More') : 'Đăng Nhập'}
            </button>
          </WithTracking>
        )}
      </form>
    );
  }
}
