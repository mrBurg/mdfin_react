import { ReactElement, PureComponent, ChangeEvent } from 'react';
import InputMask from 'react-input-mask';
import { inject, observer } from 'mobx-react';

import style from './SignUp.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';
import { STORE_IDS } from '../../stores';
import RegistrationStore, { TFormData } from '../../stores/registrationStore';
import OTPStore from '../../stores/OTPStore';
import OTPWidget from '../widgets/OTPWidget';

type TSignUpProps = {
  registrationStore?: RegistrationStore;
  otpStore?: OTPStore;
};

@inject(STORE_IDS.REGISTRATION_STORE, STORE_IDS.OTP_STORE)
@observer
export class SignUp extends PureComponent<TSignUpProps> {
  public readonly state: TFormData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
  };

  private setFormData = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = currentTarget;

    this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          [name]: value,
        };
      }
    );
  };

  componentDidMount(): void {
    const { registrationStore } = this.props;

    if (registrationStore) registrationStore.initRegistrationForm();
  }

  render(): ReactElement | null {
    const { registrationStore, otpStore } = this.props;

    if (registrationStore && otpStore) {
      const { formStaticData } = registrationStore;
      const { otpReady } = otpStore;

      if (formStaticData) {
        const { namePlaceholder, buttonText } = formStaticData;
        const { firstName, lastName, phoneNumber } = this.state;

        return (
          <form className={style.signUp}>
            <input
              name='firstName'
              className={style.input}
              type={INPUT_TYPE.TEXT}
              value={firstName}
              placeholder={namePlaceholder}
              onChange={this.setFormData}
              disabled={otpReady}
            />
            <input
              name='lastName'
              className={style.input}
              type={INPUT_TYPE.TEXT}
              value={lastName}
              placeholder={namePlaceholder}
              onChange={this.setFormData}
              disabled={otpReady}
            />
            <InputMask
              name='phoneNumber'
              className={style.input}
              type={INPUT_TYPE.TEL}
              mask={phoneMask}
              value={phoneNumber}
              placeholder={phoneMask.replace(/9/g, '*')}
              onChange={this.setFormData}
              disabled={otpReady}
            />

            {otpReady && <OTPWidget className={style.otp} />}

            {!otpReady && (
              <button
                className={style.button}
                type={BUTTON_TYPE.BUTTON}
                onClick={() => {
                  registrationStore.sendForm(this.state);
                }}
              >
                {gt.gettext(buttonText)}
              </button>
            )}
          </form>
        );
      }
    }

    return null;
  }
}
