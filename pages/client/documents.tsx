import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TComponenProps, TCopyright, TJSON } from '../../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../../src/apis';
import { Documents } from '../../src/components/client';

const DocumentsPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { pageData },
  } = props;

  return (
    <div className='page-container'>
      <Documents staticData={pageData} {...props} />
    </div>
  );
};

export default DocumentsPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'documents-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'documents-page',
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
