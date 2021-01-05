import { LoanStore } from '@src/stores/LoanStore';
import { OtpStore } from '@src/stores/OtpStore';
import { PageStore } from '@src/stores/PageStore';
import { TAccountUnit } from '@stores-types/loanStore';
import { TDirectoryItem } from '@stores-types/pageStore';

export type TAccountsFormProps = {
  title?: boolean;
  pageStore?: PageStore;
  loanStore?: LoanStore;
  className?: string;
  otpStore?: OtpStore;
} & TAccountUnit;

export type TFormattedAccount = TDirectoryItem & {
  bank_id?: number;
  selected?: boolean;
};
