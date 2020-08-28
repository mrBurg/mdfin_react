import { ReactElement, FC } from 'react';

import style from './Welcome.module.scss';
import { ProductSelector } from '../../ProductSelector';
import { TWelcomeProps } from './@types';

export const Welcome: FC<TWelcomeProps> = ({
  title,
  description,
}): ReactElement => {
  return (
    <section className={style.section}>
      <h1 className={style.title}>{title}</h1>
      <p
        className={style.description}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <ProductSelector className={style.productSelector} />
    </section>
  );
};
