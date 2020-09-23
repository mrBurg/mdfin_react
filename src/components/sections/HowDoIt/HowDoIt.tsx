import { FC, ReactElement } from 'react';

import style from './HowDoIt.module.scss';

import { LoanButton } from '../../LoanButton';
import { THowDoItProps, TItem } from './@types';
import _ from 'lodash';
import { gt } from '../../../utils';

export const HowDoIt: FC<THowDoItProps> = ({ title, items }): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>
        {_.map(
          items,
          (item: TItem, index: number): ReactElement => {
            const { data } = item;

            return (
              <div key={index} className={style.item}>
                <div className={style.itemIcon} />
                <p
                  className={style.itemText}
                  dangerouslySetInnerHTML={{ __html: data }}
                />
              </div>
            );
          }
        )}
      </div>

      <LoanButton
        className={style.loanButton}
        label={gt.gettext('Register Loan')}
      />
    </section>
  );
};
