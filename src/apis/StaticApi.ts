import axios, { AxiosResponse } from 'axios';

import { URIS } from '../routes';
import { handleErrors, makeStaticUri } from '../utils';
import { TFetchStaticDataProps } from '../interfaces';
import { fetchTemporaryData } from './temporaryData';

export const fetchStaticData = async (
  params: TFetchStaticDataProps
): Promise<any> => {
  const temporaryData = fetchTemporaryData(params);

  if (temporaryData) return temporaryData;

  try {
    const { data }: AxiosResponse = await axios.get(
      makeStaticUri(URIS.L10N_LIST),
      {
        params,
      }
    );

    return data;
  } catch (err) {
    handleErrors(err);
  }
};

export const fetchCopyright = async () => {
  return await fetchStaticData({
    block: 'copyright',
    path: 'static',
  });
};
