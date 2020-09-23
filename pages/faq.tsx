import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { AccordionWidget } from '../src/components/widgets/AccordionWidget';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';

const FaqPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
      pageData: { faqList },
    },
  } = props;

  return (
    <div className='page-container'>
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

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
      template,
    },
  };
};
