import React, { ReactElement, PureComponent, FormEvent } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import style from './Obligatory.module.scss';

import { dateFormat, dateMask, phoneMask } from '@src/config.json';
import { WithTracking } from '@components/hocs';
import { Preloader } from '@components/Preloader';
import { DatepickerWidget } from '@components/widgets/DatepickerWidget';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { TSelectData } from '@components/widgets/ReactSelectWidget/@types';
import { TOnInputChangeHandler } from '@interfaces';
import { DIRECTORIES, URIS } from '@routes';
import { FIELD_NAME, INPUT_TYPE, BUTTON_TYPE } from '@src/constants';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { gt, handleErrors, isDev, validator } from '@utils';
import { ClientTabs } from '../ClientTabs';
import { TObligatory, THandleChangeDate, TState } from './@types';
import { TField } from '@stores-types/userStore';
import { TDirectoryItem } from '@stores-types/pageStore';

@observer
export class Obligatory extends PureComponent<TObligatory> {
  public readonly state: TState = {
    isRender: false,
    invalidFields: [],
  };

  componentDidMount(): void {
    const { pageStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      if (!isDev) {
        await this.refreshView();
      }

      await userStore.getWizardData_Obligatory();

      pageStore.getDirectory(DIRECTORIES.dirGender);
      pageStore.getDirectory(DIRECTORIES.dirMaritalStatus);
      pageStore.getDirectory(DIRECTORIES.dirLoanPurpose);
      pageStore.getDirectory(DIRECTORIES.dirMobilePhoneBrand);

      if (userStore.userData.brand_id)
        await pageStore.getDirectory(
          DIRECTORIES.dirMobilePhoneModel,
          String(userStore.userData.brand_id)
        );

      this.setState({
        isRender: true,
      });
    });
  }

  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private async submitForm() {
    const {
      userStore,
      userStore: { userData },
    } = this.props;

    const validateItems = await this.validateItems();
    const res = await this.validateForm(validateItems);

    if (!res) return;

    //раньше, тут state писался в Store. Теперь, значения полей, пишутся напрямую в Store
    await userStore.saveWizardStep(URIS.obligatory, {
      obligatory: { ...userData },
    });
    userStore.getClientNextStep();
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const {
      userStore: { userData },
    } = this.props;

    const validateItems: TField[] = [
      { name: FIELD_NAME.NAME, value: userData.name! },
      {
        name: FIELD_NAME.BIRTH_DATE,
        value: userData.birthDate ? moment(userData.birthDate).toDate() : null,
      },
      { name: FIELD_NAME.ID, value: userData.cmnd_cccd! },
      {
        name: FIELD_NAME.ISSUE_DATE,
        value: userData.issueDate ? moment(userData.issueDate).toDate() : null,
      },
      {
        name: FIELD_NAME.EXPIRE_DATE,
        value: userData.expireDate
          ? moment(userData.expireDate).toDate()
          : null,
      },
      { name: FIELD_NAME.GENDER_ID, value: userData.gender_id! },
      {
        name: FIELD_NAME.MARITAL_STATUS_ID,
        value: userData.maritalStatus_id!,
      },
      {
        name: FIELD_NAME.NUMBER_OF_DEPENDENTS,
        value: userData.numberOfDependents!,
      },
      { name: FIELD_NAME.EMAIL, value: userData.email! },
      {
        name: FIELD_NAME.LOAN_PURPOSE_ID,
        value: userData.loanPurpose_id!,
      },
      { name: FIELD_NAME.PHONE_BRAND_ID, value: userData.brand_id! },
      {
        name: FIELD_NAME.PHONE_BRAND_OTHER,
        value: userData.brandOther!,
      },
      {
        name: FIELD_NAME.PHONE_MODEL_ID,
        value: userData.model_id!,
      },
      {
        name: FIELD_NAME.PHONE_MODEL_OTHER,
        value: userData.modelOther!,
      },
      {
        name: FIELD_NAME.OTHER_PHONE_NUMBER,
        value: userData.otherPhoneNumber!,
      },
    ];
    return validateItems;
  }

  private validateField: TOnInputChangeHandler = async ({
    currentTarget: { name, value },
  }) => {
    this.validateForm([{ name, value }]);
  };

  private validateFieldSelect = (data: TSelectData) => {
    const { name, value } = data;

    this.validateForm([{ name, value }]);
  };

  private async validateForm(validateItems: TField[]): Promise<boolean> {
    const { userStore } = this.props;

    const validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    //let invalidFields: string[] = this.state.invalidFields;
    const validateResult: string[] = await validator(validateItems, userStore);

    await this.setInvalidFields(validateResult, validateItemsNames);

    return !_.size(this.state.invalidFields);
  }

  /** добавить невалидные/убрать валидные поля из State
   * @param validateResult - список невалидных полей
   * @param validateItemsNames - список имен полей для валидации
   */
  private setInvalidFields = async (
    validateResult: string[],
    validateItemsNames: string[]
  ) => {
    const invalidFields: string[] = this.state.invalidFields;

    if (_.size(validateResult)) {
      this.setState(
        (state: TState): TState => {
          return {
            ...state,
            invalidFields: _.union(validateResult, invalidFields),
          };
        }
      );
    } else {
      this.setState(
        (state: TState): TState => {
          return {
            ...state,
            invalidFields: _.difference(invalidFields, validateItemsNames),
          };
        }
      );
    }
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    userStore.updateStore_UserData({ [name]: value.replace(/\s-\s/g, '') });
  };

  private handleChangeDate = ({ fieldName, date }: THandleChangeDate) => {
    const { userStore } = this.props;
    const newDate = moment(date).format('YYYY-MM-DDTHH:mm:ssZ'); //чтоб не "сбрасывалась" timezone, нужно форматировать дату
    userStore.updateStore_UserData({ [fieldName]: newDate });
  };

  private handleChangeSelect = (data: TSelectData) => {
    const { userStore } = this.props;

    new Promise((resolve) => {
      resolve(userStore.updateStore_UserData({ [data.name]: data.value }));
    })
      .then(() => {
        const { pageStore } = this.props;

        if (pageStore && data.name == 'brand_id') {
          _.map(pageStore.dirMobilePhoneBrand, (item: TDirectoryItem) => {
            if (item.value === data.value) {
              const manualInput = item.manual_input;

              userStore.updateStore_UserData({
                shouldShow_PHONE_BRAND_OTHER: manualInput,
              });
            }
          });

          userStore.updateStore_UserData({
            shouldShow_PHONE_MODEL_OTHER: 'false',
            model_id: 0,
            modelOther: null,
          });
          pageStore.getDirectory(DIRECTORIES.dirMobilePhoneModel, data.value);
        }

        return;
      })
      .catch((err) => {
        handleErrors(err);
      });
  };

  private handleChangeSelectFromParent = (data: TSelectData) => {
    const { userStore } = this.props;

    new Promise((resolve) => {
      resolve(
        userStore.updateStore_UserData({
          [data.name]: data.value,
        })
      );
    })
      .then(() => {
        const { pageStore } = this.props;

        if (pageStore && data.name == 'model_id') {
          _.map(pageStore.dirMobilePhoneModel, (item: TDirectoryItem) => {
            if (item.value === data.value) {
              const manualInput = item.manual_input;

              userStore.updateStore_UserData({
                shouldShow_PHONE_MODEL_OTHER: manualInput,
              });
            }
          });
        }

        return;
      })
      .catch((err) => {
        handleErrors(err);
      });
  };

  public render(): ReactElement | null {
    const {
      staticData,
      pageStore,
      userStore: { userData },
    } = this.props;
    const { invalidFields } = this.state;

    if (this.state.isRender && pageStore) {
      return (
        <ClientTabs className={style.obligatory}>
          <form onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <WithTracking
                id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.NAME}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.NAME}
                  value={userData.name || ''}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.NAME),
                  })}
                  type={INPUT_TYPE.TEXT}
                  placeholder={staticData.name}
                  title={staticData.name}
                  onChange={this.onChangeHandler}
                  maxLength={50}
                  // pattern='[\s\p{L}]*'
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <div
                className={classNames(style.datepicker, {
                  [style.error]: invalidFields.includes(FIELD_NAME.BIRTH_DATE),
                })}
              >
                <DatepickerWidget
                  name={FIELD_NAME.BIRTH_DATE}
                  className={style.datepickerInput}
                  wrapperClassName={style.datepickerWrapper}
                  selected={
                    userData.birthDate
                      ? moment(userData.birthDate).toDate()
                      : null
                  }
                  placeholderText={staticData.birthDate}
                  onChange={(date: Date): void => {
                    this.handleChangeDate({
                      fieldName: FIELD_NAME.BIRTH_DATE,
                      date,
                    });
                  }}
                  dateFormat={dateFormat}
                  customInput={
                    <ReactInputMaskWidget
                      type={INPUT_TYPE.TEL}
                      mask={dateMask}
                    />
                  }
                  onBlur={this.validateField}
                />
              </div>
              <WithTracking
                id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.ID}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.ID}
                  value={userData.cmnd_cccd || ''}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.ID),
                  })}
                  type={INPUT_TYPE.TEL}
                  placeholder={staticData.idNumber}
                  onChange={this.onChangeHandler}
                  maxLength={12}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <div
                className={classNames(style.datepicker, {
                  [style.error]: invalidFields.includes(FIELD_NAME.ISSUE_DATE),
                })}
              >
                <DatepickerWidget
                  name={FIELD_NAME.ISSUE_DATE}
                  selected={
                    userData.issueDate
                      ? moment(userData.issueDate).toDate()
                      : null
                  }
                  className={style.datepickerInput}
                  wrapperClassName={style.datepickerWrapper}
                  placeholderText={staticData.issueDate}
                  onChange={(date: Date): void => {
                    this.handleChangeDate({
                      fieldName: FIELD_NAME.ISSUE_DATE,
                      date,
                    });
                  }}
                  dateFormat={dateFormat}
                  customInput={
                    <ReactInputMaskWidget
                      type={INPUT_TYPE.TEL}
                      mask={dateMask}
                    />
                  }
                  onBlur={this.validateField}
                />
              </div>
              <div
                className={classNames(style.datepicker, {
                  [style.error]: invalidFields.includes(FIELD_NAME.EXPIRE_DATE),
                })}
              >
                <DatepickerWidget
                  name={FIELD_NAME.EXPIRE_DATE}
                  selected={
                    userData.expireDate
                      ? moment(userData.expireDate).toDate()
                      : null
                  }
                  wrapperClassName={style.datepickerWrapper}
                  className={style.datepickerInput}
                  placeholderText={staticData.expireDate}
                  onChange={(date: Date): void => {
                    this.handleChangeDate({
                      fieldName: FIELD_NAME.EXPIRE_DATE,
                      date,
                    });
                  }}
                  dateFormat={dateFormat}
                  customInput={
                    <ReactInputMaskWidget
                      type={INPUT_TYPE.TEL}
                      mask={dateMask}
                    />
                  }
                  onBlur={this.validateField}
                />
              </div>
              <ReactSelectWidget
                name={FIELD_NAME.GENDER_ID}
                value={userData.gender_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.GENDER_ID)}
                placeholder={staticData.gender}
                options={pageStore.dirGender}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              <ReactSelectWidget
                name={FIELD_NAME.MARITAL_STATUS_ID}
                value={userData.maritalStatus_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.MARITAL_STATUS_ID)}
                placeholder={staticData.maritalStatus}
                options={pageStore.dirMaritalStatus}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              <WithTracking
                id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.NUMBER}-${FIELD_NAME.NUMBER_OF_DEPENDENTS}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.NUMBER_OF_DEPENDENTS}
                  value={
                    String(
                      userData.numberOfDependents
                        ? userData.numberOfDependents
                        : ''
                    )
                    /* !!String(userData.numberOfDependents)
                    ? userData.numberOfDependents || ''
                    : '' */
                  }
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(
                      FIELD_NAME.NUMBER_OF_DEPENDENTS
                    ),
                  })}
                  type={INPUT_TYPE.NUMBER}
                  placeholder={staticData.childrenAmount}
                  onChange={this.onChangeHandler}
                  maxLength={2}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <WithTracking
                id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.EMAIL}-${FIELD_NAME.NAME}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.EMAIL}
                  value={userData.email || ''}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.EMAIL),
                  })}
                  type={INPUT_TYPE.EMAIL}
                  placeholder={staticData.email}
                  onChange={this.onChangeHandler}
                  maxLength={100}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <ReactSelectWidget
                name={FIELD_NAME.LOAN_PURPOSE_ID}
                value={userData.loanPurpose_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.LOAN_PURPOSE_ID)}
                placeholder={staticData.loanPurpose}
                options={pageStore.dirLoanPurpose}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              <div className={style.subTitle}>{staticData.whatPhone}</div>
              <ReactSelectWidget
                name={FIELD_NAME.PHONE_BRAND_ID}
                value={userData.brand_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.PHONE_BRAND_ID)}
                placeholder={staticData.phoneBrand}
                options={pageStore.dirMobilePhoneBrand}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              {userData.shouldShow_PHONE_BRAND_OTHER == 'true' && (
                <WithTracking
                  id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.PHONE_BRAND_OTHER}`}
                  events={[
                    EFocusEvents.FOCUS,
                    EFocusEvents.BLUR,
                    EKeyboardEvents.KEY_UP,
                  ]}
                >
                  <input
                    name={FIELD_NAME.PHONE_BRAND_OTHER}
                    value={userData.brandOther || ''}
                    className={classNames(style.input, {
                      [style.error]: invalidFields.includes(
                        FIELD_NAME.PHONE_BRAND_OTHER
                      ),
                    })}
                    type={INPUT_TYPE.TEXT}
                    placeholder={staticData.otherPhoneBrand}
                    onChange={this.onChangeHandler}
                    maxLength={50}
                    onBlur={this.validateField}
                    role={AbstractRoles.input}
                  />
                </WithTracking>
              )}
              <ReactSelectWidget
                name={FIELD_NAME.PHONE_MODEL_ID}
                value={userData.model_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.PHONE_MODEL_ID)}
                placeholder={staticData.phoneModel}
                options={pageStore.dirMobilePhoneModel}
                onChange={this.handleChangeSelectFromParent}
                onBlur={this.validateFieldSelect}
              />
              {userData.shouldShow_PHONE_MODEL_OTHER == 'true' && (
                <WithTracking
                  id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.PHONE_MODEL_OTHER}`}
                  events={[
                    EFocusEvents.FOCUS,
                    EFocusEvents.BLUR,
                    EKeyboardEvents.KEY_UP,
                  ]}
                >
                  <input
                    name={FIELD_NAME.PHONE_MODEL_OTHER}
                    value={userData.modelOther || ''}
                    className={classNames(style.input, {
                      [style.error]: invalidFields.includes(
                        FIELD_NAME.PHONE_MODEL_OTHER
                      ),
                    })}
                    type={INPUT_TYPE.TEXT}
                    placeholder={staticData.otherPhoneModel}
                    onChange={this.onChangeHandler}
                    maxLength={50}
                    onBlur={this.validateField}
                    role={AbstractRoles.input}
                  />
                </WithTracking>
              )}
              <WithTracking
                id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.OTHER_PHONE_NUMBER}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <ReactInputMaskWidget
                  name={FIELD_NAME.OTHER_PHONE_NUMBER}
                  value={userData.otherPhoneNumber || ''}
                  className={style.inputMask}
                  invalid={invalidFields.includes(
                    FIELD_NAME.OTHER_PHONE_NUMBER
                  )}
                  type={INPUT_TYPE.TEL}
                  mask={phoneMask}
                  placeholder={
                    staticData.otherPhoneNumber || phoneMask.replace(/9/g, '*')
                  }
                  onChange={this.onChangeHandler}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
            </div>
            <WithTracking
              id={`Obligatory-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
              events={[EMouseEvents.CLICK]}
            >
              <button className={style.nextStep} type={BUTTON_TYPE.SUBMIT}>
                {gt.gettext('Confirm')}
              </button>
            </WithTracking>
          </form>
        </ClientTabs>
      );
    }
    return <Preloader />;
  }
}
