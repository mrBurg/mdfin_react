import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './HowItWorks.module.scss';

type TItem = {
  data: string;
};

type THowItWorks = {
  title: string;
  items: Array<TItem>;
};

const renderItems = (items: Array<TItem>): Array<ReactElement> => {
  return items.map(
    (item: TItem, index: number): ReactElement => {
      const { data } = item;

      return (
        <div key={index} className={style.item}>
          <div className={style.itemData}>
            <div
              className={classNames(style.itemIcon, style[`itemIcon${index}`])}
            />
            <div dangerouslySetInnerHTML={{ __html: data }} />
          </div>
        </div>
      );
    }
  );
};

export const HowItWorks: FC<THowItWorks> = ({ title, items }): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>{renderItems(items)}</div>
    </section>
  );
};
