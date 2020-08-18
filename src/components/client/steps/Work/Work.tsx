import { FC, ReactElement } from 'react';
import Head from 'next/head';

import style from './Work.module.scss';

import { INPUT_TYPE, BUTTON_TYPE } from '../../../../constants';
import { TClientStepProps } from '../../Client';
import { gt } from '../../../../utils';

type TWork = {
  title: string;
  socialStatus: string;
  education: string;
  company: string;
  industry: string;
  industryDetailed: string;
  positionLevel: string;
  position: string;
  workPeriod: string;
  years: string;
  months: string;
  colleaguePhone: string;
  colleagueName: string;
  jobPhoneRelationType: string;
  income: string;
} & TClientStepProps;

export const Work: FC<TWork> = ({
  switchNextStepHendler,
  title,
  socialStatus,
  education,
  company,
  industry,
  industryDetailed,
  positionLevel,
  position,
  workPeriod,
  years,
  months,
  colleaguePhone,
  colleagueName,
  jobPhoneRelationType,
  income,
}): ReactElement => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      
      <h2>{title}</h2>

      <form className={style.work}>
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={socialStatus}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={education}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={company}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={industry}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={industryDetailed}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={positionLevel}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={position}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={workPeriod}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={years}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={months}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={colleaguePhone}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={colleagueName}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={jobPhoneRelationType}
        />
        <input
          className={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={income}
        />
        <button
          className={style.nextStep}
          onClick={switchNextStepHendler}
          type={BUTTON_TYPE.BUTTON}
        >
          {gt.gettext('More')}
        </button>
      </form>
    </>
  );
};
