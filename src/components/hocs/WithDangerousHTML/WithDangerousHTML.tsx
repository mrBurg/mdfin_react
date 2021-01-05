import { createElement, FC } from 'react';

import { TWithDangerousHTMLProps } from './@types';

export const WithDangerousHTML: FC<TWithDangerousHTMLProps> = (
  props: TWithDangerousHTMLProps
) => {
  const { children, tag = 'div', className, ...restProps } = props;

  return createElement(tag, {
    ...restProps,
    className,
    dangerouslySetInnerHTML: {
      __html: children,
    },
  });
};
