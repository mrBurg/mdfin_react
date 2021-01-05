import React, { ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Contacts.module.scss';
import { WithTracking } from '@components/hocs';
import { TJSON } from '@interfaces';
import { CALLBACK_TYPE } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { Feedback } from '../Feedback';
import { TFeedback } from '../Feedback/@types';
import { TContactsProps } from './@types';

export const Contacts = (props: TContactsProps): ReactElement => {
  const { phones, emails } = props;

  return (
    <>
      <div className={style.contacts}>
        {_.map({ phones, emails }, (itemType, itemKey) => {
          const { title, list } = itemType;
          const type: string = (CALLBACK_TYPE as TJSON)[itemKey];

          return (
            <section key={itemKey} className={style.section}>
              <div className={classNames(style.icon, style[itemKey])} />
              <div className={style.sectionContent}>
                <p className={style.sectionTitle}>{title}</p>
                <ul className={style.list}>
                  {_.map(list, (item: string, index) => (
                    <li key={index}>
                      <WithTracking
                        id={`Contacts-${WidgetRoles.link}`}
                        events={[EMouseEvents.CLICK]}
                      >
                        <a
                          role={WidgetRoles.link}
                          href={type ? `${type}:${item}` : item}
                        >
                          {item}
                        </a>
                      </WithTracking>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
      <Feedback className={style.feedback} {...(props as TFeedback)} />
    </>
  );
};
