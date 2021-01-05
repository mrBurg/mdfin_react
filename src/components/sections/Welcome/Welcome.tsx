import { WithDangerousHTML } from '@components/hocs';
import { ProductSelector } from '@components/ProductSelector';
import React, { ReactElement } from 'react';
import { TWelcomeProps } from './@types';

import style from './Welcome.module.scss';

export const Welcome = ({
  title,
  description,
}: TWelcomeProps): ReactElement => {
  return (
    <section className={style.section}>
      <h1 className={style.title}>{title}</h1>
      <WithDangerousHTML tag={'p'} className={style.description}>
        {description}
      </WithDangerousHTML>
      <ProductSelector className={style.productSelector} />
    </section>
  );
};
