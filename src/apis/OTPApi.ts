import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { CommonApi } from '.';
import { handleErrors } from '../utils';
import { checkStatus } from './apiUtils';

export class OtpApi extends CommonApi {
  public getOtp = async (
    requestConfig: AxiosRequestConfig
  ): Promise<{ otpCode: any }> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...otpData } = data;

      if (checkStatus(status)) return otpData;

      return { otpCode: null };
    } catch (err) {
      handleErrors(err);

      return { otpCode: null };
    }
  };

  public validateOtp = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...otpData } = data;

      if (checkStatus(status)) return otpData;
    } catch (err) {
      handleErrors(err);
    }
  };
}
