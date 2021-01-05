import axios, { AxiosResponse } from 'axios';

import { TFetchStaticDataProps } from '@interfaces';
import { URIS } from '@routes';
import { handleErrors, makeStaticUri } from '@utils';
import { fetchTemporaryData } from './temporaryData';

export const fetchStaticData = async (
  params: TFetchStaticDataProps
): Promise<any> => {
  try {
    const temporaryData = fetchTemporaryData(params);

    if (temporaryData) return temporaryData;

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

export const fetchCopyright = async (): Promise<any> => {
  return await fetchStaticData({
    block: 'copyright',
    path: 'static',
  });
};
