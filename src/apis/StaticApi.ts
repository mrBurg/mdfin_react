import axios, { AxiosResponse } from 'axios';

import { URIS } from '../routes';
import { makeStaticUri } from '../utils';
import { TFetchStaticDataProps } from '../interfaces';

export const fetchStaticData = async (params: TFetchStaticDataProps) => {
  try {
    const { data }: AxiosResponse = await axios.get(
      makeStaticUri(URIS.L10N_LIST),
      {
        params,
      }
    );

    return data;
  } catch (err) {
    console.info(err);

    return null;
  }
};

export const fetchCopyright = async () => {
  return await fetchStaticData({
    block: 'copyright',
    path: 'static',
  });
};
