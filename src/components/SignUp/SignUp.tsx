import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';

import style from './SignUp.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';
import OtpWidget from '../widgets/OtpWidget';
import { TFormData } from '../../stores/UserStore';
import { TComponenProps, TOnInputChangeHandler } from '../../interfaces';

@observer
export class SignUp extends PureComponent<TComponenProps> {
  public readonly state: TFormData = {
    name: '',
    phoneNumber: '',
  };

  private submitFotm() {
    const { userStore, otpStore } = this.props;

    otpStore.updateUrisKey('_SIGN_UP');

    userStore.sendUserData(this.state, otpStore);
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submitFotm();
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
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
    const { name, phoneNumber } = this.state;
    const {
      pageStore: {
        pageData: { formTitle, namePlaceholder, buttonText },
      },
      otpStore: { otpReady },
    } = this.props;

    return (
      <form className={style.signUp} onSubmit={this.onSubmitHandler}>
        <h2 className={style.formTitle}>{formTitle}</h2>
        <input
          name='name'
          className={style.input}
          type={INPUT_TYPE.TEXT}
          value={name}
          placeholder={namePlaceholder}
          onChange={this.onChangeHandler}
          disabled={otpReady}
        />
        <InputMask
          name='phoneNumber'
          className={style.input}
          type={INPUT_TYPE.TEL}
          mask={phoneMask}
          value={phoneNumber}
          placeholder={phoneMask.replace(/9/g, '*')}
          onChange={this.onChangeHandler}
          disabled={otpReady}
        />

        {otpReady && <OtpWidget className={style.otp} {...this.props} />}

        {!otpReady && (
          <button className={style.button} type={BUTTON_TYPE.SUBMIT}>
            {gt.gettext(buttonText)}
          </button>
        )}
      </form>
    );
  }
}
