import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import { METHOD } from '../constants';
import { makeStaticUrl } from '../utils';

type TFetchPageStaticDataProps = {
  url: string;
  method?: Method;
};

export const fetchPageStaticData = async ({
  url,
  method = METHOD.GET,
}: TFetchPageStaticDataProps) => {
  let requestConfig: AxiosRequestConfig = {
    baseURL: makeStaticUrl(),
    method,
    url,
  };

  try {
    const { data }: AxiosResponse = await axios(requestConfig);

    return data;
  } catch (err) {
    console.info(err);

    return null;
  }
};
