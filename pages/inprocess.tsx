import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { fetchCopyright, fetchStaticData } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { Inprocess } from './../src/components/Inprocess';

const InprocessPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
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

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
