import React, { ReactElement } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import classNames from 'classnames';

//import 'react-datepicker/dist/react-datepicker.css';
import style from './DatepickerWidget.module.scss';
import { WithTracking } from '@components/hocs';
import { LandmarkRoles } from '@src/roles';
import { EFormEvents } from '@src/trackingConstants';

export const DatepickerWidget = (props: ReactDatePickerProps): ReactElement => {
  const { className, ...datepickerWidgetProps } = props;

  return (
    <WithTracking
      id={`DatepickerWidget-${LandmarkRoles.form}`}
      events={[
        EFormEvents.CHANGE,
        // EWidgetEvent.CALENDAR_OPEN,
        // EWidgetEvent.INPUT_CLICK,
        // EFormEvents.SELECT,
      ]}
    >
      <DatePicker
        className={classNames(style.select, className)}
        {...datepickerWidgetProps}
      />
    </WithTracking>
  );
};
