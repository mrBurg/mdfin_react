import GetText from 'node-gettext';

import { defaultLocale, locales, defaultLocaleDomain } from '../config.json';
import { TJSON } from '../interfaces';

import enEN from '../locales/en-EN/common.po';
import viVN from '../locales/vi-VN/common.po';

const localesData: TJSON = {
  enEN,
  viVN,
};

export const gt: GetText = new GetText();

locales.forEach((locale: string): void => {
  gt.addTranslations(
    locale,
    defaultLocaleDomain,
    localesData[locale.replace('-', '')]
  );
});

gt.setTextDomain(defaultLocaleDomain);
gt.setLocale(defaultLocale);
