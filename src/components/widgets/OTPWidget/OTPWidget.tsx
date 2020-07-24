import { ReactElement, PureComponent, createRef, RefObject } from 'react';
import InputMask from 'react-input-mask';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import style from './OTPWidget.module.scss';

import { otpMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE } from '../../../constants';
import { STORE_IDS } from '../../../stores';
import OTPStore from '../../../stores/OTPStore';
import { prefixedEvent } from '../../../utils';

type TOTPInputProps = {
  className?: string;
  otpStore?: OTPStore;
};

const renderOTPData = (ref: RefObject<HTMLDivElement>, otpCode: string) => {
  if (ref.current) {
    prefixedEvent(ref.current, 'animationend', (element: HTMLElement) => {
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
          <InputMask
            name='otp'
            className={style.input}
            type={INPUT_TYPE.TEL}
            mask={otpMask}
            placeholder={otpMask.replace(/9/g, '*')}
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
