import React, { ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './HowItWorks.module.scss';
import { WithDangerousHTML } from '@components/hocs';
import { THowItWorksProps, TItem } from './@types';

export const HowItWorks = ({
  title,
  items,
}: THowItWorksProps): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <div className={style.items}>
        {_.map(items, (item: TItem, index: number) => {
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
                <WithDangerousHTML>{data}</WithDangerousHTML>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
