import { TOnInputChangeHandler } from '../../../interfaces';
import { LoanStore } from '../../../stores/LoanStore';

type TFile = {
  title: string;
  className?: string;
};

export type TUploadedFile = {
  id: number;
  index: number;
  filename: string;
  url: string;
} & TFile;

export type TAddFile = {
  type: number;
  onChangeHandler?: TOnInputChangeHandler;
  multiple?: boolean;
  loanStore?: LoanStore;
} & TFile;
