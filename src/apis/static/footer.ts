import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { METHOD } from '../../constants';
import { URIS } from '../../routes';
import { makeStaticUrl } from '../../utils';

type TFetchCopyrightData = {
  footerLess: boolean;
};

export const fetchCopyright = async (params?: TFetchCopyrightData) => {
  let requestConfig: AxiosRequestConfig = {
    baseURL: makeStaticUrl(),
    method: METHOD.GET,
    url: URIS.COPYRIGHT,
    params,
  };

  try {
    const { data }: AxiosResponse = await axios(requestConfig);

    return data;
  } catch (err) {
    console.info(err);

    return null;
  }
};
