import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { makeApiUrl, checkStatus } from '../utils';
import { METHOD } from '../constants';
import { APIS_URIS } from '../routes';

type TGetOtp = {
  otpId: number;
};

export class OTPApi {
  public getOtp = async (data: TGetOtp) => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUrl(true),
      method: METHOD.POST,
      url: APIS_URIS.GET_OTP,
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
  /* if (isDev) {
          const { status, ...otpCode } = await this.getOtp(otpData);

          if (checkStatus(status))
            otpData = {
              ...otpData,
              testData: otpCode,
            };
        } */
}
