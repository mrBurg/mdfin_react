import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Authorization.module.scss';

import { phoneMask } from '../../config.json';
import {
  BUTTON_TYPE,
  INPUT_TYPE,
  FIELD_NAME,
  URIS_SUFFIX,
} from '../../constants';
import { gt, validator } from '../../utils';
import { Otp } from '../Otp';
import { TComponenProps, TOnInputChangeHandler } from '../../interfaces';
import {
  TUserObligatory,
  TField,
  TValidateProps,
} from '../../stores/@types/userStore';
import React from 'react';

type TState = {
  name?: string;
  phoneNumber?: string;
  invalidFields: Array<any>;
  //formRef?: any;
};

@observer
export class Authorization extends PureComponent<
  TComponenProps & {
    page: URIS_SUFFIX;
  }
> {
  //private formRef: any;

  public readonly state: TState = {
    name: '',
    phoneNumber: '',
    invalidFields: [],
  };

  /* constructor(
    props: TComponenProps & {
      page: URIS_SUFFIX;
    }
  ) {
    super(props);
    this.formRef = React.createRef();
  } */

  /** Список полей для валидации */
  private async validateItems(): Promise<TValidateProps> {
    const { page } = this.props;
    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;
    let validateItems: TValidateProps = [];
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

    //console.log(this.formRef.current.name.value);

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

  private async validateForm(validateItems: TValidateProps): Promise<boolean> {
    const { userStore } = this.props;

    let validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    //console.log('validateItemsNames: ', validateItemsNames);

    const validateResult: string[] = await validator(validateItems, userStore);
    //console.log('validateResult:', validateResult);

    let invalidFields: string[] = this.state.invalidFields;
    //console.log('invalidFields:', invalidFields);

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

    return !_.size(this.state.invalidFields);
  }

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

    //if (this.formRef.current) console.log(this.formRef.current.name);

    return (
      <form
        /* ref={this.formRef} */
        className={style.authorization}
        onSubmit={this.onSubmitHandler}
      >
        <h2 className={style.formTitle}>{itsSignUp ? formTitle : pageTitle}</h2>
        {itsSignUp && (
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
            pattern='[\s\p{L}]*'
            //required={true}
            onBlur={this.validateField}
          />
        )}
        <InputMask
          name={FIELD_NAME.PHONE_NUMBER}
          className={classNames(style.input, {
            [style.error]: invalidFields.includes(FIELD_NAME.PHONE_NUMBER),
          })}
          type={INPUT_TYPE.TEL}
          mask={phoneMask}
          value={phoneNumber}
          placeholder={phonePlaceHolder || phoneMask.replace(/9/g, '*')}
          onChange={this.onChangeHandlerPhone}
          disabled={otpReady}
          onBlur={this.validateField}
        />

        {otpReady && (
          <Otp
            className={style.otp}
            action={() => {
              otpStore.validateOtp(userStore);
            }}
            {...this.props}
          />
        )}

        {!otpReady && (
          <button
            className={style.button}
            type={BUTTON_TYPE.SUBMIT}
            //disabled={!this.validate()}
          >
            {itsSignUp ? gt.gettext('More') : 'Đăng Nhập'}
          </button>
        )}
      </form>
    );
  }
}
