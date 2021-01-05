import Router from 'next/router';
import { observable, action, runInAction } from 'mobx';
import { AxiosRequestConfig } from 'axios';
import { TJSON } from '@interfaces';
import { URIS, URLS } from '@routes';
import { OtpApi, fetchStaticData } from '@src/apis';
import { METHOD, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@src/constants';
import {
  isDev,
  isTest,
  makeApiUri,
  setToLocalStorage,
  getMD5,
  delay,
} from '@utils';
import { TOtpFormStatic, TOtpProps } from './@types/otpStore';
import { UserStore } from './UserStore';
import { showResend } from '@src/config.json';

export class OtpStore {
  @observable public otpReady = false;
  @observable public testerData = '';
  @observable public otpIsDisabled = false;
  @observable public otpId: number | undefined = 0;
  @observable public otpCode = '';
  @observable public otpWrong = false;
  @observable public showResend = false;
  @observable public validForm = true;
  @observable otpFormStatic?: TOtpFormStatic;
  public urisKey = '';

  @observable public otpAgreeCheckbox = false;

  constructor(private otpApi: OtpApi) {}

  //To delete
  @action
  setOptReady(state: boolean): void {
    this.otpReady = state;
  }
  //end delete

  @action
  setValidForm(state: boolean): void {
    this.validForm = state;
  }

  /** Запуск таймера показа кнопки "Отправить ОТР снова" */
  @action
  resend(): void {
    delay(() => {
      runInAction(() => {
        this.showResend = true;
      });
    }, showResend);
  }

  @action
  public async updateOtpState({
    action,
    otpId,
    phoneNumber,
  }: TOtpProps): Promise<void> {
    this.otpReady = !!otpId;
    this.showResend = false;
    this.otpId = otpId;

    if (isDev || isTest) {
      const requestConfig: AxiosRequestConfig = {
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
        if (otpCode) console.info(`OTP: ${otpCode}`);
        this.testerData = otpCode;
      });
    }
  }

  @action
  public updateOtpDisabled(state: boolean): void {
    this.otpIsDisabled = state;
  }

  @action
  public updateOtpValue(otpCode: string): void {
    this.otpCode = otpCode;
  }

  @action
  public updateUrisKey(urisKey: string): void {
    this.urisKey = urisKey;
  }

  /** Очищаем поле ввода ОТР от ошибки (крассная рамка + сообщение) */
  @action
  public resetOtpWrong(): void {
    this.otpWrong = false;
  }

  public async initOtpForm(): Promise<void> {
    const otpFormStatic = await fetchStaticData({
      block: 'otp-form',
      path: 'form',
    });

    runInAction(() => {
      this.otpFormStatic = otpFormStatic;
    });
  }

  //После успешной валидации ОТП, сбрасываем все его параметры на дефолтные.
  @action
  public resetOtpParams(): void {
    this.otpReady = false;
    this.testerData = '';
    this.otpIsDisabled = false;
    this.otpId = 0;
    this.otpCode = '';
    this.otpWrong = false;
    this.showResend = false;
    this.otpAgreeCheckbox = false;
  }

  /** Валидация ОТП, при верификации номера телефона (логин/регистрация) */
  public async validateOtp(userStore: UserStore): Promise<void | boolean> {
    const { userData } = userStore;
    const data = {
      fingerprint: this.otpApi.getFingerPrint,
      otpCode: this.otpCode,
      ...userData,
    };

    const requestConfig: AxiosRequestConfig = {
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

  /** Валидация ОТП, при подписании заявки */
  public async cabinetConfirm(): Promise<void | boolean> {
    //return null;
    const { ...data } = { otpId: this.otpId, otpCode: this.otpCode };

    const requestConfig = this.otpApi.postHeaderRequestConfig(
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
