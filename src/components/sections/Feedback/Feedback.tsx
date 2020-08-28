import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './Feedback.module.scss';

import { Logo } from '../../Logo';
import { TFeedback } from './@types';

export const Feedback: FC<TFeedback> = ({ className }): ReactElement => (
  <section className={classNames(className, style.feedback)}>
    <div className={style.container}>
      <Logo className={style.logo} />
      <div className={style.contacts}>
        <p className={classNames(style.contactsItem, style.email)}>
          credit@webvay.vn
        </p>
        <p className={classNames(style.contactsItem, style.phone)}>
          <a href={`tel:+84 - 12 - 345 - 67 - 89`}>
            {'+84 - 12 - 345 - 67 - 89'}
          </a>
        </p>
        <p className={classNames(style.contactsItem, style.workHour)}>24/7</p>
      </div>
    </div>
  </section>
);
