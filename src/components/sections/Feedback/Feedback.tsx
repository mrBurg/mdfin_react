import React, { ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Feedback.module.scss';
import { WithTracking } from '@components/hocs';
import { Logo } from '@components/Logo';
import { TJSON } from '@interfaces';
import { CALLBACK_TYPE, LINK_TARGET } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TFeedback } from './@types';

export const Feedback = (props: TFeedback): ReactElement => {
  const {
    className,
    phones,
    emails,
    workHour,
    termsAndConditions: { text, link },
  } = props;

  return (
    <section className={classNames(style.feedback, className)}>
      <div className={style.container}>
        <div className={style.logo}>
          <Logo />
        </div>
        <div className={style.contacts}>
          {_.map({ emails, phones }, (item, key) => {
            const { list, main } = item;

            return (
              <p
                key={key}
                className={classNames(style.contactsItem, style[key])}
              >
                <WithTracking
                  id={`Feedback-${WidgetRoles.link}`}
                  events={[EMouseEvents.CLICK]}
                >
                  <a
                    role={WidgetRoles.link}
                    href={`${(CALLBACK_TYPE as TJSON)[key]}:${list[main]}`}
                  >
                    {list[main]}
                  </a>
                </WithTracking>
              </p>
            );
          })}
          <p className={classNames(style.contactsItem, style.workHour)}>
            {workHour}
          </p>
          <p className={style.doc}>
            <WithTracking
              id={`Feedback-${WidgetRoles.link}`}
              events={[EMouseEvents.CLICK]}
            >
              <a
                role={WidgetRoles.link}
                className={style.link}
                href={link}
                target={LINK_TARGET.BLANK}
              >
                {text}
              </a>
            </WithTracking>
          </p>
        </div>
      </div>
    </section>
  );
};
