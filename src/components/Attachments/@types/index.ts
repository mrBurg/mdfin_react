import { TDocument } from '../../../stores/@types/loanStore';

export type TAttachments = {
  documents: Array<TDocument>;
  type: number;
  title: string;
  full?: boolean;
  multiple?: boolean;
  valid?: boolean;
};
