import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Deal } from '@components/Deal';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const DealPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
      <Deal {...props} />
    </div>
  );
};

export default DealPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'deal-page',
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
