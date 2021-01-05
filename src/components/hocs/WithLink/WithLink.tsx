import _ from 'lodash';
import React, { ReactElement, createElement } from 'react';
import { renderToString } from 'react-dom/server';
import classNames from 'classnames';

import style from './WithLink.module.scss';
import { WithDangerousHTML } from '..';
import { TWithLinkProps } from './@types';

export const WithLink = (props: TWithLinkProps): ReactElement => {
  const { linkClassName, links, ...restProps } = props;
  let { children } = props;

  const items = children.split(/<|\s?\/>/gm);

  children = _.map(items, (item) => {
    if (links.hasOwnProperty.call(links, item)) {
      return renderToString(
        createElement(
          'a',
          {
            className: classNames(style.link, linkClassName),
            href: links[item].link,
            target: links[item].target,
          },
          links[item].text
        )
      );
    }

    return item;
  }).join('');

  /* _.map(links, (val, key) => {
    let { link, target = '_self', text } = val;

    const regExp = new RegExp(
      `(<${key}>).*?(<\\\/${key}>)|(<${key}\\\s*\\\/>)`,
      'gm'
    );

    if (regExp.test(children)) {
      return (children = children.replace(
        regExp,
        `<a class='${classNames(
          style.link,
          linkClassName
        )}' href='${link}' target='${target}'>${text}<\/a>`
      ));
    }
  }); */

  return <WithDangerousHTML {...restProps}>{children}</WithDangerousHTML>;
};
