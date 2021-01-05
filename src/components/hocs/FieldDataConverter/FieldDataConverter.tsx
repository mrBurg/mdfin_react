import React, { FC } from 'react';
import moment from 'moment';
import { TJSON } from '@interfaces';
import { divideDigits, gt } from '@utils';
import { TFieldDataConverterProps } from './@types';

const fields: TJSON = {
  amount: 'Currency',
  term: 'Day',
  extensionAmount: 'Currency',
  totalAmount: 'Currency',
  dateTo: 'Date',
  appnum: 'link',

  closingDate: 'Date',
  lastPaymentDate: 'Date',
  lastPaymentAmount: 'Currency',
  dealNo: 'link',
};

function renderFieldDataConverter({
  type,
  value,
}: TFieldDataConverterProps): string | number {
  switch (fields[type]) {
    case 'Currency':
      return `${divideDigits(Number(value))} ${gt.gettext(fields[type])}`;
    case 'Day':
      return `${value} ${gt.ngettext(fields[type], 'Day', Number(value))}`;
    case 'Date':
      return `${moment(value).format('DD/MM/YY')}`;
    default:
      return value;
  }
}

export const FieldDataConverter: FC<TFieldDataConverterProps> = (props) => {
  return <>{renderFieldDataConverter(props)}</>;
};
