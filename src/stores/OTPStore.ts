import Router from 'next/router';
import { observable, action, runInAction } from 'mobx';

import { OtpApi } from '../apis';
import { UserApi } from '../apis';
import UserStore from './UserStore';
import { URLS } from '../routes';
import { setToLocalStorage, getMD5, isDev, delay } from '../utils';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants';
import { TJSON } from '../interfaces';
import { showResend } from './../../src/config.json';

export type TOtpProps = {
  otpId?: number;
  phoneNumber?: string;
};

export default class OtpStore {
  @observable public otpReady: boolean = false;
  @observable public testerData: string = '';
  @observable public otpIsDisabled: boolean = false;
  @observable public otpCode: string = '';
  @observable public otpWrong: boolean = false;
  @observable public showResend: boolean = false;
  public urisKey: string = '';

  constructor(private otpApi: OtpApi, private userApi: UserApi) {}

  @action
  resend() {
    delay(() => {
      runInAction(() => {
        this.showResend = true;
        console.info('runInAction');
      });
    }, showResend);
  }

  @action
  public async updateOtpState({ otpId, phoneNumber }: TOtpProps) {
    this.otpReady = !!otpId;

    if (isDev) {
      const { otpCode } = await this.otpApi.getOtp({ otpId, phoneNumber });

      runInAction(() => {
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

      const { view } = await this.userApi.getClientStep(accessToken);

      return Router.push((URLS as TJSON)[view]);
    }

    runInAction(() => {
      this.otpIsDisabled = false;
      this.otpWrong = true;
    });
  }
}
