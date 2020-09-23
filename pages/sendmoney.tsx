import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { fetchCopyright, fetchStaticData } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { NotificationText } from './../src/components/NotificationText';

const SendmoneyPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
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

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
