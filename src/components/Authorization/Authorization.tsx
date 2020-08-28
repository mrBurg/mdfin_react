import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import style from './Authorization.module.scss';

import { phoneMask } from '../../config.json';
import {
  BUTTON_TYPE,
  INPUT_TYPE,
  FIELD_NAME,
  URIS_SUFFIX,
} from '../../constants';
import { gt } from '../../utils';
import { Otp } from '../Otp';
import { TComponenProps, TOnInputChangeHandler } from '../../interfaces';
import { OtpStore } from '../../stores/OtpStore';
import { TUserObligatory } from '../../stores/@types/userStore';

@observer
export class Authorization extends PureComponent<
  TComponenProps & {
    page: URIS_SUFFIX;
  }
> {
  public readonly state: TUserObligatory = {
    name: '',
    phoneNumber: '',
  };

  private submitForm() {
    const { userStore, otpStore, page } = this.props;

    if (!this.validateForm(otpStore, page)) return;

    otpStore.updateUrisKey(page);

    userStore.sendUserData(this.state, otpStore);
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submitForm();
  };

  private validateForm(otpStore: OtpStore, page: URIS_SUFFIX): boolean {
    const { name, phoneNumber } = this.state;
    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

    if (itsSignUp && name && phoneNumber) {
      otpStore.setValidForm(true);
      return true;
    } else if (phoneNumber) {
      otpStore.setValidForm(true);
      return true;
    } else {
      otpStore.setValidForm(false);
      return false;
    }
  }

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { otpStore } = this.props;
    this.setState(
      (state: TUserObligatory): TUserObligatory => {
        return {
          ...state,
          [name]: value,
        };
      }
    );
    otpStore.setValidForm(true);
  };

  private onChangeHandlerPhone: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { otpStore } = this.props;
    this.setState(
      (state: TUserObligatory): TUserObligatory => {
        return {
          ...state,
          [name]: value.replace(/[\s-]/g, ''),
        };
      }
    );
    otpStore.setValidForm(true);
  };

  render(): ReactElement {
    const { name, phoneNumber } = this.state;
    const {
      pageStore: {
        pageData: { formTitle, pageTitle, namePlaceholder, phonePlaceHolder },
      },
      otpStore: { otpReady, validForm },
      page,
    } = this.props;

    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

    return (
      <form className={style.authorization} onSubmit={this.onSubmitHandler}>
        <h2 className={style.formTitle}>{itsSignUp ? formTitle : pageTitle}</h2>
        {itsSignUp && (
          <input
            name={FIELD_NAME.NAME}
            className={classNames(style.input, {
              [style.error]: !validForm,
            })}
            type={INPUT_TYPE.TEXT}
            value={name}
            placeholder={namePlaceholder}
            onChange={this.onChangeHandler}
            disabled={otpReady}
            maxLength={50}
            pattern='[\s\p{L}]*'
          />
        )}
        <InputMask
          name={FIELD_NAME.PHONE_NUMBER}
          className={classNames(style.input, { [style.error]: !validForm })}
          type={INPUT_TYPE.TEL}
          mask={phoneMask}
          value={phoneNumber}
          placeholder={phonePlaceHolder || phoneMask.replace(/9/g, '*')}
          onChange={this.onChangeHandlerPhone}
          disabled={otpReady}
        />

        {otpReady && <Otp className={style.otp} {...this.props} />}

        {!otpReady && (
          <button className={style.button} type={BUTTON_TYPE.SUBMIT}>
            {itsSignUp ? gt.gettext('More') : 'Đăng Nhập'}
          </button>
        )}
      </form>
    );
  }
}
