import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Notify } from '@components/Notify';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const NotifyPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
      <Notify className={'page-notification'} {...props} />
    </div>
  );
};

export default NotifyPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'notify-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'notify-page',
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
