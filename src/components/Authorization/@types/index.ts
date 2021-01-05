import { URIS_SUFFIX } from '@src/constants';

export type TAuthorizationProps = {
  page: URIS_SUFFIX;
};

export type TState = {
  name?: string;
  phoneNumber?: string;
  invalidFields: any[];
};
