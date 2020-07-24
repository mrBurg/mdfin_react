import { observable, action, runInAction } from 'mobx';

import { RegistrationApi } from '../apis';
import OTPStore from './OTPStore';

type TFormStatic = {
  namePlaceholder: string;
  buttonText: string;
};

export type TFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export default class RegistrationStore {
  @observable formStaticData?: TFormStatic;

  constructor(
    private registrationApi: RegistrationApi,
    private otpStore: OTPStore
  ) {}

  @action
  public async initRegistrationForm(): Promise<void> {
    const formStaticData = await this.registrationApi.fetchFormStatic();

    runInAction(() => {
      this.formStaticData = formStaticData;
    });
  }

  @action
  public async sendForm(data: TFormData) {
    const otpData = await this.registrationApi.sendForm(data);

    this.otpStore.setUserData({
      ...otpData,
      ...data,
    });
  }
}
