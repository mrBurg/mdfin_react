import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { NotificationText } from '@components/NotificationText';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const SendmoneyPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
      <NotificationText viewId={'sendmoney'} {...props} />
    </div>
  );
};

export default SendmoneyPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'sendmoney-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'sendmoney-page',
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
