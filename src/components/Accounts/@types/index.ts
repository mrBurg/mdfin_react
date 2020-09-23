import { SyntheticEvent } from 'react';
import { DropdownProps } from 'semantic-ui-react';

import { TAccountUnit } from '../../../stores/@types/loanStore';
import { PageStore } from '../../../stores/PageStore';
import { LoanStore } from '../../../stores/LoanStore';
import { OtpStore } from '../../../stores/OtpStore';

export type TOnSelectHandler = (
  event: SyntheticEvent<HTMLElement>,
  data: DropdownProps
) => void;

export type TAccountsProps = {
  pageStore?: PageStore;
  loanStore?: LoanStore;
  className?: string;
  otpStore?: OtpStore;
} & TAccountUnit;

export type TAccountsState = {
  addNewAccount: boolean;
};

export type TFormattedAccount = {
  value?: string | number;
  text?: string;
  bank_id?: number;
  index?: number;
  selected?: boolean;
};
