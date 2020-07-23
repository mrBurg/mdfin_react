import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { makeStaticUrl } from '../utils';
import { METHOD } from '../constants';
import { URIS } from '../routes';

export class PaymentApi {
  public fetchFormData = async () => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeStaticUrl(),
      method: METHOD.GET,
      url: URIS.PAYMENT_FORM,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);

      return data;
    } catch (err) {
      console.info(err);

      return null;
    }
  };
}
