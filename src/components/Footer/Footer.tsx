import React, { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './Footer.module.scss';

import { writeTag } from '../../utils';
import { TFooterProps } from './@types';

export const Footer: FC<TFooterProps> = ({
  copyright,
  tags,
  less,
}): ReactElement => {
  if (tags) copyright = writeTag(copyright, tags);

  return (
    <footer className={classNames(style.footer, { [style.less]: less })}>
      <div
        className={style.container}
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
    </footer>
  );
};
