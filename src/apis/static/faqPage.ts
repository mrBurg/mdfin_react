import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { HTTPS_HOST, HTTPS_PORT, PO_STATIC, METHOD } from '../../constants';
import { URIS } from '../../routes';

type TFetchCopyrightData = {
  less: boolean;
};

export const fetchPageData = async (params?: TFetchCopyrightData) => {
  let requestConfig: AxiosRequestConfig = {
    baseURL: `${HTTPS_HOST}:${HTTPS_PORT + PO_STATIC}`,
    method: METHOD.GET,
    url: URIS.FAQ_PAGE,
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
