import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { Authorization } from '@components/Authorization';
import { URIS_SUFFIX } from '@src/constants';
import { TCopyright, TJSON } from '@interfaces';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { isDev } from '@utils';

const SignUpPage = (props: TStores): ReactElement => {
  return (
    <div className="page-container">
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

  if (isDev) console.info('Context:', context);

  return {
    props: {
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
