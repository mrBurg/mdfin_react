import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { fetchCopyright, fetchStaticData } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { WrongAccount } from '../src/components/WrongAccount';

const WrongaccountPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
      <WrongAccount {...props} />
    </div>
  );
};

export default WrongaccountPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'wrongaccount-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'wrongaccount-page',
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
