import Router from 'next/router';
import { observable, action, runInAction } from 'mobx';
import Fingerprint2 from 'fingerprintjs2';

import { UserApi, CommonApi } from '../apis';
import OtpStore from './OtpStore';
import { CLIENT_STEP, URLS } from '../routes';
import { clearLocalStorage } from '../utils';

export type TFormData = {
  //firstName?: string;
  //name?: string;
  phoneNumber?: string;

  pi_id?: number;
  name?: string;
  birthDate?: Date; //2020-08-13T15:37:25.787Z,
  cmnd_cccd?: string;
  issueDate?: string; //2020-08-13T15:37:25.787Z,
  expireDate?: string; //2020-08-13T15:37:25.787Z,
  gender_id?: string;
  maritalStatus_id?: number;
  numberOfDependents?: number;
  email_id?: number;
  email?: string;
  loanPurpose_id?: number;
  mobilePhone_id?: number;
  brand_id?: number;
  brandOther?: string;
  model_id?: number;
  modelOther?: string;
  otherPhone_id?: number;
  otherPhoneNumber?: string;
};

type TUserData = {
  otpId?: number;
} & TFormData;

type TFormStatic = {
  aboutMyself?: any;
  addresses?: any;
  work?: any;
  documents?: any;
};

export default class UserStore {
  private generateStepSequence = this.nextStepSequence();

  @observable public userData: TUserData = {};
  @observable public formStatic: TFormStatic = {};
  @observable public currentStep: string = <string>(
    this.generateStepSequence.next().value
  );
  public fingerprint?: string;

  constructor(private userApi: UserApi, private commonApi: CommonApi) {}

  private *nextStepSequence() {
    yield CLIENT_STEP.obligatory;
    yield CLIENT_STEP.address;
    yield CLIENT_STEP.job;
    yield CLIENT_STEP.attachment_account;
  }

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
  public setCurrentStep(currentStep: string) {
    this.currentStep = currentStep;
  }

  @action
  public setNextStep() {
    const data = this.generateStepSequence.next();

    if (!data.done) {
      // runInAction(() => {
      return (this.currentStep = data.value);
      // });
    }

    //Start Remove
    this.generateStepSequence = this.nextStepSequence();
    this.currentStep = <string>this.generateStepSequence.next().value;
    //End Remove
  }

  @action
  public async initUserForm(): Promise<void> {
    /* const formStatic = await this.userApi.fetchFormStatic({
      block: 'front',
      path: 'config',
    }); */

    /* const formStatic = await this.userApi.fetchFormStatic({
      block: 'front',
      path: 'test',
    }); */

    runInAction(() => {
      // this.formStatic = formStatic;
      this.formStatic = require('../components/client/_staticData.json');
    });
  }

  @action
  public makeFingerprint() {
    Fingerprint2.get((components) => {
      const values = components.map(function (component) {
        return component.value;
      });
      this.fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
    });
  }

  @action
  public async sendUserData(userData: TFormData, otpStore: OtpStore) {
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

  /* сохранить в БД закладку obligatory */
  public async postWizardData(userData: TUserData): Promise<void | boolean> {
    const newUserData = { obligatory: { ...userData } };
    console.log(newUserData);

    console.log(this.currentStep);
    let requestConfig = await this.commonApi.postHeaderRequestConfig(
      'OBLIGATORY',
      newUserData
    );
    console.log(requestConfig);

    const status = await this.userApi.postWizardData(requestConfig);
    console.log(status);

    //return Router.push((URLS as TJSON)[view]);
  }
}
