import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Job } from '@components/client';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const JobPage = (props: TStores): ReactElement => {
  const {
    pageStore: { pageData },
  } = props;

  return (
    <div className="page-container">
      <Job staticData={pageData} {...props} />
    </div>
  );
};

export default JobPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'job-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'job-page',
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
