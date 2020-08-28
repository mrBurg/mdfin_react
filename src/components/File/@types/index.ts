import { TOnClickHandler } from '../../../interfaces';

export type TFile = {
  title: string;
  type: string;
  addFileHandler?: TOnClickHandler;
  className?: string;
};
