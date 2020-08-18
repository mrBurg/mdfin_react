import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';

//import 'react-datepicker/dist/react-datepicker.css';

//import style from './DatepickerWidget.module.scss';
export type THandleChangeDate = {
  (date: Date): Date;
};

type TDatepickerWidgetProps = {
  name: string;
  placeholderText: string;
  handleChangeDate: THandleChangeDate;
  selected?: Date;
};

export class DatepickerWidget extends PureComponent<TDatepickerWidgetProps> {
  render() {
    const { placeholderText, name } = this.props;

    return (
      <DatePicker
        name={name}
        placeholderText={placeholderText}
        selected={this.props.selected}
        onChange={this.props.handleChangeDate}
        dateFormat='dd/MM/yyyy'
      />
    );
  }
}
