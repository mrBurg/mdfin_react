import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';

import style from './Authorization.module.scss';

import { phoneMask } from '../../config.json';
import {
  BUTTON_TYPE,
  INPUT_TYPE,
  FIELD_NAME,
  URIS_SUFFIX,
} from '../../constants';
import { gt } from '../../utils';
import OtpWidget from '../widgets/OtpWidget';
import { TFormData } from '../../stores/UserStore';
import { TComponenProps, TOnInputChangeHandler } from '../../interfaces';

@observer
export class Authorization extends PureComponent<
  TComponenProps & {
    page: URIS_SUFFIX;
  }
> {
  public readonly state: TFormData = {
    name: '',
    phoneNumber: '',
  };

  private submitForm() {
    const { userStore, otpStore, page } = this.props;

    otpStore.updateUrisKey(page);

    userStore.sendUserData(this.state, otpStore);
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submitForm();
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          [name]: value.replace(/[\s-]/g, ''),
        };
      }
    );
  };

  render(): ReactElement {
    const { name, phoneNumber } = this.state;
    const {
      pageStore: {
        pageData: { formTitle, pageTitle, namePlaceholder, phonePlaceHolder },
      },
      otpStore: { otpReady },
      page,
    } = this.props;

    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

    return (
      <form className={style.authorization} onSubmit={this.onSubmitHandler}>
        <h2 className={style.formTitle}>{itsSignUp ? formTitle : pageTitle}</h2>
        {itsSignUp && (
          <input
            name={FIELD_NAME.NAME}
            className={style.input}
            type={INPUT_TYPE.TEXT}
            value={name}
            placeholder={namePlaceholder}
            onChange={this.onChangeHandler}
            disabled={otpReady}
          />
        )}
        <InputMask
          name={FIELD_NAME.PHONE_NUMBER}
          className={style.input}
          type={INPUT_TYPE.TEL}
          mask={phoneMask}
          value={phoneNumber}
          placeholder={phonePlaceHolder || phoneMask.replace(/9/g, '*')}
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
