import Router from 'next/router';
import { observable, action, runInAction } from 'mobx';

import { OtpApi, CommonApi } from '../apis';
import { UserStore } from './UserStore';
import { URLS } from '../routes';
import { setToLocalStorage, getMD5, isDev, isTest, delay } from '../utils';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants';
import { TJSON } from '../interfaces';
import { showResend } from './../../src/config.json';
import { TOtpProps } from './@types/otpStore';

export class OtpStore {
  @observable public otpReady: boolean = false;
  @observable public testerData: string = '';
  @observable public otpIsDisabled: boolean = false;
  @observable public otpCode: string = '';
  @observable public otpWrong: boolean = false;
  @observable public showResend: boolean = false;
  @observable public validForm: boolean = true;
  public urisKey: string = '';

  constructor(private otpApi: OtpApi, private commonApi: CommonApi) {}

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
  public async updateOtpState({ otpId, phoneNumber }: TOtpProps) {
    this.otpReady = !!otpId;
    this.showResend = false;

    if (isDev || isTest) {
      const { otpCode } = await this.otpApi.getOtp({ otpId, phoneNumber });

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
    this.otpCode = '';
    this.otpWrong = false;
    this.showResend = false;
  }

  public async validateOtp({ userData, fingerprint }: UserStore) {
    const authRes = await this.otpApi.validateOtp({
      ...userData,
      fingerprint,
      otpCode: this.otpCode,
      urisKey: this.urisKey,
    });

    if (authRes) {
      const { accessToken, refreshToken } = authRes;

      runInAction(() => {
        this.otpIsDisabled = true;
      });

      setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), accessToken);
      setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), refreshToken);

      const { view } = await this.commonApi.getClientNextStep(accessToken); //const { view } = await this.userApi.getClientStep(accessToken);

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
}
