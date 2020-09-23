import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TCopyright, TComponenProps, TJSON } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
import { Deal } from '../src/components/Deal';

const DealPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
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
    block: 'deal-page',
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
