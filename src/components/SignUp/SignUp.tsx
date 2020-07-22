import { ReactElement, Component } from 'react';

import style from './SignUp.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';
import { inject, observer } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import RegistrationStore from '../../stores/registrationStore';

type TSignUp = {
  registrationStore?: RegistrationStore;
};

@inject(STORE_IDS.REGISTRATION_STORE)
@observer
export class SignUp extends Component<TSignUp> {
  formData = null;
  public readonly state = {};

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
          <form className={style.SignUp}>
            <input type={INPUT_TYPE.TEXT} placeholder={namePlaceholder} />
            <input type={INPUT_TYPE.TEXT} placeholder={phoneMask} />
            <input type={INPUT_TYPE.TEXT} />
            <button type={BUTTON_TYPE.BUTTON}>{gt.gettext(buttonText)}</button>
          </form>
        );
      }
    }

    return null;
  }
}
