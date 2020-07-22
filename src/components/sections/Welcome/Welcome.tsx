import { ReactElement, FC } from 'react';

import style from './Welcome.module.scss';
import ProductSelector from '../../ProductSelector';

export type TWelcomeProps = {
  title: string;
  description: string;
};

export const Welcome: FC<TWelcomeProps> = ({
  title,
  description,
}): ReactElement => {
  return (
    <section className={style.section}>
      <h2 className={style.title}>{title}</h2>
      <p
        className={style.description}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <ProductSelector className={style.productSelector} />
    </section>
  );
};
