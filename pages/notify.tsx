import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { fetchCopyright, fetchStaticData } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { Notify } from '../src/components/Notify';

const NotifyPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
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

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
