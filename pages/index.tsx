import Head from 'next/head';
import GetText from 'node-gettext';

import { TJSON } from '../src/interfaces';

import { defaultLocale, locales } from './../src/config.json';
/* import {
  GetStaticProps,
  GetStaticPropsContext,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'; */
import LocaleStore from '../src/stores/localeStore';
import { useContext } from 'react';
import { LocaleContext } from '../src/components/Layout';

type TPageProps = {
  pageProps: TJSON;
  localeStore: LocaleStore;
};

const gt: GetText = new GetText();

const domain: string = 'common';
const locelesPath: string = 'locales';

locales.forEach((locale: string) => {
  const localePath: string = `${locelesPath}/${locale}/${domain}`;

  import(`./../src/${localePath}.po`).then((localeData: TJSON) => {
    gt.addTranslations(locale, domain, localeData);
  });
});

gt.setTextDomain(domain);
gt.setLocale(defaultLocale);

export default (props: TPageProps) => {
  const localeContext = useContext(LocaleContext);

  if (localeContext) {
    const { locale } = localeContext;

    gt.setLocale(locale);
  }

  let {
    pageProps: { title },
  } = props;

  return (
    <>
      <Head>
        <title>
          {gt.gettext('hello')}
          {title}
        </title>
      </Head>
    </>
  );
};

/* export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return {
    props: {
      ...context,
      title: gt.gettext('hello'),
    },
  };
}; */

/* export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      title: gt.gettext('hello'),
    },
  };
}; */
