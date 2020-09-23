import { FC, ReactElement } from 'react';

import { CellDataProps } from './@types';
import { TJSON } from '../../../interfaces';
import { divideDigits, gt } from '../../../utils';
import moment from 'moment';

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

export function renderCellData({
  type,
  value,
}: CellDataProps): string | number {
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

export const CellData: FC<CellDataProps> = (props): ReactElement => {
  return <>{renderCellData(props)}</>;
};
