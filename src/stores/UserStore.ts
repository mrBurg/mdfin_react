import { observable, action, runInAction } from 'mobx';
import Fingerprint2 from 'fingerprintjs2';
import _ from 'lodash';
import { AxiosRequestConfig } from 'axios';
import Router from 'next/router';
import moment from 'moment';

import { UserApi } from '../apis';
import { OtpStore } from './OtpStore';
import { URIS, URLS } from '../routes';
import { setToLocalStorage, getMD5, makeApiUri } from '../utils';
import { FINGER_PRINT_KEY, METHOD } from '../constants';
import {
  TUserData,
  TUserAddress,
  TUserContacts,
  TUserJob,
  TUserObligatory,
} from './@types/userStore';
import { TJSON } from '../interfaces';

export class UserStore {
  @observable public userData: TUserData = {};
  @observable public userDataAddress: TUserAddress = {};
  @observable public userDataContacts: TUserContacts[] = [];
  @observable public userDataJob: TUserJob = {};
  @observable public userLoggedIn: boolean = false;
  public fingerprint?: string;
  private callbackSequence: Array<Function> = [];
  private gettingToken: boolean = false;

  constructor(private userApi: UserApi) {}

  private completeCalls(): any {
    _.map(this.callbackSequence, (item) => {
      item();
    });

    this.gettingToken = false;
    this.callbackSequence = [];
  }

  public async fetchWithAuth(callback: Function): Promise<void> {
    return new Promise(async (resolve) => {
      const accessToken = this.userApi.getAccessToken;

      this.callbackSequence.push(callback);

      if (accessToken) {
        if (!this.gettingToken) {
          this.gettingToken = true;

          const date = moment.now() / 1000;

          try {
            const { exp, iat } = JSON.parse(atob(accessToken.split('.')[1]));

            if (date <= iat || date >= exp) {
              await this.userApi.refreshToken();
              this.completeCalls();
              resolve();
            }

            this.completeCalls();
            resolve();
          } catch (err) {
            await this.userApi.refreshToken();
            this.completeCalls();
            resolve();
          }
        }
      } else {
        this.completeCalls();

        resolve();
      }
    });
  }

  @action
  public updateUserState() {
    this.userLoggedIn = Boolean(this.userApi.getAccessToken);
  }

  public logOut = () => {
    const response = this.userApi.postHeaderRequestConfig(URIS.LOGOUT, {
      refreshToken: this.userApi.getRefreshToken,
      fingerprint: this.fingerprint,
    });

    this.userApi.logOut(response);
    runInAction(() => {
      this.userLoggedIn = false;
    });
  };

  /** Обновление данных пользователя */
  @action
  public updateStore_UserData(data: TJSON) {
    this.userData = {
      ...this.userData,
      ...data,
    };
  }

  /** Обновление адреса */
  @action
  public updateStore_Address(
    dataAddress: TUserAddress,
    dataContacts?: Array<TUserContacts>
  ) {
    this.userDataAddress = {
      ...this.userDataAddress,
      ...dataAddress,
    };
    this.userDataContacts = dataContacts!;
  }

  /** Обновление места работы */
  @action
  public updateStore_Job(dataJob: TUserJob) {
    this.userDataJob = {
      ...this.userDataJob,
      ...dataJob,
    };
  }

  /** Получить из сервиса следующий шаг/страницу */
  public async getClientNextStep(): Promise<void> {
    const response = await this.userApi.getClientNextStep();

    if (response) {
      const { view } = response;

      if (view && view != Router.route) Router.push((URLS as TJSON)[view]);
    }
  }

  private fingerprintInit(): void {
    Fingerprint2.get(
      {
        excludes: {
          webgl: true,
          webglVendorAndRenderer: true,
        },
      },
      (components) => {
        const values = _.map(components, (component) => {
          return component.value;
        });

        const fp = Fingerprint2.x64hash128(values.join(''), 31);

        setToLocalStorage(getMD5(FINGER_PRINT_KEY), fp);
        this.fingerprint = fp;
      }
    );
  }

  /** Создать отпечаток браузера клиента */
  @action
  public makeFingerprint() {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        this.fingerprintInit();
      });
    } else {
      setTimeout(() => {
        this.fingerprintInit();
      }, 500);
    }
  }

  /** Отправить данные для получения ОТП */
  public async sendUserData(userData: TUserObligatory, otpStore: OtpStore) {
    let requestConfig: AxiosRequestConfig = {
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

    if (!!~otpId) {
      const { phoneNumber } = userData;

      otpStore.updateOtpState({ otpId, phoneNumber });
    }
  }

  /** Получить данные для Obligatory */
  public async getWizardData_Obligatory(): Promise<void | boolean> {
    let requestConfig = this.userApi.getHeaderRequestConfig(
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
    let requestConfig = this.userApi.getHeaderRequestConfig(
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
    let requestConfig = this.userApi.getHeaderRequestConfig(
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
