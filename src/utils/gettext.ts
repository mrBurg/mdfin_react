import GetText from 'node-gettext';

import { defaultLocale, locales, defaultLocaleDomain } from './../config.json';
import { TJSON } from '../interfaces';

import uaLocale from './../locales/uk-UK/common.po';
import ruLocale from './../locales/ru-RU/common.po';

export const gt: GetText = new GetText();

const localesData: TJSON = {
  [locales[0]]: uaLocale,
  [locales[1]]: ruLocale,
};

locales.forEach((locale: string) => {
  gt.addTranslations(locale, defaultLocaleDomain, localesData[locale]);
});

gt.setTextDomain(defaultLocaleDomain);
gt.setLocale(defaultLocale);
