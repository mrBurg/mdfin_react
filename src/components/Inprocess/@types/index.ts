import { DOC_TYPE } from '../../../constants';

export type TInprocess = {
  className?: string;
};

export type TDoc = {
  title: string;
};

export type TInprocessState = {
  [DOC_TYPE.OTHER]: Array<TDoc>;
};
