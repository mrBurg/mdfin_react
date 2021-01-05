import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { Inprocess } from '@components/Inprocess';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const InprocessPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
      <Inprocess {...props} />
    </div>
  );
};

export default InprocessPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'inprocess-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'inprocess-page',
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
