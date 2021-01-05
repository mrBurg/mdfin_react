import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { CommonApi } from '.';
import { handleErrors } from '../utils';
import { TReceivedValue } from './@types/otpApi';
import { checkStatus } from './apiUtils';

export class OtpApi extends CommonApi {
  public getOtp = async (
    requestConfig: AxiosRequestConfig
  ): Promise<TReceivedValue> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, ...otpData } = data;

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
      const { status, ...otpData } = data;

      if (checkStatus(status)) return otpData;
    } catch (err) {
      handleErrors(err);
    }
  };
}
