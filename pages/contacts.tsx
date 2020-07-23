import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import PageStore from '../src/stores/pageStore';
import { fetchCopyright } from '../src/apis/static/footer';
import { fetchPageData } from '../src/apis/static/contactsPage';
import { TJSON } from '../src/interfaces';
import { Contacts } from '../src/components/sections';

type TContactsPageProps = {
  pageStore: PageStore;
};

export default ({ pageStore }: TContactsPageProps): ReactElement => {
  const {
    documentTitle,
    pageData: { pageTitle, phones, emails },
  } = pageStore;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <h2 className='page-title'>{gt.gettext(pageTitle)}</h2>

      <Contacts phones={phones} emails={emails} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    background: true,
  };

  const pageData: TJSON = await fetchPageData();
  const copyright: string = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright, ...pageData },
      template,
    },
  };
};
