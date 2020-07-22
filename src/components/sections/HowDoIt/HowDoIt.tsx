import { FC, ReactElement } from 'react';

import style from './HowDoIt.module.scss';

import LoanButton from '../../LoanButton';

type TItem = {
  data: string;
};

type THowDoIt = {
  title: string;
  items: Array<TItem>;
};

const renderItems = (items: Array<TItem>): Array<ReactElement> => {
  return items.map(
    (item: TItem, index: number): ReactElement => {
      const { data } = item;

      return (
        <div key={index} className={style.item}>
          <div className={style.itemIcon} />
          <div
            className={style.itemText}
            dangerouslySetInnerHTML={{ __html: data }}
          />
        </div>
      );
    }
  );
};

export const HowDoIt: FC<THowDoIt> = ({ title, items }): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>{renderItems(items)}</div>
      <LoanButton className={style.loanButton} />
    </section>
  );
};
