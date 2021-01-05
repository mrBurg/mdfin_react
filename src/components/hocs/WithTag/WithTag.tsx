import _ from 'lodash';
import React, { createElement, ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import classNames from 'classnames';

import style from './WithTag.module.scss';
import { WithDangerousHTML } from '..';
import { TWithTagProps } from './@types';

export const WithTag = (props: TWithTagProps): ReactElement => {
  const { className, tags, ...restProp } = props;
  let { children } = props;

  _.map(tags, (val, key) => {
    const regExp = new RegExp(`<${key}.*?${key}>|<${key}\\s?\\/>`, 'gm');

    if (regExp.test(children)) {
      return (children = children.replace(
        regExp,
        renderToString(createElement(key, null, val))
      ));
    }
  });

  return (
    <WithDangerousHTML
      className={classNames(style.tag, className)}
      {...restProp}
    >
      {children}
    </WithDangerousHTML>
  );
};
