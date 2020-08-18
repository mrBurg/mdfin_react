import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { makeApiUri } from '../utils';
import { METHOD } from '../constants';
import { URIS } from '../routes';
import { checkStatus } from './apiUtils';
import { TJSON } from '../interfaces';
import { TOtpProps } from '../stores/OtpStore';

export class OtpApi {
  public getOtp = async (data: TOtpProps) => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: URIS.GET_OTP,
      data,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...otpData } = data;

      if (checkStatus(status)) return otpData;

      return { otpCode: null };
    } catch (err) {
      console.info(err);

      return { otpCode: null };
    }
  };

  public validateOtp = async (data: TJSON) => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: (URIS as TJSON)[`VALIDATE_OTP${data.urisKey}`], //URIS.VALIDATE_OTP,
      data,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...otpData } = data;

      if (checkStatus(status)) return otpData;
    } catch (err) {
      console.info(err);

      return null;
    }
  };
}
