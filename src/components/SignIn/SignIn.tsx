import { ReactElement, FC } from 'react';
import InputMask from 'react-input-mask';

import style from './SignIn.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';
import OTPWidget from '../widgets/OTPWidget';

export const SignIn: FC = (): ReactElement => {
  return (
    <form className={style.signIn}>
      <input
        className={style.input}
        type={INPUT_TYPE.TEXT}
        placeholder='Họ Tên Đầy Đủ'
      />
      <InputMask
        className={style.input}
        mask={phoneMask}
        placeholder={phoneMask.replace(/9/g, '*')}
      />

      <OTPWidget className={style.otp} />

      <button className={style.button} type={BUTTON_TYPE.BUTTON}>
        {gt.gettext('More')}
      </button>
    </form>
  );
};
