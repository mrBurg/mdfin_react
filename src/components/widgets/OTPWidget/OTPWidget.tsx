import { ReactElement, PureComponent, createRef, RefObject } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import style from './OTPWidget.module.scss';

import { otpMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE } from '../../../constants';
import { STORE_IDS } from '../../../stores';
import OTPStore from '../../../stores/OTPStore';
import { prefixedEvent } from '../../../utils';

type TOTPInputProps = {
  otpPopup: RefObject<HTMLDivElement>;
  className?: string;
  otpStore?: OTPStore;
};

const renderOTPData = (ref: RefObject<HTMLDivElement>, otpCode: string) => {
  if (ref.current) {
    prefixedEvent(ref.current, 'animationend', (element: HTMLElement) => {
      console.info(element);
      element.remove();
    });
  }

  return (
    <div ref={ref} className={style.testOTP}>
      {otpCode}
    </div>
  );
};

@inject(STORE_IDS.OTP_STORE)
@observer
export class OTPWidget extends PureComponent<TOTPInputProps> {
  private otpPopup: RefObject<HTMLDivElement>;

  constructor(props: TOTPInputProps) {
    super(props);

    this.otpPopup = createRef();
  }

  render(): ReactElement | null {
    const { className, otpStore } = this.props;

    if (otpStore) {
      const { otpCode } = otpStore;

      return (
        <div className={classNames(style.otp, className)}>
          {renderOTPData(this.otpPopup, otpCode!)}
          <input
            className={classNames(style.input, style.error)}
            type={INPUT_TYPE.TEXT}
            placeholder={otpMask}
          />
          <p className={style.message}>
            Mật khẩu bạn đã nhập không chính xác, hãy thử lại
          </p>
          <button type={BUTTON_TYPE.BUTTON} className={style.button}>
            Gửi tin nhắn SMS một lần nữa
          </button>
        </div>
      );
    }

    return null;
  }
}
