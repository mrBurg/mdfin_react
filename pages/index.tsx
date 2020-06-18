import Head from 'next/head';

import Gettext from 'node-gettext';
import GetText from 'node-gettext';
// import { po as gtParser } from 'gettext-parser';

import uaLocale from './../src/locales/ua-UA/common.json';
import ruLocale from './../src/locales/ru-RU/common.json';

import Counter from './../src/components/Counter';
import { GetStaticProps } from 'next';
import { TJSON } from '../src/interfaces';

const gt: GetText = new Gettext();

const domain: string = 'common';

gt.setTextDomain(domain);
gt.addTranslations('ua-UA', domain, uaLocale);
gt.addTranslations('ru-RU', domain, ruLocale);
gt.setLocale('ua-UA');

export default function (props: any) {
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

export const getStaticProps: GetStaticProps = async () => {
  const pageProps: TJSON = {
    title: gt.gettext('siteTitle'),
  };

  return {
    props: {
      ...pageProps,
    },
  };
};

/* export async function getStaticProps() {
  return { props: { date: Date.now() } };
} */

/* export async function getServerSideProps() {
  return { props: { date: Date.now() } };
} */
