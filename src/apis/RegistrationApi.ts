import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { makeStaticUrl, makeApiUrl, checkStatus } from '../utils';
import { METHOD } from '../constants';
import { URIS, APIS_URIS } from '../routes';
import { TFormData } from '../stores/registrationStore';

export class RegistrationApi {
  public fetchFormStatic = async () => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeStaticUrl(),
      method: METHOD.GET,
      url: URIS.REGISTRATION_FORM,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);

      return data;
    } catch (err) {
      console.info(err);

      return null;
    }
  };

  public sendForm = async (data: TFormData) => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUrl(true),
      method: METHOD.POST,
      url: APIS_URIS.SEND_OTP,
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
