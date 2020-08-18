import { ReactElement, PureComponent, FormEvent } from 'react';
import { toJS } from 'mobx';
import Head from 'next/head';

import style from './AboutMyself.module.scss';

import { INPUT_TYPE, BUTTON_TYPE, FIELD_NAME } from '../../../../constants';
import { gt } from '../../../../utils';
import { TClientStepProps } from '../../Client';
import UserStore, { TFormData } from '../../../../stores/UserStore';
import { TOnInputChangeHandler } from '../../../../interfaces';
import { inject } from 'mobx-react';
import { STORE_IDS } from '../../../../stores';
import DatepickerWidget from '../../../widgets/DatepickerWidget';

type TAboutMyself = {
  staticData: any;
  userData: any;
  userStore?: UserStore;
} & TClientStepProps;

@inject(STORE_IDS.USER_STORE)
export class AboutMyself extends PureComponent<TAboutMyself> {
  public readonly state: TFormData = {
    ...this.props.userData,
  };

  private submitForm() {
    const { userStore } = this.props;
    if (userStore) {
      userStore.updateStore(this.state);
      userStore.postWizardData(this.state);
      userStore.setNextStep();
    }
    console.log(toJS(userStore));
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          [name]: value.replace(/\s-\s/g, ''),
        };
      }
    );
  };

  private handleChangeDate: any = ({
    fieldName,
    date,
  }: {
    fieldName: string;
    date: Date;
  }) => {
    this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          [fieldName]: date,
        };
      }
    );
  };

  public render(): ReactElement {
    //console.log(toJS(this.props));
    const { staticData, userData /* , switchNextStepHendler */ } = this.props;

    console.log('this.state: ', this.state);
    console.log('birthDate: ', this.state.birthDate);
    console.log(toJS(userData));
    //return null;

    return (
      <>
        <Head>
          <title>{staticData.title}</title>
        </Head>

        <h2>{staticData.title}</h2>

        <form className={style.obligatory} onSubmit={this.onSubmitHandler}>
          <input
            name='name'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.name}
            value={this.state.name || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <DatepickerWidget
            selected={this.state.birthDate}
            name={FIELD_NAME.BIRTH_DATE}
            placeholderText={staticData.birthDate}
            handleChangeDate={(date: Date): Date => {
              this.handleChangeDate({ fieldName: FIELD_NAME.BIRTH_DATE, date });

              return date;
            }}
          />
          <input
            name='cmnd_cccd'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.idNumber}
            value={this.state.cmnd_cccd || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='issueDate'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.issueIdDate}
            value={this.state.issueDate || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='expireDate'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.expireIdDate}
            value={this.state.expireDate || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='gender_id'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.gender}
            value={this.state.gender_id || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='maritalStatus_id'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.maritalStatus}
            value={this.state.maritalStatus_id || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='numberOfDependents'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.childrenAmount}
            value={this.state.numberOfDependents || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='email'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.email}
            value={this.state.email || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='loanPurpose_id'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.loanPurpose}
            value={this.state.loanPurpose_id || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <div>
            {staticData.whatPhone}
            <input
              name='brand_id'
              className={style.input}
              type={INPUT_TYPE.TEXT}
              placeholder={staticData.phoneBrand}
              value={this.state.brand_id || ''}
              onChange={this.onChangeHandler}
              required={true}
            />
          </div>
          <input
            name='brandOther'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.otherPhoneBrand}
            value={this.state.brandOther || ''}
            onChange={this.onChangeHandler}
          />
          <input
            name='model_id'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.phoneModel}
            value={this.state.model_id || ''}
            onChange={this.onChangeHandler}
            required={true}
          />
          <input
            name='modelOther'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.otherPhoneModel}
            value={this.state.modelOther || ''}
            onChange={this.onChangeHandler}
          />
          <input
            name='otherPhoneNumber'
            className={style.input}
            type={INPUT_TYPE.TEXT}
            placeholder={staticData.otherPhoneNumber}
            value={this.state.otherPhoneNumber || ''}
            onChange={this.onChangeHandler}
          />
          <button className={style.nextStep} type={BUTTON_TYPE.SUBMIT}>
            {gt.gettext('Confirm')}
          </button>
        </form>
      </>
    );
  }
}
