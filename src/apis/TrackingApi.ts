import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import { METHOD } from '@src/constants';
import { makeApiUri, handleErrors } from '@utils';
import { CommonApi } from '.';
import { checkStatus } from './apiUtils';

export class TrackingApi extends CommonApi {
  public async initExternalTracking(params?: TJSON): Promise<any> {
    try {
      const requestConfig: AxiosRequestConfig = {
        baseURL: makeApiUri(),
        method: METHOD.GET,
        url: URIS.EXTERNAL_TRACKING,
        params,
      };

      const { data, headers }: AxiosResponse = await axios(requestConfig);
      const { status, ...externalTrackingData } = data;

      if (checkStatus(status)) return { ...externalTrackingData, headers };
    } catch (err) {
      handleErrors(err);
    }
  }
}
