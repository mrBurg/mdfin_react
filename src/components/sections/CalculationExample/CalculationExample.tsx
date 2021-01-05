import React, { ReactElement } from 'react';
import classNames from 'classnames';

import style from './CalculationExample.module.scss';

import { TCalculationExample } from './@types';

export const CalculationExample = (
  props: TCalculationExample
): ReactElement => {
  const { className, text } = props;

  return (
    <section className={classNames(style.calculationExample, className)}>
      <div className={style.container}>{text}</div>
    </section>
  );
};
