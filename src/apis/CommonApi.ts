import { AxiosRequestConfig } from 'axios';

import { getFromLocalStorage, makeApiUri, getMD5 } from '../utils';
import {
  ACCESS_TOKEN_KEY,
  METHOD,
  HEADERS,
  REFRESH_TOKEN_KEY,
  SESSIONID_KEY,
} from '../constants';
import { URIS } from '../routes';
import { TJSON } from '../interfaces';

export class CommonApi {
  public getAccessToken() {
    return getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
  }
  public getSessionId() {
    return getFromLocalStorage(getMD5(SESSIONID_KEY));
  }

  public getRefreshToken() {
    const token = getFromLocalStorage(getMD5(REFRESH_TOKEN_KEY));
    return token;
  }

  public checkClientStatus() {
    const token = getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
    return !!token;
  }

  public refreshToken() {
    // UNDER CONSTRUCTION //
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    console.log(accessToken);
    console.log(refreshToken);
  }

  public postRequestConfig(url: string, data: TJSON) {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: (URIS as TJSON)[`${url}`],
      headers: {
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }

  public postHeaderRequestConfig(url: string, data: TJSON) {
    const accessToken = this.getAccessToken();

    if (!accessToken) return this.postRequestConfig(url, data);

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: (URIS as TJSON)[`${url}`],
      headers: {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }

  public getRequestConfig(url: string, data: TJSON) {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url: (URIS as TJSON)[`${url}`],
      headers: {
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }

  public getHeaderRequestConfig(url: string, data: TJSON) {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return this.getRequestConfig(url, data);
    }

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url: (URIS as TJSON)[`${url}`],
      headers: {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }
}
