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
const renderData = (data: TData) => {
  const { text, list } = data;

  return (
    <>
      {text && (
        <p className={style.text} dangerouslySetInnerHTML={{ __html: text }} />
      )}
      {list && <ul className={style.list}>{renderList(list)}</ul>}
    </>
  );
};

const renderList = (list: Array<string>) =>
  list.map((item: string, index: number) => <li key={index}>{item}</li>);

const renderPaymentInfo = (props: Array<TDataList>) =>
  props.map((item: TDataList, index: number) => {
    const { title, ...data } = item;

    return (
      <section key={index} className={style.section}>
        <div className={classNames(style.icon, style[`icon${index}`])} />
        <div>
          {title && <h3 className={style.title}>{title}</h3>}
          {renderData(data)}
        </div>
      </section>
    );
  });

export const PaymentInfo: FC<TPaymentInfoProps> = ({
  dataList,
}): ReactElement => {
  return <div className={style.container}>{renderPaymentInfo(dataList)}</div>;
};
