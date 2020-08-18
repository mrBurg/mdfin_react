import { RESPONSE_STATUS } from '../constants';

export const checkStatus = (status: string): boolean => {
  switch (status) {
    case RESPONSE_STATUS.OK:
      return true;
    case RESPONSE_STATUS.ERROR:
      return false;
    default:
      return false;
  }
};
