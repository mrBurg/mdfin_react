import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './LoanButton.module.scss';

import { BUTTON_TYPE } from '../../constants';
import { inject } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import LoanStore from '../../stores/loanStore';
import { gt } from '../../utils';

type TLoanButtonProps = {
  className?: string;
  loanStore?: LoanStore;
};

export const LoanButton: FC<TLoanButtonProps> = inject(STORE_IDS.LOAN_STORE)(
  ({ className, loanStore }): ReactElement => {
    return (
      <button
        className={classNames(style.loanButton, className)}
        type={BUTTON_TYPE.BUTTON}
        onClick={(): void => {
          if (loanStore) loanStore.redirectToSignUp();
        }}
      >
        {gt.gettext('Register Loan')}
      </button>
    );
  }
);
