import { DOC_TYPE } from '../../../../constants';
import { UserStore } from '../../../../stores/UserStore';

export type TDocuments = {
  staticData: any;
  userStore?: UserStore;
};

export type TDoc = {
  title: string;
};

export type TDocumentsState = {
  wrongaccount: boolean;
  [DOC_TYPE.ATTACHMENTS]: Array<TDoc>;
  [DOC_TYPE.ACCOUNTS]: Array<TDoc>;
  [DOC_TYPE.DOCS]: Array<TDoc>;
  [DOC_TYPE.OTHER]: Array<TDoc>;
};
