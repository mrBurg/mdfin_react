import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './HowItWorks.module.scss';

type TItem = {
  data: string;
};

type THowItWorksProps = {
  title: string;
  items: Array<TItem>;
};

export const HowItWorks: FC<THowItWorksProps> = ({
  title,
  items,
}): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>
        {items.map(
          (item: TItem, index: number): ReactElement => {
            const { data } = item;

            return (
              <div key={index} className={style.item}>
                <div className={style.itemData}>
                  <div
                    className={classNames(
                      style.itemIcon,
                      style[`itemIcon${index}`]
                    )}
                  />
                  <div>
                    <span dangerouslySetInnerHTML={{ __html: data }} />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
};
