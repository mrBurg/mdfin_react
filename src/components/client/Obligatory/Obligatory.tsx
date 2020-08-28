import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import classNames from 'classnames';
import Router from 'next/router';

import style from './Obligatory.module.scss';

import { phoneMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE, FIELD_NAME } from '../../../constants';
import { gt } from '../../../utils';
import { ClientTabs } from '../ClientTabs';
import { STORE_IDS } from '../../../stores';
import { TOnInputChangeHandler, TJSON } from '../../../interfaces';
import { DatepickerWidget } from '../../widgets/DatepickerWidget';
import { DIRECTORIES, URLS } from '../../../routes';
import { SelectWidget } from '../../widgets/SelectWidget';
import { Preloader } from '../../Preloader';
import { TObligatory, TState, THandleChangeDate } from './@types';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.USER_STORE)
@observer
export class Obligatory extends PureComponent<TObligatory> {
  public readonly state: TState = {
    isRender: false,
    userData: {},
  };

  componentDidMount() {
    const { pageStore, userStore } = this.props;

    if (pageStore && userStore) {
      Promise.all([
        userStore.getWizardData_Obligatory(),
        pageStore.getDirectory(DIRECTORIES.dirGender),
        pageStore.getDirectory(DIRECTORIES.dirMaritalStatus),
        pageStore.getDirectory(DIRECTORIES.dirLoanPurpose),
        pageStore.getDirectory(DIRECTORIES.dirMobilePhoneBrand),
      ]).then(() => {
        new Promise((resolve) => {
          this.setState({
            isRender: true,
            userData: { ...userStore.userData }, //{ ...this.props.userDataJob },
          });
          resolve();
        }).then(() => {
          if (this.state.userData.brand_id)
            pageStore.getDirectory(
              DIRECTORIES.dirMobilePhoneModel,
              '' + this.state.userData.brand_id
            );
        });
      });
    }
  }

