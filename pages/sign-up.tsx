import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
import { Authorization } from '../src/components/Authorization';
import { URIS_SUFFIX } from '../src/constants';

const SignUpPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
      <Authorization page={URIS_SUFFIX.SIGN_UP} {...props} />
    </div>
  );
};

export default SignUpPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'sign-up-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'sign-up-page',
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
