import Router from 'next/router';
import { observable, action, runInAction } from 'mobx';

import { OtpApi } from '../apis';
import { UserStore } from './UserStore';
import { URLS, URIS } from '../routes';
import {
  setToLocalStorage,
  getMD5,
  isDev,
  isTest,
  delay,
  makeApiUri,
} from '../utils';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, METHOD } from '../constants';
import { TJSON } from '../interfaces';
import { showResend } from './../../src/config.json';
import { TOtpProps } from './@types/otpStore';
import { AxiosRequestConfig } from 'axios';

export class OtpStore {
  @observable public otpReady: boolean = false;
  @observable public testerData: string = '';
  @observable public otpIsDisabled: boolean = false;
  @observable public otpId: number | undefined = 0;
  @observable public otpCode: string = '';
  @observable public otpWrong: boolean = false;
  @observable public showResend: boolean = false;
  @observable public validForm: boolean = true;
  public urisKey: string = '';

  constructor(private otpApi: OtpApi) {}

  //To delete
  @action
  setOptReady(state: boolean) {
    this.otpReady = state;
  }
  //end delete

  @action
  setValidForm(state: boolean) {
    this.validForm = state;
  }

  @action
  resend() {
    delay(() => {
      runInAction(() => {
        this.showResend = true;
      });
    }, showResend);
  }

  @action
  public async updateOtpState({ action, otpId, phoneNumber }: TOtpProps) {
    this.otpReady = !!otpId;
    this.showResend = false;
    this.otpId = otpId;

    if (isDev || isTest) {
      let requestConfig: AxiosRequestConfig = {
        baseURL: makeApiUri(),
        method: METHOD.POST,
        url: URIS.GET_OTP,
        data: {
          action,
          otpId,
          phoneNumber,
        },
      };

      const { otpCode } = await this.otpApi.getOtp(requestConfig);

      runInAction(() => {
        console.info(`OTP: ${otpCode}`);
        this.testerData = otpCode;
      });
    }
  }

  @action
  updateOtpDisabled(state: boolean) {
    this.otpIsDisabled = state;
  }

  @action
  updateOtpValue(otpCode: string) {
    this.otpCode = otpCode;
  }

  @action
  updateUrisKey(urisKey: string) {
    this.urisKey = urisKey;
  }

  @action
  resetOtpWrong() {
    this.otpWrong = false;
  }

  //После успешной валидации ОТП, сбрасываем все его параметры на дефолтные.
  @action
  resetOtpParams() {
    this.otpReady = false;
    this.testerData = '';
    this.otpIsDisabled = false;
    this.otpId = 0;
    this.otpCode = '';
    this.otpWrong = false;
    this.showResend = false;
  }

  public async validateOtp(userStore: UserStore) {
    const { userData, fingerprint } = userStore;
    const data = { fingerprint, otpCode: this.otpCode, ...userData };

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: (URIS as TJSON)[`VALIDATE_OTP${this.urisKey}`],
      data,
    };

    const authRes = await this.otpApi.validateOtp(requestConfig);

    if (authRes) {
      const { accessToken, refreshToken } = authRes;

      runInAction(() => {
        this.otpIsDisabled = true;
      });

      setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), accessToken);
      setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), refreshToken);

      const { view } = await this.otpApi.getClientNextStep(accessToken);

      // после успешной валидации OTP, делаем сброс параметров OTP
      this.resetOtpParams();

      return Router.push((URLS as TJSON)[view]);
    }

    /* если ОТП не валидный */
    runInAction(() => {
      this.otpIsDisabled = false;
      this.otpWrong = true;
      this.updateOtpValue('');
    });
  }

  public async cabinetConfirm() {
    //return null;
    const { ...data } = { otpId: this.otpId, otpCode: this.otpCode };

    let requestConfig = this.otpApi.postHeaderRequestConfig(
      URIS.CABINET_CONFIRM,
      data
    );

    const authRes = await this.otpApi.validateOtp(requestConfig);

    if (authRes) {
      //const { accessToken } = authRes;

      runInAction(() => {
        this.otpIsDisabled = true;
      });

      const response = await this.otpApi.getClientNextStep();
      if (response) {
        const { view } = response;

        // после успешной валидации OTP, делаем сброс параметров OTP
        this.resetOtpParams();

        return Router.push((URLS as TJSON)[view]);
      }
      //return null;
    }

    /* если ОТП не валидный */
    runInAction(() => {
      this.otpIsDisabled = false;
      this.otpWrong = true;
      this.updateOtpValue('');
    });
  }
}
