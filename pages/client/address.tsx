import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Address } from '@components/client';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const AddressPage = (props: TStores): ReactElement => {
  const {
    pageStore: { pageData },
  } = props;

  return (
    <div className="page-container">
      <Address staticData={pageData} {...props} />
    </div>
  );
};

export default AddressPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'address-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'address-page',
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
