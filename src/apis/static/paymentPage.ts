import { URIS } from '../../routes';
import { fetchPageStatic } from '../commonMethods';

export const fetchPageData = async () => {
  return await fetchPageStatic({ url: URIS.PAYMENT });
};
