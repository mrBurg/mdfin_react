import React, { ReactElement } from 'react';
import classNames from 'classnames';

import style from './Footer.module.scss';
import { WithTag } from '@components/hocs';
import { dynamicTagslist } from '@src/constants';
import { TFooterProps } from './@types';

export const Footer = ({ copyright, less }: TFooterProps): ReactElement => (
  <footer className={classNames(style.footer, { [style.less]: less })}>
    <WithTag className={style.container} tags={dynamicTagslist}>
      {copyright}
    </WithTag>
  </footer>
);
