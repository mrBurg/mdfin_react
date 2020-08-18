import axios, { AxiosResponse } from 'axios';

import { makeStaticUri } from '../utils';
import { URIS } from '../routes';
import { TFetchStaticDataProps } from '../interfaces';

export class PaymentApi {
  public fetchFormStatic = async (params: TFetchStaticDataProps) => {
    try {
      const { data }: AxiosResponse = await axios.get(
        makeStaticUri(URIS.L10N_LIST),
        {
          params,
        }
      );

      return data;
    } catch (err) {
      console.info(err);

      return null;
    }
  };
}
