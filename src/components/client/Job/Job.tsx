import React, { ReactElement, PureComponent, FormEvent } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Job.module.scss';

import { phoneMask, otherPhoneMask } from '@src/config.json';
import { WithTracking } from '@components/hocs';
import { Preloader } from '@components/Preloader';
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
import { gt, isDev, validator } from '@utils';
import { ClientTabs } from '../ClientTabs';
import { TJob, TState } from './@types';
import { TField } from '@stores-types/userStore';

@observer
export class Job extends PureComponent<TJob> {
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

      await userStore.getWizardData_Job();

      pageStore.getDirectory(DIRECTORIES.dirSocialStatus);
      pageStore.getDirectory(DIRECTORIES.dirEducation);
      pageStore.getDirectory(DIRECTORIES.dirIndustry);
      pageStore.getDirectory(DIRECTORIES.dirJobPosType);
      pageStore.getDirectory(DIRECTORIES.dirJobRelationType);

      if (userStore.userDataJob.industry_id)
        await pageStore.getDirectory(
          DIRECTORIES.dirIndustryDetailed,
          String(userStore.userDataJob.industry_id)
        );

      this.setState({
        isRender: true,
      });
    });
  }

  /** Берем следующий / проверяем текущий шаг визарда */
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
      userStore: { userDataJob },
    } = this.props;

    const validateItems = await this.validateItems();
    const res = await this.validateForm(validateItems);

    if (!res) return;

    await userStore.saveWizardStep(URIS.job, { job: { ...userDataJob } });
    userStore.getClientNextStep();
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const {
      userStore: { userDataJob },
    } = this.props;

    const validateItems: TField[] = [
      {
        name: FIELD_NAME.SOCIAL_STATUS_ID,
        value: userDataJob.socialStatus_id || '',
      },
      { name: FIELD_NAME.EDUCATION_ID, value: userDataJob.education_id! },
      { name: FIELD_NAME.COMPANY_NAME, value: userDataJob.companyName || '' },
      { name: FIELD_NAME.INDUSTRY_ID, value: userDataJob.industry_id! },
      {
        name: FIELD_NAME.INDUSTRY_DETAILED_ID,
        value: userDataJob.industryDetailed_id!,
      },
      { name: FIELD_NAME.POS_TYPE_ID, value: userDataJob.posType_id! },
      { name: FIELD_NAME.POS_NAME, value: userDataJob.posName || '' },
      {
        name: FIELD_NAME.WORK_YEARS,
        value: String(userDataJob.jobLastPeriodYear) || '',
      },
      {
        name: FIELD_NAME.WORK_MONTHS,
        value: String(userDataJob.jobLastPeriodMonth) || '',
      },
      {
        name: FIELD_NAME.JOB_CONTACT_PHONE,
        value: userDataJob.contact?.phoneNumber || '',
      },
      {
        name: FIELD_NAME.JOB_CONTACT_NAME,
        value: userDataJob.contact?.name || '',
      },
      {
        name: FIELD_NAME.JOB_CONTACT_TYPE_ID,
        value: userDataJob.contact?.type_id!,
      },
      { name: FIELD_NAME.INCOME, value: userDataJob.income || '' },
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

  private onChangeHandler_Job: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    userStore.updateStore_Job({ [name]: value.replace(/\s-\s/g, '') });
  };

  private onChangeHandler_Contact: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    // поскольку, у нас одинаковые ключи "name" и "phoneNumber" для
    // для всех обьектов "имени" - изголяемся вот такой фигней.
    name = name.replace('jobContact_', '');

    userStore.updateStore_JobContact({ [name]: value.replace(/\s-\s/g, '') });
  };

  private handleChangeSelect_Job = (data: TSelectData) => {
    const { userStore, pageStore } = this.props;
    const IDs = [1, 2, 3, 4, 5];

    //очищаем поля, в зависимости от социального статуса
    if (
      data.name == FIELD_NAME.SOCIAL_STATUS_ID &&
      !~IDs.indexOf(Number(data.value))
    ) {
      const { job_id, education_id, income_id, income } = userStore.userDataJob;

      const newData = {
        job_id,
        education_id,
        income_id,
        income,
        [data.name]: data.value,
      };
      userStore.overwriteStore_Job({ ...newData });
    } else {
      userStore.updateStore_Job({ [data.name]: data.value });
    }

    if (pageStore && data.name == 'industry_id') {
      pageStore.getDirectory(DIRECTORIES.dirIndustryDetailed, data.value);
    }
  };

  private handleChangeSelect_Contact = (data: TSelectData) => {
    const { userStore } = this.props;
    userStore.updateStore_JobContact({ [data.name]: data.value });
  };

  public render(): ReactElement | null {
    const {
      staticData,
      pageStore,
      userStore: { userDataJob },
    } = this.props;

    const { invalidFields } = this.state;

    const IDs = [1, 2, 3, 4, 5];

    if (this.state.isRender) {
      return (
        <ClientTabs className={style.job}>
          <form onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <ReactSelectWidget
                name={FIELD_NAME.SOCIAL_STATUS_ID}
                value={userDataJob.socialStatus_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.SOCIAL_STATUS_ID)}
                placeholder={staticData.socialStatus}
                options={pageStore.dirSocialStatus}
                onChange={this.handleChangeSelect_Job}
                onBlur={this.validateFieldSelect}
              />
              <ReactSelectWidget
                name={FIELD_NAME.EDUCATION_ID}
                value={userDataJob.education_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.EDUCATION_ID)}
                placeholder={staticData.education}
                options={pageStore.dirEducation}
                onChange={this.handleChangeSelect_Job}
                onBlur={this.validateFieldSelect}
              />
              {!!~IDs.indexOf(userDataJob.socialStatus_id!) && (
                <>
                  <WithTracking
                    id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.COMPANY_NAME}`}
                    events={[
                      EFocusEvents.FOCUS,
                      EFocusEvents.BLUR,
                      EKeyboardEvents.KEY_UP,
                    ]}
                  >
                    <input
                      name={FIELD_NAME.COMPANY_NAME}
                      value={userDataJob.companyName || ''}
                      className={classNames(style.input, {
                        [style.error]: invalidFields.includes(
                          FIELD_NAME.COMPANY_NAME
                        ),
                      })}
                      type={INPUT_TYPE.TEXT}
                      placeholder={staticData.companyName}
                      onChange={this.onChangeHandler_Job}
                      maxLength={100}
                      onBlur={this.validateField}
                      role={AbstractRoles.input}
                    />
                  </WithTracking>
                  <ReactSelectWidget
                    name={FIELD_NAME.INDUSTRY_ID}
                    value={userDataJob.industry_id}
                    className={style.reactSelectWidget}
                    invalid={invalidFields.includes(FIELD_NAME.INDUSTRY_ID)}
                    placeholder={staticData.industry}
                    options={pageStore.dirIndustry}
                    onChange={this.handleChangeSelect_Job}
                    onBlur={this.validateFieldSelect}
                  />
                  <ReactSelectWidget
                    name={FIELD_NAME.INDUSTRY_DETAILED_ID}
                    value={userDataJob.industryDetailed_id}
                    className={style.reactSelectWidget}
                    invalid={invalidFields.includes(
                      FIELD_NAME.INDUSTRY_DETAILED_ID
                    )}
                    placeholder={staticData.industryDetailed}
                    options={pageStore.dirIndustryDetailed}
                    onChange={this.handleChangeSelect_Job}
                    onBlur={this.validateFieldSelect}
                  />
                  <ReactSelectWidget
                    name={FIELD_NAME.POS_TYPE_ID}
                    value={userDataJob.posType_id}
                    className={style.reactSelectWidget}
                    invalid={invalidFields.includes(FIELD_NAME.POS_TYPE_ID)}
                    placeholder={staticData.positionType}
                    options={pageStore.dirJobPosType}
                    onChange={this.handleChangeSelect_Job}
                    onBlur={this.validateFieldSelect}
                  />
                  <WithTracking
                    id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.POS_NAME}`}
                    events={[
                      EFocusEvents.FOCUS,
                      EFocusEvents.BLUR,
                      EKeyboardEvents.KEY_UP,
                    ]}
                  >
                    <input
                      name={FIELD_NAME.POS_NAME}
                      value={userDataJob.posName || ''}
                      className={classNames(style.input, {
                        [style.error]: invalidFields.includes(
                          FIELD_NAME.POS_NAME
                        ),
                      })}
                      type={INPUT_TYPE.TEXT}
                      placeholder={staticData.positionName}
                      onChange={this.onChangeHandler_Job}
                      maxLength={100}
                      onBlur={this.validateField}
                      role={AbstractRoles.input}
                    />
                  </WithTracking>
                  <div className={style.workPeriod}>
                    <p className={style.workPeriodTitle}>
                      {staticData.workPeriod}
                    </p>
                    <WithTracking
                      id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.WORK_YEARS}`}
                      events={[
                        EFocusEvents.FOCUS,
                        EFocusEvents.BLUR,
                        EKeyboardEvents.KEY_UP,
                      ]}
                    >
                      <input
                        name={FIELD_NAME.WORK_YEARS}
                        value={
                          userDataJob.jobLastPeriodYear != null
                            ? userDataJob.jobLastPeriodYear
                            : ''
                        }
                        className={classNames(style.input, {
                          [style.error]: invalidFields.includes(
                            FIELD_NAME.WORK_YEARS
                          ),
                        })}
                        type={INPUT_TYPE.TEL}
                        placeholder={staticData.years}
                        onChange={this.onChangeHandler_Job}
                        //min={0}
                        //max={99}
                        maxLength={2}
                        onBlur={this.validateField}
                        role={AbstractRoles.input}
                      />
                    </WithTracking>
                    <WithTracking
                      id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.WORK_MONTHS}`}
                      events={[
                        EFocusEvents.FOCUS,
                        EFocusEvents.BLUR,
                        EKeyboardEvents.KEY_UP,
                      ]}
                    >
                      <input
                        name={FIELD_NAME.WORK_MONTHS}
                        value={
                          userDataJob.jobLastPeriodMonth != null
                            ? userDataJob.jobLastPeriodMonth
                            : ''
                        }
                        className={classNames(style.input, {
                          [style.error]: invalidFields.includes(
                            FIELD_NAME.WORK_MONTHS
                          ),
                        })}
                        type={INPUT_TYPE.TEL}
                        placeholder={staticData.months}
                        onChange={this.onChangeHandler_Job}
                        //min={0}
                        max={12}
                        maxLength={2}
                        onBlur={this.validateField}
                        role={AbstractRoles.input}
                      />
                    </WithTracking>
                  </div>
                  <WithTracking
                    id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.JOB_CONTACT_PHONE}`}
                    events={[
                      EFocusEvents.FOCUS,
                      EFocusEvents.BLUR,
                      EKeyboardEvents.KEY_UP,
                    ]}
                  >
                    <ReactInputMaskWidget
                      name={FIELD_NAME.JOB_CONTACT_PHONE}
                      value={userDataJob.contact?.phoneNumber || ''}
                      className={style.inputMask}
                      invalid={invalidFields.includes(
                        FIELD_NAME.JOB_CONTACT_PHONE
                      )}
                      type={INPUT_TYPE.TEL}
                      mask={otherPhoneMask}
                      placeholder={
                        staticData.thirdPartyPhone ||
                        phoneMask.replace(/9/g, '*')
                      }
                      onChange={this.onChangeHandler_Contact}
                      onBlur={this.validateField}
                      maskChar={null}
                      role={AbstractRoles.input}
                    />
                  </WithTracking>
                  <WithTracking
                    id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.JOB_CONTACT_NAME}`}
                    events={[
                      EFocusEvents.FOCUS,
                      EFocusEvents.BLUR,
                      EKeyboardEvents.KEY_UP,
                    ]}
                  >
                    <input
                      name={FIELD_NAME.JOB_CONTACT_NAME}
                      value={userDataJob.contact?.name || ''}
                      className={classNames(style.input, {
                        [style.error]: invalidFields.includes(
                          FIELD_NAME.JOB_CONTACT_NAME
                        ),
                      })}
                      type={INPUT_TYPE.TEXT}
                      placeholder={staticData.jobContactName}
                      onChange={this.onChangeHandler_Contact}
                      maxLength={50}
                      onBlur={this.validateField}
                      role={AbstractRoles.input}
                    />
                  </WithTracking>
                  <ReactSelectWidget
                    name={FIELD_NAME.JOB_CONTACT_TYPE_ID}
                    value={userDataJob.contact?.type_id}
                    className={style.reactSelectWidget}
                    invalid={invalidFields.includes(
                      FIELD_NAME.JOB_CONTACT_TYPE_ID
                    )}
                    placeholder={staticData.jobContactType}
                    options={pageStore.dirJobRelationType}
                    onChange={this.handleChangeSelect_Contact}
                    onBlur={this.validateFieldSelect}
                  />
                </>
              )}
              <WithTracking
                id={`Job-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.INCOME}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.INCOME}
                  value={userDataJob.income != null ? userDataJob.income : ''}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.INCOME),
                  })}
                  type={INPUT_TYPE.TEL}
                  placeholder={staticData.income}
                  onChange={this.onChangeHandler_Job}
                  //min={0}
                  //max={999999999999999}
                  maxLength={15}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
            </div>

            <WithTracking
              id={`Job-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
              events={[EMouseEvents.CLICK]}
            >
              <button
                role={WidgetRoles.button}
                className={style.nextStep}
                type={BUTTON_TYPE.SUBMIT}
              >
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
