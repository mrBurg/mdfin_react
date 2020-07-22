import React, { FC, ReactElement } from 'react';

import style from './Footer.module.scss';

type TFooterProps = {
  copyright: string;
};

export const Footer: FC<TFooterProps> = ({ copyright }): ReactElement => (
  <footer className={style.footer}>
    <div
      className={style.container}
      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  </footer>
);