  private async submitForm() {
    const { userStore } = this.props;

    if (userStore) {
      userStore.updateStore(this.state.userData);

      userStore.postWizardDataObligatory(this.state.userData);

      const view = await userStore.getClientNextStep();
      if (view) return Router.push((URLS as TJSON)[view]);
    }
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TState): TState => {
        return {
          ...state,
          userData: {
            ...state.userData,
            [name]: value.replace(/\s-\s/g, ''),
          },
        };
      }
    );
  };

  private handleChangeDate = ({ fieldName, date }: THandleChangeDate) => {
    this.setState({
      ...this.state,
      userData: {
        ...this.state.userData,
        [fieldName]: date,
      },
    });
  };

  private handleChangeSelect = (_event: any, data: any) => {
    new Promise((resolve) => {
      resolve(
        this.setState(
          (state: TState): TState => {
            return {
              ...state,
              userData: {
                ...state.userData,
                [data.name]: data.value,
              },
            };
          }
        )
      );
    }).then(() => {
      const { pageStore } = this.props;
      if (pageStore && data.name == 'brand_id') {
        let jsonArr = toJS(pageStore.dirMobilePhoneBrand);

        for (var i = 0; i < jsonArr.length; i++) {
          if (jsonArr[i].value === data.value) {
            const manualInput = jsonArr[i].manual_input;

            this.setState({
              userData: {
                ...this.state.userData,
                shouldShow_PHONE_BRAND_OTHER: manualInput,
              },
            });
          }
        }
        this.setState({
          userData: {
            ...this.state.userData,
            shouldShow_PHONE_MODEL_OTHER: false,
          },
        });
        pageStore.getDirectory(DIRECTORIES.dirMobilePhoneModel, data.value);
      }
    });
  };

  private handleChangeSelectFromParent = (_event: any, data: any) => {
    new Promise((resolve) => {
      resolve(
        this.setState(
          (state: TState): TState => {
            return {
              ...state,
              userData: {
                ...state.userData,
                [data.name]: data.value,
              },
            };
          }
        )
      );
    }).then(() => {
      const { pageStore } = this.props;

      if (pageStore && data.name == 'model_id') {
        let jsonArr = toJS(pageStore.dirMobilePhoneModel);

        for (var i = 0; i < jsonArr.length; i++) {
          if (jsonArr[i].value === data.value) {
            const manualInput = jsonArr[i].manual_input;

            this.setState({
              userData: {
                ...this.state.userData,
                shouldShow_PHONE_MODEL_OTHER: manualInput,
              },
            });
          }
        }
      }
    });
  };

  public render(): ReactElement | null {
    const { staticData, pageStore } = this.props;

    if (this.state.isRender && pageStore) {
      return (
        <ClientTabs>
          <form className={style.obligatory} onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <input
                name={FIELD_NAME.NAME}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.name}
                title={staticData.name}
                value={this.state.userData.name || ''}
                onChange={this.onChangeHandler}
                required={true}
                maxLength={50}
                pattern='[\s\p{L}]*'
              />
              <div className={style.datepicker}>
                <DatepickerWidget
                  name={FIELD_NAME.BIRTH_DATE}
                  wrapperClassName={style.datepickerWrapper}
                  className={style.datepickerInput}
                  selected={moment(this.state.userData.birthDate).toDate()}
                  placeholderText={staticData.birthDate}
                  onChange={(date: Date): void => {
                    this.handleChangeDate({
                      fieldName: FIELD_NAME.BIRTH_DATE,
                      date,
                    });
                  }}
                  dateFormat='dd/MM/yyyy'
                  required={true}
                />
              </div>
              <input
                name={FIELD_NAME.ID}
                className={style.input}
                type={INPUT_TYPE.NUMBER}
                placeholder={staticData.idNumber}
                value={this.state.userData.cmnd_cccd || ''}
                onChange={this.onChangeHandler}
                min={0}
                max={999999999999}
                required={true}
              />
              <div className={style.datepicker}>
                <DatepickerWidget
                  name={FIELD_NAME.ISSUE_DATE}
                  wrapperClassName={style.datepickerWrapper}
                  className={style.datepickerInput}
                  selected={moment(this.state.userData.issueDate).toDate()}
                  placeholderText={staticData.issueIdDate}
                  required={true}
                  onChange={(date: Date): void => {
                    this.handleChangeDate({
                      fieldName: FIELD_NAME.ISSUE_DATE,
                      date,
                    });
                  }}
                  dateFormat='dd/MM/yyyy'
                />
              </div>
              <div className={style.datepicker}>
                <DatepickerWidget
                  name={FIELD_NAME.EXPIRE_DATE}
                  wrapperClassName={style.datepickerWrapper}
                  className={style.datepickerInput}
                  selected={moment(this.state.userData.expireDate).toDate()}
                  placeholderText={staticData.expireIdDate}
                  required={true}
                  onChange={(date: Date): void => {
                    this.handleChangeDate({
                      fieldName: FIELD_NAME.EXPIRE_DATE,
                      date,
                    });
                  }}
                  dateFormat='dd/MM/yyyy'
                />
              </div>
              <SelectWidget
                name={FIELD_NAME.GENDER_ID}
                value={this.state.userData.gender_id}
                className={style.input}
                placeholder={staticData.gender}
                options={pageStore.dirGender}
                onChange={this.handleChangeSelect}
              />
              <SelectWidget
                name={FIELD_NAME.MARITAL_STATUS_ID}
                value={this.state.userData.maritalStatus_id}
                className={style.input}
                placeholder={staticData.maritalStatus}
                options={pageStore.dirMaritalStatus}
                onChange={this.handleChangeSelect}
              />
              <input
                name={FIELD_NAME.NUMBER_OF_DEPENDENTS}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.childrenAmount}
                value={this.state.userData.numberOfDependents || ''}
                onChange={this.onChangeHandler}
                required={true}
                maxLength={2}
              />
              <input
                name={FIELD_NAME.EMAIL}
                className={style.input}
                type={INPUT_TYPE.EMAIL}
                placeholder={staticData.email}
                value={this.state.userData.email || ''}
                onChange={this.onChangeHandler}
                required={true}
                maxLength={100}
              />
              <SelectWidget
                name={FIELD_NAME.LOAN_PURPOSE_ID}
                value={this.state.userData.loanPurpose_id}
                className={style.input}
                placeholder={staticData.loanPurpose}
                options={pageStore.dirLoanPurpose}
                onChange={this.handleChangeSelect}
              />
              <div className={style.phonesTitle}>{staticData.whatPhone}</div>
              <SelectWidget
                name={FIELD_NAME.PHONE_BRAND_ID}
                value={this.state.userData.brand_id}
                className={style.input}
                placeholder={staticData.phoneBrand}
                options={pageStore.dirMobilePhoneBrand}
                onChange={this.handleChangeSelect}
              />
              <input
                name={FIELD_NAME.PHONE_BRAND_OTHER}
                className={classNames(style.input, {
                  [style.hidden]:
                    this.state.userData.shouldShow_PHONE_BRAND_OTHER != 'true',
                })}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.otherPhoneBrand}
                value={this.state.userData.brandOther || ''}
                onChange={this.onChangeHandler}
                maxLength={50}
              />

              <SelectWidget
                name={FIELD_NAME.PHONE_MODEL_ID}
                value={this.state.userData.model_id}
                className={style.input}
                placeholder={staticData.phoneBrand}
                options={pageStore.dirMobilePhoneModel}
                onChange={this.handleChangeSelectFromParent}
              />
              <input
                name={FIELD_NAME.PHONE_MODEL_OTHER}
                className={classNames(style.input, {
                  [style.hidden]:
                    this.state.userData.shouldShow_PHONE_MODEL_OTHER != 'true',
                })}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.otherPhoneModel}
                value={this.state.userData.modelOther || ''}
                onChange={this.onChangeHandler}
                maxLength={50}
              />
              <InputMask
                name={FIELD_NAME.OTHER_PHONE_NUMBER}
                value={this.state.userData.otherPhoneNumber || ''}
                className={style.input}
                type={INPUT_TYPE.TEL}
                mask={phoneMask}
                placeholder={
                  staticData.otherPhoneNumber || phoneMask.replace(/9/g, '*')
                }
                onChange={this.onChangeHandler}
              />
            </div>
            <button className={style.nextStep} type={BUTTON_TYPE.SUBMIT}>
              {gt.gettext('Confirm')}
            </button>
          </form>
        </ClientTabs>
      );
    }
    return <Preloader />;
  }
}
