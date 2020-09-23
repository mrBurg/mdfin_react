import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TCopyright, TComponenProps, TJSON } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
import { Application } from '../src/components/Application';

const ApplicationPage = (props: TComponenProps): ReactElement => {
  const {} = props;

  return (
    <div className='page-container'>
      <Application {...props} />
    </div>
  );
};

export default ApplicationPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'application-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'application-page',
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
