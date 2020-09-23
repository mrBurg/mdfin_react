import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './PaymentInfo.module.scss';

type TData = {
  text?: string;
  list?: Array<string>;
};

type TDataList = {
  title: string;
} & TData;

type TPaymentInfoProps = {
  dataList: Array<TDataList>;
};

export const PaymentInfo: FC<TPaymentInfoProps> = ({
  dataList,
}): ReactElement => {
  return (
    <div className={style.container}>
      {dataList.map((item: TDataList, index: number) => {
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
                  {list.map((item: string, index: number) => (
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
