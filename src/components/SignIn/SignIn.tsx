import { ReactElement, PureComponent, ChangeEvent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';

import style from './SignIn.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';
import OtpWidget from '../widgets/OtpWidget';
import { TFormData } from '../../stores/UserStore';
import { TComponenProps } from '../../interfaces';

@observer
export class SignIn extends PureComponent<TComponenProps> {
  public readonly state: TFormData = {
    phoneNumber: '',
  };

  private submitFotm() {
    const { userStore, otpStore } = this.props;

    otpStore.updateUrisKey('_SIGN_IN');

    userStore.sendUserData(this.state, otpStore);
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submitFotm();
  };

  private onChangeHandler = ({
    currentTarget: { name, value },
  }: ChangeEvent<HTMLInputElement>): void => {
    this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          [name]: value.replace(/\s-\s/g, ''),
        };
      }
    );
  };

  render(): ReactElement {
    const { phoneNumber } = this.state;
    const {
      pageStore: {
        pageData: { pageTitle, phonePlaceHolder },
      },
      otpStore: { otpReady },
    } = this.props;

    return (
      <form className={style.signIn} onSubmit={this.onSubmitHandler}>
        <h2 className={style.pageTitle}>{pageTitle}</h2>
        <InputMask
          name='phoneNumber'
          className={style.input}
          type={INPUT_TYPE.TEL}
          mask={phoneMask}
          value={phoneNumber}
          placeholder={phonePlaceHolder}
          onChange={this.onChangeHandler}
          disabled={otpReady}
        />

        {otpReady && <OtpWidget className={style.otp} {...this.props} />}

        {!otpReady && (
          <button className={style.button} type={BUTTON_TYPE.SUBMIT}>
            {gt.gettext('More')}
          </button>
        )}
      </form>
    );
  }
}
