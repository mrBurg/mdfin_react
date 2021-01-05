import React, { ReactElement } from 'react';
import { Checkbox } from 'semantic-ui-react';
import classNames from 'classnames';

import style from './CheckboxWidget.module.scss';
import { WithTracking } from '@components/hocs';
import { WidgetRoles } from '@src/roles';
import { EFormEvents } from '@src/trackingConstants';
import { TCheckboxWidgetProps } from './@types';

export const CheckboxWidget = (props: TCheckboxWidgetProps): ReactElement => {
  const { className, label, name, isValid, ...checkboxPorps } = props;

  return (
    <WithTracking
      id={`CheckboxWidget-${WidgetRoles.checkbox}`}
      events={[EFormEvents.CHANGE]}
    >
      <Checkbox
        className={classNames(style.checkbox, className, {
          [style.error]: isValid,
        })}
        label={label}
        name={name}
        role={WidgetRoles.checkbox}
        {...checkboxPorps}
      />
    </WithTracking>
  );
};
