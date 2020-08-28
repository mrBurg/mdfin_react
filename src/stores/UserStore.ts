import Router from 'next/router';
import { observable, action, runInAction } from 'mobx';
import Fingerprint2 from 'fingerprintjs2';

import { UserApi, CommonApi } from '../apis';
import { OtpStore } from './OtpStore';
import { URLS, URIS } from '../routes';
import { clearLocalStorage, setToLocalStorage, getMD5 } from '../utils';
import { FINGER_PRINT } from '../constants';
import {
  TUserData,
  TUserAddress,
  TUserContacts,
  TUserJob,
  TUserObligatory,
} from './@types/userStore';

export class UserStore {
  @observable public userData: TUserData = {};
  @observable public userDataAddress: TUserAddress = {};
  @observable public userDataContacts: TUserContacts[] = [];
  @observable public userDataJob: TUserJob = {};
  public fingerprint?: string;

  constructor(private userApi: UserApi, private commonApi: CommonApi) {}

  public logOut() {
    clearLocalStorage();

    Router.push(URLS.HOME);
  }

  @action
  public updateStore(data: any) {
    this.userData = {
      ...this.userData,
      ...data,
    };
  }

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

  @action
  public updateStore_Job(dataJob: TUserJob) {
    this.userDataJob = {
      ...this.userDataJob,
      ...dataJob,
    };
  }

  /* Получить из сервиса следующий шаг/страницу */
  public async getClientNextStep(): Promise<string | void> {
    const response = await this.commonApi.getClientNextStep();
    if (response) {
      const { view } = response;
      return view;
    }
  }

  @action
  public makeFingerprint() {
    Fingerprint2.get((components) => {
      const values = components.map(function (component) {
        return component.value;
      });
      const fp = Fingerprint2.x64hash128(values.join(''), 31);

      setToLocalStorage(getMD5(FINGER_PRINT), fp);
      this.fingerprint = fp;
    });
  }

  @action
  public async sendUserData(userData: TUserObligatory, otpStore: OtpStore) {
    const otpData = await this.userApi.sendUserData(userData, otpStore.urisKey);

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

  public async getWizardData_Obligatory(): Promise<void | boolean> {
    let requestConfig = this.commonApi.getHeaderRequestConfig(
      URIS.obligatory,
      this.userData
    );

    const response = await this.userApi.getWizardData(requestConfig);
    if (response) {
      const { obligatory } = response;
      this.updateStore(obligatory);
    }
  }

  public async getWizardData_Address(): Promise<void | boolean> {
    let requestConfig = this.commonApi.getHeaderRequestConfig(
      URIS.address,
      this.userData
    );

    const response = await this.userApi.getWizardData(requestConfig);
    console.log(response);
    if (response) {
      const { address, contacts } = response;
      this.updateStore_Address(address, contacts);
    }
  }

  public async getWizardData_Job(): Promise<void | boolean> {
    let requestConfig = this.commonApi.getHeaderRequestConfig(
      URIS.job,
      this.userData
    );

    const response = await this.userApi.getWizardData(requestConfig);
    if (response) {
      const { job } = response;
      this.updateStore_Job(job);
    }
  }

  public async getWizardData_Docs(): Promise<void | boolean> {
    let requestConfig = this.commonApi.getHeaderRequestConfig(
      URIS.job,
      this.userData
    );

    const response = await this.userApi.getWizardData(requestConfig);
    if (response) {
      const { job } = response;
      this.updateStore_Job(job);
    }
  }

  /* сохранить в БД закладку obligatory */
  public async postWizardDataObligatory(
    userData: TUserData
  ): Promise<void | boolean> {
    const newUserData = { obligatory: { ...userData } };

    let requestConfig = this.commonApi.postHeaderRequestConfig(
      URIS.obligatory,
      newUserData
    );
    const status = await this.userApi.postWizardData(requestConfig);
    console.log(status);
  }

  /* сохранить в БД закладку address */
  public async postWizardDataAddress(data: any): Promise<void | boolean> {
    const newData = { ...data };

    let requestConfig = this.commonApi.postHeaderRequestConfig(
      URIS.address,
      newData
    );

    const status = await this.userApi.postWizardData(requestConfig);
    console.log(status);
  }

  /* сохранить в БД закладку job */
  public async postWizardData_Job(data: any): Promise<void | boolean> {
    const newData = { ...data };

    let requestConfig = this.commonApi.postHeaderRequestConfig(
      URIS.job,
      newData
    );

    const status = await this.userApi.postWizardData(requestConfig);
    console.log(status);
  }
}
