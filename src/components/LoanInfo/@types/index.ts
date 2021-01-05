import { TAppDealParams } from '@stores-types/loanStore';

export type TLoanInfoProps = {
  title: string;
  params: TAppDealParams; //TCreditParams | TDealInfo;
  className?: string;
};

export type TDataRow = {
  text: string;
  value?: string | number;
  link?: string;
};
