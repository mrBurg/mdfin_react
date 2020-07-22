import { URIS } from '../../routes';
import { fetchPageStaticData } from '../commonMethods';

export const fetchPageData = async () => {
  return await fetchPageStaticData({ url: URIS.FAQ_PAGE });
};
