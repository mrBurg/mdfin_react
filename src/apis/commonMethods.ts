import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import { METHOD } from '../constants';
import { makeStaticUrl } from '../utils';

type TFetchPageStaticProps = {
  url: string;
  method?: Method;
};

export const fetchPageStatic = async ({
  url,
  method = METHOD.GET,
}: TFetchPageStaticProps) => {
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
