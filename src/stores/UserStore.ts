import { observable, action, runInAction } from 'mobx';
import _ from 'lodash';
import { AxiosRequestConfig } from 'axios';
import Router from 'next/router';
import moment from 'moment';
import { GetResult } from '@fingerprintjs/fingerprintjs';
import { CurrentDeviceInterface } from 'current-device';
import { TJSON } from '@interfaces';
import { URLS, URIS } from '@routes';
import { UserApi } from '@src/apis';
import { FINGER_PRINT_KEY, METHOD, SESSION_ID_KEY } from '@src/constants';
import {
  setToLocalStorage,
  getMD5,
  makeApiUri,
  handleErrors,
  setCookie,
} from '@utils';
import {
  TUserData,
  TUserAddress,
  TUserContacts,
  TUserJob,
  TUserObligatory,
} from './@types/userStore';
import { OtpStore } from './OtpStore';

export class UserStore {
  private callbackSequence: (() => void)[] = [];
  private gettingToken = false;
  @observable public userData: TUserData = {};
  @observable public userDataAddress: TUserAddress = {};
  @observable public userDataContacts: TUserContacts[] = [];
  @observable public userDataJob: TUserJob = {};
  @observable public userLoggedIn = false;
  public fingerprint?: GetResult;
  public device?: CurrentDeviceInterface = void 0;
  public session_id?: string = void 0;

  constructor(private userApi: UserApi) {}

  private completeCalls(): any {
    _.map(this.callbackSequence, (item) => {
      item();
    });

    this.gettingToken = false;
    this.callbackSequence = [];
  }

  public fetchWithAuth(callback: () => void, tokenRequired = true): void {
    const accessToken = this.userApi.getAccessToken;

    this.callbackSequence.push(callback);

    if (accessToken) {
      if (!this.gettingToken) {
        this.gettingToken = true;

        const date = moment.now() / 1000;

        try {
          const { exp, iat } = JSON.parse(atob(accessToken.split('.')[1]));

          if (date <= iat || date >= exp) {
            this.userApi
              .refreshToken()
              .then(() => {
                this.completeCalls();
                return;
              })
              .catch((err) => {
                handleErrors(err);
              });
          } else {
            this.completeCalls();
          }
        } catch (err) {
          this.userApi
            .refreshToken()
            .then(() => {
              this.completeCalls();
              return;
            })
            .catch((err) => {
              handleErrors(err);
            });
        }
      }
    } else {
      if (tokenRequired && Router.route != URLS.HOME) {
        console.info(`Redirect to ${URLS.HOME}`);
        Router.push(URLS.HOME);
      }

      this.completeCalls();
    }
  }

  @action
  public updateUserState(): void {
    this.userLoggedIn = Boolean(this.userApi.getAccessToken);
  }

  public logOut = (): void => {
    const response = this.userApi.postHeaderRequestConfig(URIS.LOGOUT, {
      refreshToken: this.userApi.getRefreshToken,
      fingerprint: this.userApi.getFingerPrint,
    });

    this.userApi.logOut(response);
    runInAction(() => {
      this.userLoggedIn = false;
    });
  };

  /** Обновление данных пользователя */
  @action
  public updateStore_UserData(data: TJSON): void {
    this.userData = {
      ...this.userData,
      ...data,
    };
  }

  /** Перезаписать место работы */
  @action
  public overwriteStore_Job(dataJob: TJSON): void {
    //console.log(dataJob);
    this.userDataJob = {
      ...dataJob,
    };
  }

  /** Обновление места работы */
  @action
  public updateStore_Job(dataJob: TUserJob): void {
    //console.log(dataJob);
    this.userDataJob = {
      ...this.userDataJob,
      ...dataJob,
    };
  }
  @action
  public updateStore_JobContact(dataJob: TJSON): void {
    this.userDataJob = {
      ...this.userDataJob,
      contact: {
        ...this.userDataJob.contact,
        ...dataJob,
      },
    };
  }

