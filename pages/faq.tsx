import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { AccordionWidget } from '../src/components/widgets/AccordionWidget';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchStaticData, fetchCopyright } from '../src/apis';

const FaqPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
      documentTitle,
      pageData: { faqList },
    },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <AccordionWidget data={faqList} exclusive={false} fluid />
      </div>
    </>
  );
};

export default FaqPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchStaticData({
    block: 'faq-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
    },
  };
};
