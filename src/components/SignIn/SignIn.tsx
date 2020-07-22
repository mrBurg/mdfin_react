import { ReactElement, FC } from 'react';

import style from './SignIn.module.scss';

import { phoneMask } from '../../config.json';
import { BUTTON_TYPE } from '../../constants';
import { gt } from '../../utils';

export const SignIn: FC = (props): ReactElement => {
  console.info(props);

  return (
    <form className={style.signIn}>
      <input type='text' placeholder='Họ Tên Đầy Đủ' />
      <input type='text' placeholder={phoneMask} />
      <button type={BUTTON_TYPE.BUTTON}>{gt.gettext('More')}</button>
    </form>
  );
};
