import { observable, computed, toJS } from 'mobx';

import { RegistrationApi } from '../apis';

type TFormProps =
  | {
      namePlaceholder: string;
      buttonText: string;
    }
  | undefined;

export default class RegistrationStore {
  @observable formProps: TFormProps;

  constructor(private registrationApi: RegistrationApi) {}

  public async initRegistrationForm(): Promise<void> {
    this.formProps = await this.registrationApi.fetchFormData();
  }

  @computed
  public get formData(): TFormProps {
    return toJS(this.formProps);
  }
}
