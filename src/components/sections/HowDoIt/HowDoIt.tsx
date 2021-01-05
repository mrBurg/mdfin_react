import React, { ReactElement } from 'react';
import _ from 'lodash';

import style from './HowDoIt.module.scss';
import { WithDangerousHTML } from '@components/hocs';
import { LoanButton } from '@components/LoanButton';
import { TItem } from '../HowItWorks/@types';
import { THowDoItProps } from './@types';
import { gt } from '@utils';

export const HowDoIt = ({ title, items }: THowDoItProps): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>
        {_.map(items, (item: TItem, index: number) => {
          const { data } = item;

          return (
            <div key={index} className={style.item}>
              <div className={style.itemIcon} />
              <WithDangerousHTML tag={'p'} className={style.itemText}>
                {data}
              </WithDangerousHTML>
            </div>
          );
        })}
      </div>

      <LoanButton
        className={style.loanButton}
        label={gt.gettext('Register Loan')}
      />
    </section>
  );
};
