import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { fetchStaticData, fetchCopyright } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { Contacts } from '../src/components/sections';

const ContactsPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
      documentTitle,
      pageData: { pageTitle, phones, emails },
    },
  } = props;

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

export default ContactsPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    background: true,
  };

  const pageData: TJSON = await fetchStaticData({
    block: 'contacts-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
      template,
    },
  };
};
