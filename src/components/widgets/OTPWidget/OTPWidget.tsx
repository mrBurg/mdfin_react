import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './OTPWidget.module.scss';

import { otpMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE } from '../../../constants';

type TOTPInputProps = {
  className?: string;
};

export const OTPWidget: FC<TOTPInputProps> = (): ReactElement => {
  return (
    <div className={style.otp}>
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
};
