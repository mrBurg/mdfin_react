import { ReactElement, PureComponent, RefObject, createRef } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import style from './Otp.module.scss';

import { otpMask, maskChar } from '../../config.json';
import {
  INPUT_TYPE,
  BUTTON_TYPE,
  ANIMATION,
  FIELD_NAME,
  URIS_SUFFIX,
} from '../../constants';
import { prefixedEvent } from '../../utils';
import {
  TOnInputChangeHandler,
  TOnInputKeyUpHandler,
  TOnClickHandler,
} from '../../interfaces';
import { CheckboxWidget } from '../widgets/CheckboxWidget';
import { TOtpProps } from './@types';

@observer
export class Otp extends PureComponent<TOtpProps> {
  private otpPopup: RefObject<HTMLDivElement> = createRef();

  public componentDidMount(): void {
    const { otpStore } = this.props;

    otpStore.resend();
  }

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

  private checkOtp: TOnInputKeyUpHandler = () => {
    const {
      otpStore,
      otpStore: { otpCode },
      //userStore,
    } = this.props;

    if (!~otpCode.search(maskChar) && otpCode !== '') {
      otpStore.updateOtpDisabled(true);
      //otpStore.validateOtp(userStore);
      this.props.action();
    }
  };

  private resendOtp: TOnClickHandler = () => {
    const { otpStore, loanStore, userStore, page } = this.props;

    if (page == URIS_SUFFIX.APPLICATION) {
      const account = { account: { ...loanStore.account } };
      loanStore.cabinetSign(account, otpStore);
    } else {
      otpStore.updateOtpState({});
      userStore.sendUserData(userStore.userData, otpStore);
    }
  };

  private onChangeHandle: TOnInputChangeHandler = (event) => {
    const { value } = event.currentTarget;
    const { otpStore } = this.props;

    otpStore.updateOtpValue(value);
    otpStore.resetOtpWrong();
  };

  render(): ReactElement | null {
    const {
      className,
      otpStore: { otpIsDisabled, otpCode, testerData, otpWrong, showResend },
      page,
    } = this.props;

    const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

    return (
      <div className={classNames(className)}>
        {testerData && this.renderOtpData(testerData)}
        {itsSignUp && (
          <div className={style.agree_terms}>
            <CheckboxWidget
              label={
                'Bằng việc nhấp vào nút Đăng Ký bên trên, tôi đồng ý rằng tôi đã đọc và chấp nhận các Điều Khoản và Điều Kiện. Website này được bảo vệ bởi reCAPTCHA và ứng dụng các quy định bảo mật và các điều khoản điều kiện khác của Google'
              }
            />
          </div>
        )}
        <InputMask
          name={FIELD_NAME.OTP}
          className={classNames(style.input, { [style.error]: otpWrong })}
          type={INPUT_TYPE.TEL}
          mask={otpMask}
          placeholder={otpMask.replace(/9/g, '*')}
          maskChar={maskChar}
          value={otpCode}
          onChange={this.onChangeHandle}
          onKeyUp={this.checkOtp}
          disabled={otpIsDisabled}
        />
        <div className={classNames('resend', style.resend)}>
          {otpWrong && (
            <p className={classNames(style.item, style.message)}>
              Mật mã bạn nhập không chính xác, vui long thử lại
            </p>
          )}
          {showResend && (
            <button
              type={BUTTON_TYPE.BUTTON}
              className={classNames(style.item, style.button)}
              onClick={this.resendOtp}
            >
              Gửi Mã OTP
            </button>
          )}
        </div>
      </div>
    );
  }
}
