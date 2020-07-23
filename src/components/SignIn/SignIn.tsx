import { ReactElement, FC } from 'react';

import style from './SignIn.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { gt } from '../../utils';

export const SignIn: FC = (): ReactElement => {
  return (
    <form className={style.signIn}>
      <input
        className={style.input}
        type={INPUT_TYPE.TEXT}
        placeholder='Họ Tên Đầy Đủ'
      />
      <input
        className={style.input}
        type={INPUT_TYPE.TEXT}
        placeholder={phoneMask}
      />
      <button className={style.button} type={BUTTON_TYPE.BUTTON}>
        {gt.gettext('More')}
      </button>
    </form>
  );
};
