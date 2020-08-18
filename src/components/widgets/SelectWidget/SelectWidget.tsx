import { FC, ReactElement } from 'react';
import { Select } from 'semantic-ui-react';
import classNames from 'classnames';

import style from './SelectWidget.module.scss';

type TOptions = {
  text: string;
  value: string;
};

type TSelectWidget = {
  options: Array<TOptions>;
  placeholder?: string;
  className?: string;
};

export const SelectWidget: FC<TSelectWidget> = ({
  placeholder,
  options,
  className,
}): ReactElement => {
  return (
    <Select
      options={options}
      placeholder={placeholder}
      className={classNames(style.select, className)}
    />
  );
};
