import React, { ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './RepaymentInfo.module.scss';
import { WithTracking, WithDangerousHTML } from '@components/hocs';
import { NonStandardRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TRepaymentInfoProps, TDataList } from './@types';

export const RepaymentInfo = ({
  dataList,
}: TRepaymentInfoProps): ReactElement => {
  return (
    <div className={style.container}>
      {_.map(dataList, (item: TDataList, index: number) => {
        const { title, text } = item;

        return (
          <section key={index} className={style.section}>
            <div className={classNames(style.icon, style[`icon${index}`])} />
            <div className={style.sectionText}>
              {title && <h3 className={style.title}>{title}</h3>}
              {text && (
                <WithTracking
                  id={`RepaymentInfo-${NonStandardRoles.textWithHTML}`}
                  events={[EMouseEvents.CLICK]}
                >
                  <WithDangerousHTML className={style.text}>
                    {text}
                  </WithDangerousHTML>
                </WithTracking>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};
