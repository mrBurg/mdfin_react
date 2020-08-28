import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';
import { toJS } from 'mobx';

import {
  getFromLocalStorage,
  makeApiUri,
  getMD5,
  isDev,
  setToLocalStorage,
} from '../utils';
import {
  ACCESS_TOKEN_KEY,
  METHOD,
  HEADERS,
  REFRESH_TOKEN_KEY,
  SESSIONID_KEY,
  FINGER_PRINT,
} from '../constants';
import { URIS, URLS } from '../routes';
import { TJSON } from '../interfaces';
import { checkStatus } from './apiUtils';

export class CommonApi {
  public getSessionId() {
    return getFromLocalStorage(getMD5(SESSIONID_KEY));
  }

  public getAccessToken() {
    return getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
  }

  public getRefreshToken() {
    const token = getFromLocalStorage(getMD5(REFRESH_TOKEN_KEY));
    return token;
  }

  public getFingerPrint() {
    const fingerprint = getFromLocalStorage(getMD5(FINGER_PRINT));
    return fingerprint;
  }

  public checkClientStatus() {
    const token = getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
    return !!token;
  }

  // UNDER CONSTRUCTION //
  public async refreshToken(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const fingerprint = this.getFingerPrint();

    if (!(refreshToken && accessToken && fingerprint))
      return alert('NO refreshToken'), false;

    const data = {
      refreshToken: refreshToken,
      fingerprint: fingerprint,
    };

    let requestConfig = await this.postHeaderRequestConfig(
      URIS.REFRESH_TOKEN,
      data
    );

    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const {
        status,
        /* error,
        errorDescription, */
        accessToken,
        refreshToken,
        //...view
      } = data;

      if (isDev) console.info(toJS(data));
      //return null;

      if (checkStatus(status)) {
        console.log(status);
        setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), accessToken);
        setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), refreshToken);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      if (err.response.status == 401) {
        console.log('errResponse - 401: RELOGIN!!!');
        return Router.push(URLS.phoneverify), false;
      }
      console.info(err);
      return false;
    }
  }

  public getClientNextStep = async (data?: any) => {
    const requestConfig = this.getHeaderRequestConfig(
      URIS.GET_CLIENT_STEP,
      data
    );
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...view } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return { ...view };
    } catch (err) {
      console.info(err);
      return null;
    }
  };

  public defineNextStep = async (_view: string) => {};

  public postRequestConfig(url: string, data: TJSON) {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url,
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
      url,
      headers: {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }

  public getRequestConfig(url: string, data?: TJSON) {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url,
      headers: {
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }

  public getHeaderRequestConfig(url: string, data?: TJSON) {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return this.getRequestConfig(url, data);
    }

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url,
      headers: {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId(),
      },
      data,
    };
    return requestConfig;
  }

  /* Взять Справочник. Сервис /directory/{directoryName} */
  public getDirectory = async (url: string) => {
    const accessToken = this.getAccessToken();

    let headers: TJSON = {
      [HEADERS.SESSIONID]: this.getSessionId(),
    };

    if (accessToken) {
      headers = {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId(),
      };
    }

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url: url,
      headers,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...values } = data;
      //if (isDev) console.info(url, data.values);

      //переименовываем ключи: value=>text; id=>value
      /* let replaceKeyInObjectArray = (a: any, r: any) =>
        a.map((o: any) =>
          Object.keys(o)
            .map((key) => ({ [r[key] || key]: o[key] }))
            .reduce((a, b) => Object.assign({}, a, b))
        );

      const replaceMap = { value: 'text', id: 'value' };
      const newData = replaceKeyInObjectArray(values.values, replaceMap); */
      const newData = values.values;

      if (checkStatus(status)) return newData;

      return data;
    } catch (err) {
      console.info(err);
      return null;
    }
  };
}
