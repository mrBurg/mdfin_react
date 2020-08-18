import { FC, ReactElement } from 'react';

import style from './HowDoIt.module.scss';

import LoanButton from '../../LoanButton';

type TItem = {
  data: string;
};

type THowDoItProps = {
  title: string;
  items: Array<TItem>;
};

export const HowDoIt: FC<THowDoItProps> = ({ title, items }): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>
        {items.map(
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

      <LoanButton className={style.loanButton} />
    </section>
  );
};
