import { TAppDealParams } from '../../../stores/@types/loanStore';

export type TLoanInfoProps = {
  title: string;
  params: TAppDealParams; //TCreditParams | TDealInfo;
  className?: string;
};
