import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Gettext from 'node-gettext';
import GetText from 'node-gettext';
// import { po as gtParser } from 'gettext-parser';

import uaLocale from './../src/locales/ua-UA/common.json';
import ruLocale from './../src/locales/ru-RU/common.json';

import Counter from './../src/components/Counter';
import { TJSON } from '../src/interfaces';

type TPageProps = {
  pageProps: TJSON;
};

const gt: GetText = new Gettext();

const domain: string = 'common';

gt.setTextDomain(domain);
gt.addTranslations('ua-UA', domain, uaLocale);
gt.addTranslations('ru-RU', domain, ruLocale);
gt.setLocale('ua-UA');

export default function (props: TPageProps) {
  console.info(props);
  const {
    pageProps: { title },
  } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Counter />
      <h2>{props.pageProps.date}</h2>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  // console.info(context);
  const pageProps: TJSON = {
    title: gt.gettext('siteTitle'),
  };

  return {
    props: {
      ...pageProps,
    },
  };
};

/* export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  console.info(context);
  const pageProps: TJSON = {
    title: gt.gettext('siteTitle'),
  };

  return {
    props: {
      ...pageProps,
    },
  };
}; */
