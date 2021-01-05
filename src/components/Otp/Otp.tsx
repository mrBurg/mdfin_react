import React, {
  ReactElement,
  PureComponent,
  RefObject,
  createRef,
} from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { action } from 'mobx';
import _ from 'lodash';

import style from './Otp.module.scss';

import { otpMask, maskChar } from '@src/config.json';
import {
  INPUT_TYPE,
  BUTTON_TYPE,
  ANIMATION,
  FIELD_NAME,
  URIS_SUFFIX,
} from '@src/constants';
import { handleErrors, prefixedEvent, validator } from '@utils';
import { TOnInputChangeHandler, TOnClickHandler } from '@interfaces';
import { TOtpProps, TState } from './@types';

import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { WithLink, WithTracking } from '@components/hocs';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { AbstractRoles, NonStandardRoles, WidgetRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { TField } from '@stores-types/userStore';

@inject(STORE_IDS.OTP_STORE, STORE_IDS.LOAN_STORE, STORE_IDS.USER_STORE)
@observer
export class Otp extends PureComponent<TOtpProps> {
  public readonly state: TState = {
    invalidFields: [],
  };

  private otpPopup: RefObject<HTMLDivElement> = createRef();

  public componentDidMount(): void {
    const { otpStore } = this.props;

    if (otpStore) {
      otpStore
        .initOtpForm()
        .then(() => {
          otpStore.resend();

          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const { otpStore, page } = this.props;
    let validateItems: TField[] = [];

    if (otpStore && page == URIS_SUFFIX.SIGN_UP) {
      validateItems = [
        {
          name: FIELD_NAME.OTP_AGREE_CHECKBOX,
          value: otpStore.otpAgreeCheckbox!,
        },
      ];
    }
    return validateItems;
  }

  private async validateForm(validateItems: TField[]): Promise<boolean> {
    const { userStore } = this.props;

    const validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    //let invalidFields: string[] = this.state.invalidFields;
    if (userStore) {
      const validateResult: string[] = await validator(
        validateItems,
        userStore
      );
      await this.setInvalidFields(validateResult, validateItemsNames);
    }

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

  private renderOtpData(otpCode: string) {
    if (this.otpPopup.current) {
      prefixedEvent(
        this.otpPopup.current,
        ANIMATION.END,
        (element: HTMLElement) => {
          element.remove();
        }
      );
    }

    return (
      <div ref={this.otpPopup} className={style.testOtp}>
        {otpCode}
      </div>
    );
  }

  private checkOtp /* : TOnInputKeyUpHandler */ = async () => {
    const { otpStore } = this.props;

    if (otpStore) {
      const { otpCode } = otpStore;

      if (!~otpCode.search(maskChar) && otpCode !== '') {
        const validateItems = await this.validateItems();
        const res = await this.validateForm(validateItems);
        if (!res) return;

        otpStore.updateOtpDisabled(true);
        this.props.action(); // otpStore.validateOtp(userStore);
      }
    }
  };

  private resendOtp: TOnClickHandler = () => {
    const { otpStore, loanStore, userStore, page } = this.props;

    if (otpStore && loanStore && userStore) {
      if (page == URIS_SUFFIX.APPLICATION) {
        otpStore.updateOtpValue('');
        otpStore.resetOtpWrong();
        otpStore.updateOtpState({});

        const account = { account: { ...loanStore.account } };
        loanStore.cabinetSign(account, otpStore);
      } else {
        otpStore.updateOtpValue('');
        otpStore.resetOtpWrong();
        otpStore.updateOtpDisabled(false);
        otpStore.updateOtpState({});
        userStore.sendUserData(userStore.userData, otpStore);
      }
    }
  };

  private onChangeHandle: TOnInputChangeHandler = (event) => {
    const { value } = event.currentTarget;
    const { otpStore } = this.props;

    if (otpStore) {
      otpStore.updateOtpValue(value);
      otpStore.resetOtpWrong();
    }
  };

  @action
  private onChangeHandleCheckBox = (_event: any, data: any) => {
    const { otpStore } = this.props;

    if (otpStore) {
      otpStore.otpAgreeCheckbox = data.checked;
    }
    this.checkOtp();
  };

  render(): ReactElement | null {
    const { invalidFields } = this.state;
    const { className, page, otpStore } = this.props;

    if (otpStore) {
      const {
        otpIsDisabled,
        otpCode,
        testerData,
        otpWrong,
        showResend,
        otpFormStatic,
      } = otpStore;

      if (otpFormStatic) {
        const { termsAndConditions, links, sendOtp, wrongOtp } = otpFormStatic;
        const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

        return (
          <div className={className}>
            {testerData && this.renderOtpData(testerData)}
            {itsSignUp && (
              <div className={style.agree_terms}>
                <CheckboxWidget
                  name={FIELD_NAME.OTP_AGREE_CHECKBOX}
                  onChange={this.onChangeHandleCheckBox}
                  isValid={invalidFields.includes(
                    FIELD_NAME.OTP_AGREE_CHECKBOX
                  )}
                  checked={otpStore.otpAgreeCheckbox}
                />
                <WithTracking
                  id={`Otp-${NonStandardRoles.textWithHTML}`}
                  events={[EMouseEvents.CLICK]}
                >
                  <WithLink
                    className={style.agree_text}
                    linkClassName={style.link}
                    links={links}
                  >
                    {termsAndConditions}
                  </WithLink>
                </WithTracking>
              </div>
            )}
            <WithTracking
              id={`Otp-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.OTP}`}
              events={[
                EFocusEvents.FOCUS,
                EFocusEvents.BLUR,
                EKeyboardEvents.KEY_UP,
              ]}
            >
              <ReactInputMaskWidget
                name={FIELD_NAME.OTP}
                value={otpCode}
                className={style.input}
                invalid={otpWrong}
                type={INPUT_TYPE.TEL}
                mask={otpMask}
                placeholder={otpMask.replace(/9/g, '*')}
                onChange={this.onChangeHandle}
                onKeyUp={this.checkOtp}
                disabled={otpIsDisabled}
                role={AbstractRoles.input}
              />
            </WithTracking>
            <div className={classNames('resend', style.resend)}>
              {otpWrong && (
                <p className={classNames(style.item, style.message)}>
                  {wrongOtp}
                </p>
              )}
              {showResend && (
                <WithTracking
                  id={`Otp-${WidgetRoles.button}`}
                  events={[EMouseEvents.CLICK]}
                >
                  <button
                    type={BUTTON_TYPE.BUTTON}
                    className={classNames(style.item, style.button)}
                    onClick={this.resendOtp}
                    role={WidgetRoles.button}
                  >
                    {sendOtp}
                  </button>
                </WithTracking>
              )}
            </div>
          </div>
        );
      }
    }

    return null;
  }
}
