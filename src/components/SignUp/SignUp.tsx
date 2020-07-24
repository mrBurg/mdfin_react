import { ReactElement, Component } from 'react';
import InputMask from 'react-input-mask';

import style from './SignUp.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';
import { inject, observer } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import RegistrationStore from '../../stores/registrationStore';
import OTPWidget from '../widgets/OTPWidget';

type TSignUpProps = {
  registrationStore?: RegistrationStore;
};

@inject(STORE_IDS.REGISTRATION_STORE)
@observer
export class SignUp extends Component<TSignUpProps> {
  componentDidMount(): void {
    const { registrationStore } = this.props;

    if (registrationStore) registrationStore.initRegistrationForm();
  }

  render(): ReactElement | null {
    const { registrationStore } = this.props;

    if (registrationStore) {
      const { formData } = registrationStore;

      if (formData) {
        const { namePlaceholder, buttonText } = formData;

        return (
          <form className={style.signUp}>
            <input
              className={style.input}
              type={INPUT_TYPE.TEXT}
              placeholder={namePlaceholder}
            />
            <InputMask
              className={style.input}
              mask={phoneMask}
              placeholder={phoneMask.replace(/9/g, '*')}
            />

            <OTPWidget className={style.otp} />

            <button className={style.button} type={BUTTON_TYPE.BUTTON}>
              {gt.gettext(buttonText)}
            </button>
          </form>
        );
      }
    }

    return null;
  }
}
