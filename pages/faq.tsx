import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import PageStore from '../src/stores/pageStore';
import { fetchCopyright } from '../src/apis/static/footer';
import { AccordionWidget } from '../src/components/AccordionWidget/AccordionWidget';
import { TJSON } from '../src/interfaces';
import { fetchPageData } from '../src/apis/static/faqPage';

type TFAQPageProps = {
  pageStore: PageStore;
};

export default ({ pageStore }: TFAQPageProps): ReactElement => {
  const {
    documentTitle,
    pageData: { faqList },
  } = pageStore;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <AccordionWidget {...faqList} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchPageData();
  const copyright: string = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright, ...pageData },
    },
  };
};
