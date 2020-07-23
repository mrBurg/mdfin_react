import { observable, computed, toJS } from 'mobx';

import { RegistrationApi } from '../apis';

type TFormData =
  | {
      namePlaceholder: string;
      buttonText: string;
    }
  | undefined;

export default class RegistrationStore {
  @observable formData: TFormData;

  constructor(private registrationApi: RegistrationApi) {}

  public async initRegistrationForm(): Promise<void> {
    this.formData = await this.registrationApi.fetchFormData();
  }

  @computed
  public get formDataJSON(): TFormData {
    return toJS(this.formData);
  }
}
