import { ReactElement, PureComponent, FormEvent } from 'react';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';

import style from './Job.module.scss';

import { phoneMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE, FIELD_NAME } from '../../../constants';
import { ClientTabs } from '../ClientTabs';
import { gt } from '../../../utils';
import { DIRECTORIES, URIS } from '../../../routes';
import { TOnInputChangeHandler } from '../../../interfaces';
import { SelectWidget } from '../../widgets/SelectWidget';
import { Preloader } from '../../Preloader';
import { TUserJob } from '../../../stores/@types/userStore';
import { TJob, TState } from './@types';

@observer
export class Job extends PureComponent<TJob> {
  public readonly state: TState = {
    isRender: false,
    userDataJob: {},
  };

  componentDidMount() {
    const { pageStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      await userStore.getWizardData_Job();

      pageStore.getDirectory(DIRECTORIES.dirSocialStatus);
      pageStore.getDirectory(DIRECTORIES.dirEducation);
      pageStore.getDirectory(DIRECTORIES.dirIndustry);
      pageStore.getDirectory(DIRECTORIES.dirJobPosType);
      pageStore.getDirectory(DIRECTORIES.dirJobRelationType);

      if (this.state.userDataJob.industry_id)
        await pageStore.getDirectory(
          DIRECTORIES.dirIndustryDetailed,
          String(this.state.userDataJob.industry_id)
        );

      this.setState({
        isRender: true,
        userDataJob: { ...userStore.userDataJob },
      });
    });
  }

  private async submitForm() {
    const { userStore } = this.props;

    userStore.updateStore_Job(this.state.userDataJob);

    const newData: {
      job: TUserJob;
    } = {
      job: { ...this.state.userDataJob },
    };

    await userStore.saveWizardStep(URIS.job, newData);
    userStore.getClientNextStep();
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private onChangeHandler_Job: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TState): TState => {
        return {
          ...state,
          userDataJob: {
            ...state.userDataJob,
            [name]: value.replace(/\s-\s/g, ''),
          },
        };
      }
    );
  };

  private onChangeHandler_Contact: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TState): TState => {
        return {
          ...state,
          userDataJob: {
            ...state.userDataJob,
            contact: {
              ...state.userDataJob.contact,
              [name]: value.replace(/\s-\s/g, ''),
            },
          },
        };
      }
    );
  };

  private handleChangeSelect_Job = (_event: any, data: any) => {
    this.setState({
      ...this.state,
      userDataJob: {
        ...this.state.userDataJob,
        [data.name]: data.value,
      },
    });

    const { pageStore } = this.props;
    if (pageStore && data.name == 'industry_id') {
      pageStore.getDirectory(DIRECTORIES.dirIndustryDetailed, data.value);
    }
  };

  private handleChangeSelect_Contact = (_event: any, data: any) => {
    this.setState({
      ...this.state,
      userDataJob: {
        ...this.state.userDataJob,
        contact: {
          ...this.state.userDataJob.contact,
          [data.name]: data.value,
        },
      },
    });
  };

  public render(): ReactElement | null {
    const { staticData, pageStore } = this.props;
    const { userDataJob } = this.state;
    const IDs: Array<number> = [1, 2, 3, 4, 5];

    if (this.state.isRender) {
      return (
        <ClientTabs className={style.job}>
          <form onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <SelectWidget
                name={FIELD_NAME.SOCIAL_STATUS_ID}
                value={userDataJob.socialStatus_id}
                className={style.input}
                placeholder={staticData.socialStatus}
                options={pageStore.dirSocialStatus}
                onChange={this.handleChangeSelect_Job}
              />
              <SelectWidget
                name={FIELD_NAME.EDUCATION_ID}
                value={userDataJob.education_id}
                className={style.input}
                placeholder={staticData.education}
                options={pageStore.dirEducation}
                onChange={this.handleChangeSelect_Job}
              />
              {!!~IDs.indexOf(userDataJob.socialStatus_id!) && (
                <>
                  <input
                    name={FIELD_NAME.COMPANY_NAME}
                    value={userDataJob.companyName || ''}
                    className={style.input}
                    type={INPUT_TYPE.TEXT}
                    placeholder={staticData.companyName}
                    onChange={this.onChangeHandler_Job}
                    required={true}
                    maxLength={100}
                  />
                  <SelectWidget
                    name={FIELD_NAME.INDUSTRY_ID}
                    value={userDataJob.industry_id}
                    className={style.input}
                    placeholder={staticData.industry}
                    options={pageStore.dirIndustry}
                    onChange={this.handleChangeSelect_Job}
                  />
                  <SelectWidget
                    name={FIELD_NAME.INDUSTRY_DETAILED_ID}
                    value={userDataJob.industryDetailed_id}
                    className={style.input}
                    placeholder={staticData.industryDetailed}
                    options={pageStore.dirIndustryDetailed}
                    onChange={this.handleChangeSelect_Job}
                  />
                  <SelectWidget
                    name={FIELD_NAME.POS_TYPE_ID}
                    value={userDataJob.posType_id}
                    className={style.input}
                    placeholder={staticData.positionType}
                    options={pageStore.dirJobPosType}
                    onChange={this.handleChangeSelect_Job}
                  />
                  <input
                    name={FIELD_NAME.POS_NAME}
                    value={userDataJob.posName || ''}
                    className={style.input}
                    type={INPUT_TYPE.TEXT}
                    placeholder={staticData.positionName}
                    onChange={this.onChangeHandler_Job}
                    required={true}
                    maxLength={100}
                  />
                  <div className={style.workPeriod}>
                    <p className={style.workPeriodTitle}>
                      {staticData.workPeriod}
                    </p>
                    <input
                      name={FIELD_NAME.WORK_YEARS}
                      value={
                        !!userDataJob.jobLastPeriodYear
                          ? String(userDataJob.jobLastPeriodYear)
                          : ''
                      }
                      className={style.input}
                      type={INPUT_TYPE.TEL}
                      placeholder={staticData.years}
                      onChange={this.onChangeHandler_Job}
                      required={true}
                      min={0}
                      max={99}
                    />
                    <input
                      name={FIELD_NAME.WORK_MONTHS}
                      value={
                        !!userDataJob.jobLastPeriodMonth
                          ? String(userDataJob.jobLastPeriodMonth)
                          : ''
                      }
                      className={style.input}
                      type={INPUT_TYPE.TEL}
                      placeholder={staticData.months}
                      onChange={this.onChangeHandler_Job}
                      required={true}
                      min={0}
                      max={12}
                    />
                  </div>
                  <InputMask
                    name={FIELD_NAME.JOB_CONTACT_PHONE}
                    value={userDataJob.contact?.phoneNumber || ''}
                    className={style.input}
                    type={INPUT_TYPE.TEL}
                    mask={phoneMask}
                    placeholder={
                      staticData.jobContactPhone || phoneMask.replace(/9/g, '*')
                    }
                    onChange={this.onChangeHandler_Contact}
                  />
                  <input
                    name={FIELD_NAME.JOB_CONTACT_NAME}
                    value={userDataJob.contact?.name || ''}
                    className={style.input}
                    type={INPUT_TYPE.TEXT}
                    placeholder={staticData.jobContactName}
                    onChange={this.onChangeHandler_Contact}
                    maxLength={50}
                  />
                  <SelectWidget
                    name={FIELD_NAME.JOB_CONTACT_TYPE_ID}
                    value={userDataJob.contact?.type_id}
                    className={style.input}
                    placeholder={staticData.jobContactType}
                    options={pageStore.dirJobRelationType}
                    onChange={this.handleChangeSelect_Contact}
                  />
                </>
              )}

              <input
                name={FIELD_NAME.INCOME}
                value={userDataJob.income || ''}
                className={style.input}
                type={INPUT_TYPE.TEL}
                placeholder={staticData.income}
                onChange={this.onChangeHandler_Job}
                required={true}
                min={0}
                max={999999999999999}
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
