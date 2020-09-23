import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
import { Authorization } from '../src/components/Authorization';
import { URIS_SUFFIX } from '../src/constants';

const SignInPage = (props: TComponenProps): ReactElement => {
  return (
    <div className='page-container'>
      <Authorization page={URIS_SUFFIX.SIGN_IN} {...props} />
    </div>
  );
};

export default SignInPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'sign-in-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'sign-in-page',
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