  /** Обновление адреса - получение данный на визарде */
  @action
  public updateStore_Address(
    dataAddress: TUserAddress,
    dataContacts?: TUserContacts[]
  ): void {
    this.userDataAddress = {
      ...this.userDataAddress,
      ...dataAddress,
    };
    this.userDataContacts = dataContacts!;
  }

  /** Обновление елемента адреса */
  @action
  public updateStore_userDataAddress(data: TJSON): void {
    this.userDataAddress = {
      ...this.userDataAddress,
      ...data,
    };
  }

  /** Обновление елемента адреса (контакты)*/
  @action
  public updateStore_userDataContacts(data: TJSON): void {
    const newArray = {
      ...this.userDataContacts[0],
      ...data,
    };

    this.userDataContacts = [newArray];
  }

  /** Удаление елемента адреса (контакты)*/
  @action
  public removeStore_userDataContacts(keyName: string): void {
    const list: { [key: string]: any } = this.userDataContacts[0];
    delete list[keyName], list;
  }

  /** Получить из сервиса следующий шаг/страницу */
  public async getClientNextStep(): Promise<any> {
    const response = await this.userApi.getClientNextStep();

    if (response) {
      const { view } = response;

      if (view && view != Router.route) Router.push((URLS as TJSON)[view]);
    }
  }

  @action
  public setSessionID(sessionID: string): void {
    this.session_id = sessionID;
    setCookie(SESSION_ID_KEY, this.session_id);
  }

  @action
  public setCurrentDevice(device: CurrentDeviceInterface): void {
    this.device = device;
  }

  /**
   * @description Create client browser fingerprint
   * @param callback Callback function
   */
  @action
  public сollectFingerPrint(
    fpCallback: (fpResult: GetResult) => Promise<void>
  ): void {
    if (this.fingerprint) {
      setToLocalStorage(getMD5(FINGER_PRINT_KEY), this.fingerprint.visitorId);

      if (fpCallback) fpCallback(this.fingerprint);

      return;
    }

    import('@fingerprintjs/fingerprintjs')
      .then(async (FingerprintJS) => {
        const fp = await FingerprintJS.load();
        const fpResult = await fp.get();

        this.fingerprint = fpResult;
        setToLocalStorage(getMD5(FINGER_PRINT_KEY), this.fingerprint.visitorId);

        if (fpCallback) fpCallback(fpResult);

        return;
      })
      .catch((error) => {
        console.info(error);
      });
  }

  /** Отправить данные для получения ОТП */
  public async sendUserData(
    userData: TUserObligatory,
    otpStore: OtpStore
  ): Promise<void> {
    const requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: (URIS as TJSON)[`SEND_OTP${otpStore.urisKey || ''}`],
      data: userData,
    };

    const otpData = await this.userApi.sendUserData(requestConfig);

    runInAction(() => {
      this.userData = {
        ...userData,
        ...otpData,
      };
    });

    const { otpId } = otpData;

    if (~otpId) {
      const { phoneNumber } = userData;

      otpStore.updateOtpState({ otpId, phoneNumber });
    }
  }

  /** Получить данные для Obligatory */
  public async getWizardData_Obligatory(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.obligatory,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response) {
      const { obligatory } = response;

      this.updateStore_UserData(obligatory);
    }
  }

  /** Получить данные для Address */
  public async getWizardData_Address(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.address,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response) {
      const { address, contacts } = response;

      this.updateStore_Address(address, contacts);
    }
  }

  /** Получить данные для Job */
  public async getWizardData_Job(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.job,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);
    if (response) {
      const { job } = response;

      this.updateStore_Job(job);
    }
  }

  /** Сохранить шаг в БД */
  public async saveWizardStep<T>(step: URIS, data: T): Promise<void> {
    const requestConfig = this.userApi.postHeaderRequestConfig(step, data);

    await this.userApi.fetchWizardData(requestConfig);
  }
}
