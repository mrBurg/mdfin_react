import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { WrongAccount } from '@components/WrongAccount';
import { TCopyright, TJSON } from '@interfaces';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { isDev } from '@utils';

const WrongaccountPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
      <WrongAccount {...props} />
    </div>
  );
};

export default WrongaccountPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'wrongaccount-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'wrongaccount-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  if (isDev) console.info('Context:', context);

  return {
    props: {
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
