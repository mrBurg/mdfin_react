import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import style from './Obligatory.module.scss';

import { TObligatory, TState, THandleChangeDate } from './@types';
import { phoneMask, dateMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE, FIELD_NAME } from '../../../constants';
import { gt, validator } from '../../../utils';
import { ClientTabs } from '../ClientTabs';
import { TOnInputChangeHandler } from '../../../interfaces';
import { DatepickerWidget } from '../../widgets/DatepickerWidget';
import { DIRECTORIES, URIS } from '../../../routes';
import { SelectWidget } from '../../widgets/SelectWidget';
import { Preloader } from '../../Preloader';
import { TField, TValidateProps } from '../../../stores/@types/userStore';
import { TDirectoryItem } from '../../../stores/@types/pageStore';

@observer
export class Obligatory extends PureComponent<TObligatory> {
  public readonly state: TState = {
    isRender: false,
    invalidFields: [],
  };

  componentDidMount() {
    const { pageStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      await this.refreshView();

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
  private async validateItems(): Promise<TValidateProps> {
    const {
      userStore: { userData },
    } = this.props;

    const validateItems: TValidateProps = [
      { name: FIELD_NAME.NAME, value: userData.name! },
      { name: FIELD_NAME.BIRTH_DATE, value: userData.birthDate! },
      { name: FIELD_NAME.ID, value: userData.cmnd_cccd! },
      { name: FIELD_NAME.ISSUE_DATE, value: userData.issueDate! },
      { name: FIELD_NAME.EXPIRE_DATE, value: userData.expireDate! },
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

  private validateFieldSelect = (_event: any, data: any) => {
    const { name, value } = data;
    this.validateForm([{ name, value }]);
  };

  private async validateForm(validateItems: TValidateProps): Promise<boolean> {
    const { userStore } = this.props;

    let validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    let invalidFields: string[] = this.state.invalidFields;
    const validateResult: string[] = await validator(validateItems, userStore);

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

    return !_.size(this.state.invalidFields);
  }

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    userStore.updateStore_UserData({ [name]: value.replace(/\s-\s/g, '') });
  };

  private handleChangeDate = ({ fieldName, date }: THandleChangeDate) => {
    const { userStore } = this.props;
    userStore.updateStore_UserData({ [fieldName]: date });
  };

  private handleChangeSelect = (_event: any, data: any) => {
    const { userStore } = this.props;
    new Promise((resolve) => {
      resolve(userStore.updateStore_UserData({ [data.name]: data.value }));
    }).then(() => {
      const { pageStore } = this.props;
      if (pageStore && data.name == 'brand_id') {
        let jsonArr = toJS(pageStore.dirMobilePhoneBrand);

        _.map(jsonArr, (item: TDirectoryItem) => {
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
    });
  };

  private handleChangeSelectFromParent = (_event: any, data: any) => {
    const { userStore } = this.props;
    new Promise((resolve) => {
      resolve(
        userStore.updateStore_UserData({
          [data.name]: data.value,
        })
      );
    }).then(() => {
      const { pageStore } = this.props;

      if (pageStore && data.name == 'model_id') {
        let jsonArr = toJS(pageStore.dirMobilePhoneModel);

        _.map(jsonArr, (item: TDirectoryItem) => {
          if (item.value === data.value) {
            const manualInput = item.manual_input;

            userStore.updateStore_UserData({
              shouldShow_PHONE_MODEL_OTHER: manualInput,
            });
          }
        });
      }
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
                pattern='[\s\p{L}]*'
                onBlur={this.validateField}
              />
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
                  dateFormat='dd/MM/yyyy'
                  customInput={
                    <InputMask type={INPUT_TYPE.TEL} mask={dateMask} />
                  }
                  onBlur={this.validateField}
                />
              </div>

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
              />

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
                  dateFormat='dd/MM/yyyy'
                  customInput={
                    <InputMask type={INPUT_TYPE.TEL} mask={dateMask} />
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
                  dateFormat='dd/MM/yyyy'
                  customInput={
                    <InputMask type={INPUT_TYPE.TEL} mask={dateMask} />
                  }
                  onBlur={this.validateField}
                />
              </div>
              <SelectWidget
                name={FIELD_NAME.GENDER_ID}
                value={userData.gender_id}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(FIELD_NAME.GENDER_ID),
                })}
                placeholder={staticData.gender}
                options={pageStore.dirGender}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              <SelectWidget
                name={FIELD_NAME.MARITAL_STATUS_ID}
                value={userData.maritalStatus_id}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.MARITAL_STATUS_ID
                  ),
                })}
                placeholder={staticData.maritalStatus}
                options={pageStore.dirMaritalStatus}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              <input
                name={FIELD_NAME.NUMBER_OF_DEPENDENTS}
                value={
                  !!userData.numberOfDependents
                    ? String(userData.numberOfDependents)
                    : ''
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
              />
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
              />
              <SelectWidget
                name={FIELD_NAME.LOAN_PURPOSE_ID}
                value={userData.loanPurpose_id}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.LOAN_PURPOSE_ID
                  ),
                })}
                placeholder={staticData.loanPurpose}
                options={pageStore.dirLoanPurpose}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              <div className={style.subTitle}>{staticData.whatPhone}</div>
              <SelectWidget
                name={FIELD_NAME.PHONE_BRAND_ID}
                value={userData.brand_id}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.PHONE_BRAND_ID
                  ),
                })}
                placeholder={staticData.phoneBrand}
                options={pageStore.dirMobilePhoneBrand}
                onChange={this.handleChangeSelect}
                onBlur={this.validateFieldSelect}
              />
              {userData.shouldShow_PHONE_BRAND_OTHER == 'true' && (
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
                />
              )}
              <SelectWidget
                name={FIELD_NAME.PHONE_MODEL_ID}
                value={userData.model_id}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.PHONE_MODEL_ID
                  ),
                })}
                placeholder={staticData.phoneModel}
                options={pageStore.dirMobilePhoneModel}
                onChange={this.handleChangeSelectFromParent}
                onBlur={this.validateFieldSelect}
              />
              {userData.shouldShow_PHONE_MODEL_OTHER == 'true' && (
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
                />
              )}
              <InputMask
                name={FIELD_NAME.OTHER_PHONE_NUMBER}
                value={userData.otherPhoneNumber || ''}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.OTHER_PHONE_NUMBER
                  ),
                })}
                type={INPUT_TYPE.TEL}
                mask={phoneMask}
                placeholder={
                  staticData.otherPhoneNumber || phoneMask.replace(/9/g, '*')
                }
                onChange={this.onChangeHandler}
                onBlur={this.validateField}
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
