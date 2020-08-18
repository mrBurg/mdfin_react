import { ReactElement, PureComponent, RefObject, createRef } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import style from './OtpWidget.module.scss';

import { otpMask, maskChar } from '../../../config.json';
import {
  INPUT_TYPE,
  BUTTON_TYPE,
  ANIMATION,
  FIELD_NAME,
  URIS_SUFFIX,
} from '../../../constants';
import { prefixedEvent } from '../../../utils';
import {
  TComponenProps,
  TOnInputChangeHandler,
  TOnKeyUpHandler,
  TOnClickHandler,
} from '../../../interfaces';
import { CheckboxWidget } from '../CheckboxWidget';

type TOtpWidgetProps = {
  className?: string;
  page: URIS_SUFFIX;
} & TComponenProps;

@observer
export class OtpWidget extends PureComponent<TOtpWidgetProps> {
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
          console.info('OTP data has been hidden');
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

  private checkOtp: TOnKeyUpHandler = () => {
    const {
      otpStore,
      otpStore: { otpCode },
      userStore,
    } = this.props;

    if (!~otpCode.search(maskChar) && otpCode !== '') {
      otpStore.updateOtpDisabled(true);
      otpStore.validateOtp(userStore);
    }
  };

  private resendOtp: TOnClickHandler = () => {
    const { otpStore, userStore } = this.props;

    otpStore.updateOtpState({});
    userStore.sendUserData(userStore.userData, otpStore);
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
        <div className={style.resend}>
          {otpWrong && (
            <p className={classNames(style.item, style.message)}>
              Mật khẩu bạn đã nhập không chính xác, hãy thử lại
            </p>
          )}
          {showResend && (
            <button
              type={BUTTON_TYPE.BUTTON}
              className={classNames(style.item, style.button)}
              onClick={this.resendOtp}
            >
              Gửi tin nhắn SMS một lần nữa
            </button>
          )}
        </div>
      </div>
    );
  }
}
