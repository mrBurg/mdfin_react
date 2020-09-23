import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TComponenProps, TCopyright, TJSON } from '../../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../../src/apis';
import { Job } from '../../src/components/client';

const JobPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { pageData },
  } = props;

  return (
    <div className='page-container'>
      <Job staticData={pageData} {...props} />
    </div>
  );
};

export default JobPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'job-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'job-page',
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
