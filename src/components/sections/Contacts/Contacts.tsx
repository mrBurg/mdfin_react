import { FC, ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Contacts.module.scss';
import { Feedback } from '../Feedback';

type TListProps = Array<string>;

type TItemProps = {
  title: string;
  list: TListProps;
};

type TContactsProps = {
  [key: string]: TItemProps;
};

type TIndex = number | string;

export const Contacts: FC<TContactsProps> = (props): ReactElement => (
  <>
    <div className={style.contacts}>
      {_.map(props, (itemType: TItemProps, itemKey: TIndex) => {
        const { title, list } = itemType;

        return (
          <section key={itemKey} className={style.section}>
            <div className={classNames(style.icon, style[itemKey])} />
            <div className={style.sectionContent}>
              <p className={style.sectionTitle}>{title}</p>
              <ul className={style.list}>
                {list.map((item: string, index: TIndex) => {
                  switch (itemKey) {
                    case 'phones':
                      return (
                        <li key={index}>
                          <a href={`callto:${item}`}>{item}</a>
                        </li>
                      );
                    case 'emails':
                      return (
                        <li key={index}>
                          <a href={`mailto:${item}`}>{item}</a>
                        </li>
                      );
                  }
                })}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
    <Feedback className={style.feedback} />
  </>
);
