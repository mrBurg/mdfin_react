import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { TContactsProps } from '@components/sections/Contacts/@types';
import { Contacts } from '@components/sections';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { gt, isDev } from '@utils';

const ContactsPage = (props: TStores): ReactElement => {
  const {
    pageStore: {
      pageData: { pageTitle, ...contacts },
    },
  } = props;

  const contactsData = contacts as TContactsProps;

  return (
    <>
      <h2 className="page-title">{gt.gettext(pageTitle)}</h2>
      <Contacts {...contactsData} />
    </>
  );
};

export default ContactsPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'contacts-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'contacts-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  if (isDev) console.info('Context:', context);

  return {
    props: {
      pageData: { copyright: copyright.normal, ...pageData },
      template,
    },
  };
};
