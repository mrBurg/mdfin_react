import { FC, ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './RepaymentInfo.module.scss';
import { TRepaymentInfoProps, TDataList } from './@types';

export const RepaymentInfo: FC<TRepaymentInfoProps> = ({
  dataList,
}): ReactElement => {
  return (
    <div className={style.container}>
      {_.map(dataList, (item: TDataList, index: number) => {
        const { title, text, list } = item;

        return (
          <section key={index} className={style.section}>
            <div className={classNames(style.icon, style[`icon${index}`])} />
            <div className={style.sectionText}>
              {title && <h3 className={style.title}>{title}</h3>}
              {text && (
                <p
                  className={style.text}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )}
              {list && (
                <ul className={style.list}>
                  {_.map(list, (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};
