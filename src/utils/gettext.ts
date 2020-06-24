import GetText from 'node-gettext';

import { defaultLocale, locales } from './../config.json';
import { TJSON } from '../interfaces';

export const gt: GetText = new GetText();

const domain: string = 'common';
const locelesPath: string = 'locales';

locales.forEach((locale: string) => {
  const localePath: string = `${locelesPath}/${locale}/${domain}`;

  import(`./../${localePath}.po`).then((localeData: TJSON) => {
    gt.addTranslations(locale, domain, localeData);
  });
});

gt.setTextDomain(domain);
gt.setLocale(defaultLocale);
