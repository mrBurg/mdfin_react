import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './LoanButton.module.scss';

import { BUTTON_TYPE } from '../../constants';
import { inject } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import { gt } from '../../utils';
import { TLoanButtonProps } from './@types';

export const LoanButton: FC<TLoanButtonProps> = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(
  ({ className, loanStore, userStore }): ReactElement => {
    return (
      <button
        className={classNames(style.loanButton, className)}
        type={BUTTON_TYPE.BUTTON}
        onClick={(): void => {
          if (loanStore) loanStore.getLoan(userStore);
        }}
      >
        {gt.gettext('Register Loan')}
      </button>
    );
  }
);
