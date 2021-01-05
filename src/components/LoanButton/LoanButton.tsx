import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';
import { inject } from 'mobx-react';

import style from './LoanButton.module.scss';
import { WithTracking } from '@components/hocs';
import { BUTTON_TYPE } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { TLoanButtonProps } from './@types';

export const LoanButton: FC<TLoanButtonProps> = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(
  ({ className, label, loanStore, userStore }): ReactElement => (
    <WithTracking
      id={`Loan-${WidgetRoles.button}`}
      events={[EMouseEvents.CLICK]}
    >
      <button
        className={classNames(style.loanButton, className)}
        type={BUTTON_TYPE.BUTTON}
        role={WidgetRoles.button}
        onClick={(): void => {
          if (userStore && loanStore) {
            userStore.fetchWithAuth(() => {
              loanStore.getLoan();
            });
          }
        }}
      >
        {label}
      </button>
    </WithTracking>
  )
);
