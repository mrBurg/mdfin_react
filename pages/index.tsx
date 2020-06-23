import Head from 'next/head';
import Gettext from 'node-gettext';
import GetText from 'node-gettext';

import { TJSON } from '../src/interfaces';

import { locales } from './../src/config.json';
import { inject } from 'mobx-react';
import { STORE_IDS } from '../src/stores';
import LocaleStore from '../src/stores/localeStore';

type TPageProps = {
  pageProps: TJSON;
  localeStore: LocaleStore;
};

const gt: GetText = new Gettext();

const domain: string = 'common';
const locelesPath: string = 'locales';

locales.forEach((locale: string) => {
  const localePath: string = `${locelesPath}/${locale}/${domain}`;

  import(`./../src/${localePath}.po`).then((localeData: TJSON) => {
    gt.addTranslations(locale, domain, localeData);
  });
});

gt.setTextDomain(domain);

export default inject(STORE_IDS.LOCALE_STORE)((props: TPageProps) => {
  const {
    localeStore: { locale },
  } = props;

  if (locale) {
    gt.setLocale(locale);
  }

  return (
    <>
      <Head>
        <title>{gt.gettext('hello')}</title>
      </Head>
    </>
  );
});
