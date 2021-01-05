import { TOnInputChangeHandler } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

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
  type: string;
  type_id: number;
  onChangeHandler?: TOnInputChangeHandler;
  multiple?: boolean;
  loanStore?: LoanStore;
} & TFile;
