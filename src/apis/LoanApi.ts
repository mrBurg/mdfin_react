import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { checkStatus } from './apiUtils';
import { getMD5, setToLocalStorage, isDev, handleErrors } from '../utils';
import { SESSION_ID_KEY } from '../constants';
import { TJSON } from '../interfaces';
import { TProductsParams } from '../stores/@types/loanStore';
import { CommonApi } from '.';

export class LoanApi extends CommonApi {
  public getProducts = async (
    requestConfig: AxiosRequestConfig
  ): Promise<TProductsParams | void> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...productsParams } = data;

      if (checkStatus(status)) return productsParams;
    } catch (err) {
      handleErrors(err);
    }
  };

  public calculate = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data, headers }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...creditParams } = data;

      if (checkStatus(status)) {
        setToLocalStorage(getMD5(SESSION_ID_KEY), headers['sessionid']);

        return creditParams;
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  public wizardStart = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...responseDate } = data;

      if (checkStatus(status)) return responseDate;
    } catch (err) {
      handleErrors(err);
    }
  };

  public cabinetSign = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...otpData } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) {
        return { ...otpData };
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  //API погашение из ЛК (и сайта?)
  public cabinetPay = async (requestConfig: TJSON): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...respData } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return respData;
    } catch (err) {
      handleErrors(err);
    }
  };

  public cabinetDecline = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);

      if (isDev) console.info(data);
    } catch (err) {
      handleErrors(err);
    }
  };

  public async uploadAttachment(
    requestConfig: AxiosRequestConfig
  ): Promise<any> {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...attachmentsData } = data;

      if (checkStatus(status)) return attachmentsData;
    } catch (err) {
      handleErrors(err);
    }
  }
}
