import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './Contacts.module.scss';

type TListProps = Array<string>;

type TItemProps = {
  title: string;
  list: TListProps;
};

type TContactsProps = {
  [key: string]: TItemProps;
};

const renderContacts = (props: TContactsProps) => {
  const items = [];

  for (let item in props) {
    items.push(
      <section key={item} className={style.section}>
        {renderItem(props[item], item)}
      </section>
    );
  }

  return items;
};

const renderItem = ({ title, list }: TItemProps, name: string) => {
  return (
    <>
      <div className={classNames(style.icon, style[name])} />
      <p className={style.title}>{title}</p>
      <ul className={style.list}>{renderList(list)}</ul>
    </>
  );
};

const renderList = (list: TListProps) =>
  list.map((item: string, index: number) => (
    <li key={index}>
      <a href={`callto:${item}`}>{item}</a>
    </li>
  ));

export const Contacts: FC<TContactsProps> = (props): ReactElement => (
  <div className={style.contacts}>{renderContacts(props)}</div>
);
