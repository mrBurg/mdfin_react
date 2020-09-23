import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

<<<<<<< HEAD
import { AccordionWidget } from '../src/components/widgets/AccordionWidget';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
=======
import { gt } from '../src/utils';
import { AccordionWidget } from '../src/components/widgets/AccordionWidget';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchStaticData, fetchCopyright } from '../src/apis';
>>>>>>> a85b4cb444393e04c8f74cc591741bc0c71d158c

const FaqPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
<<<<<<< HEAD
=======
      documentTitle,
>>>>>>> a85b4cb444393e04c8f74cc591741bc0c71d158c
      pageData: { faqList },
    },
  } = props;

  return (
<<<<<<< HEAD
    <div className='page-container'>
      <AccordionWidget data={faqList} exclusive={false} fluid />
    </div>
=======
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <AccordionWidget data={faqList} exclusive={false} fluid />
      </div>
    </>
>>>>>>> a85b4cb444393e04c8f74cc591741bc0c71d158c
  );
};

export default FaqPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
<<<<<<< HEAD
  const template: TJSON = await fetchStaticData({
    block: 'faq-page',
    path: 'template',
  });

=======
>>>>>>> a85b4cb444393e04c8f74cc591741bc0c71d158c
  const pageData: TJSON = await fetchStaticData({
    block: 'faq-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
<<<<<<< HEAD
      template,
=======
>>>>>>> a85b4cb444393e04c8f74cc591741bc0c71d158c
    },
  };
};
