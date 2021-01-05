import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Application } from '@components/Application';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const ApplicationPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
      <Application {...props} />
    </div>
  );
};

export default ApplicationPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'application-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'loan-info-form',
    path: 'form',
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
