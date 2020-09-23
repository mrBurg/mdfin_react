import { ReactElement, FC } from 'react';
import { Select } from 'semantic-ui-react';
import classNames from 'classnames';

import style from './SelectWidget.module.scss';

import { TSelectWidgetProps } from './@types';

export const SelectWidget: FC<TSelectWidgetProps> = ({
  className,
  ...props
}): ReactElement => {
  return <Select className={classNames(style.select, className)} {...props} />;
};
