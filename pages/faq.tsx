import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import { AccordionWidget } from '@components/widgets/AccordionWidget';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const FaqPage = (props: TStores): ReactElement => {
  const {
    pageStore: {
      pageData: { faqList },
    },
  } = props;

  return (
    <div className="page-container">
      <AccordionWidget data={faqList} exclusive={false} fluid />
    </div>
  );
};

export default FaqPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'faq-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'faq-page',
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
