import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './Footer.module.scss';

type TFooterProps = {
  copyright: string;
  less?: boolean;
};

export const Footer: FC<TFooterProps> = ({ copyright, less }): ReactElement => (
  <footer className={classNames(style.footer, { [style.less]: less })}>
    <div
      className={style.container}
      dangerouslySetInnerHTML={{ __html: copyright }}
    />
  </footer>
);
