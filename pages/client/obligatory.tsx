import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Obligatory } from '@components/client';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { isDev } from '@utils';
import { TCopyright, TJSON } from '@interfaces';

const ObligatoryPage = (props: TStores): ReactElement => {
  const {
    pageStore: { pageData },
  } = props;

  return (
    <div className="page-container">
      <Obligatory staticData={pageData} {...props} />
    </div>
  );
};

export default ObligatoryPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'obligatory-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'obligatory-page',
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
