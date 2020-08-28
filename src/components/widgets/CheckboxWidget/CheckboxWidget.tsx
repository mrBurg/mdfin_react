import { FC, ReactElement } from 'react';
import { Checkbox } from 'semantic-ui-react';
import classNames from 'classnames';

import style from './CheckboxWidget.module.scss';
import { TCheckboxWidgetProps } from './@types';

export const CheckboxWidget: FC<TCheckboxWidgetProps> = ({
  className,
  label,
}): ReactElement => {
  return (
    <Checkbox className={classNames(style.checkbox, className)} label={label} />
  );
};
