import React, { ReactElement } from 'react';
import Select from 'react-select';
import classNames from 'classnames';

import style from './ReactSelectWidget.module.scss';
import { TReactSelectWidgetProps } from './@types';
import { formatForSelect } from './reactSelectWidgetUtils';

export const ReactSelectWidget = (
  props: TReactSelectWidgetProps
): ReactElement => {
  const {
    className,
    value,
    onBlur,
    onChange,
    options,
    invalid = false,
    isSearchable = false,
    ...restProps
  } = props;

  const optionsData = formatForSelect(options);
  const activeIndex = options.findIndex((item: any) => item.value == value);

  const selectProps = {
    className: classNames(
      'select-widget',
      style.select,
      {
        'select-widget--has-error': invalid,
      },
      className
    ),
    value: optionsData[activeIndex],
    classNamePrefix: 'select-widget',
    onBlur: onBlur
      ? function (this: HTMLInputElement): void {
          const { name, value } = this;

          onBlur({ name, value });
        }
      : void 0,
    onChange: function (this: HTMLInputElement, data: any): void {
      onChange({ name: this.name, value: data.value });
    },
    options: optionsData,
    isSearchable,
  };

  return <Select {...selectProps} {...restProps} />;
};
