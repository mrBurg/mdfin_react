import React, { FC, ReactElement } from 'react';

import style from './FooterLess.module.scss';

type TFooterProps = {
  copyright: string;
};

export const FooterLess: FC<TFooterProps> = ({ copyright }): ReactElement => (
  <footer className={style.footer}>
    <div
      className={style.container}
      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  </footer>
);
