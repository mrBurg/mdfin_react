import { FC, ReactElement } from 'react';
import Head from 'next/head';

import style from './Addresses.module.scss';

import { INPUT_TYPE, BUTTON_TYPE } from '../../../../constants';
import { TClientStepProps } from '../../Client';
import { gt } from '../../../../utils';

type TAddresses = {
  title: string;
  city: string;
  district: string;
  subdistrict: string;
  street: string;
  building: string;
  apartment: string;
  livingPeriod: string;
  years: string;
  months: string;
  thirdPartyPhone: string;
  thirdPartyName: string;
  thirdPartyRelation: string;
} & TClientStepProps;

export const Addresses: FC<TAddresses> = ({
  switchNextStepHendler,
  title,
  city,
  district,
  subdistrict,
  street,
  building,
  apartment,
  livingPeriod,
  years,
  months,
  thirdPartyPhone,
  thirdPartyName,
  thirdPartyRelation,
}): ReactElement => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <h2>{title}</h2>

      <form className={style.addresses}>
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={city} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={district} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={subdistrict} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={street} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={building} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={apartment} />
        {livingPeriod}
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={years} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={months} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={thirdPartyPhone} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={thirdPartyName} />
        <input className={style.input} type={INPUT_TYPE.TEXT} placeholder={thirdPartyRelation} />
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
