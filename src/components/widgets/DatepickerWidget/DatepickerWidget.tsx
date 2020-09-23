import React, { FC } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import classNames from 'classnames';

//import 'react-datepicker/dist/react-datepicker.css';
import style from './DatepickerWidget.module.scss';

export const DatepickerWidget: FC<ReactDatePickerProps> = (props) => {
  const { className, ...datepickerWidgetProps } = props;

  return (
    <DatePicker
      className={classNames(className, style.select)}
      {...datepickerWidgetProps}
    />
  );
};
