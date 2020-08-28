import { ReactElement, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Notification.module.scss';

import { CONSTRUCTOR } from '../../constants';
import { TNotification } from './@types';

export const Notification = ({
  notifications,
  className,
}: TNotification): ReactElement => {
  let content: ReactElement | Array<ReactElement>;

  switch (notifications.constructor.name) {
    case CONSTRUCTOR.STRING: {
      content = <p className={style.text}>notifications</p>;
      break;
    }
    case CONSTRUCTOR.ARRAY: {
      content = _.map(notifications, (item, key, arr) => {
        return (
          <Fragment key={key}>
            <p className={style.text}>{item}</p>
            {key < arr.length - 1 && <hr className={style.separator} />}
          </Fragment>
        );
      });
      break;
    }
    default:
      content = <p>Default Notification</p>;
  }

  return (
    <div className={classNames(style.notification, className)}>{content}</div>
  );
};
