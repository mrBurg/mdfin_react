import React, { PureComponent } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import classNames from 'classnames';

//import 'react-datepicker/dist/react-datepicker.css';
import style from './DatepickerWidget.module.scss';

export class DatepickerWidget extends PureComponent<ReactDatePickerProps> {
  render() {
    const { className, ...props } = this.props;

    return (
      <DatePicker className={classNames(className, style.select)} {...props} />
    );
  }
}
