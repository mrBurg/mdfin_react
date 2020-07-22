import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './NotDifficult.module.scss';

type TNotDifficult = {
  title: string;
  description: string;
};

export const NotDifficult: FC<TNotDifficult> = ({
  title,
  description,
}): ReactElement => {
  return (
    <section className={style.section}>
      <div className={classNames(style.item, style.image)} />
      <div className={classNames(style.item, style.content)}>
        <h2 className={style.title}>{title}</h2>
        <div className={style.description}>{description}</div>
      </div>
    </section>
  );
};
