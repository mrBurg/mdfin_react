import { FC, ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './HowItWorks.module.scss';
import { THowItWorksProps, TItem } from './@types';

export const HowItWorks: FC<THowItWorksProps> = ({
  title,
  items,
}): ReactElement => {
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
