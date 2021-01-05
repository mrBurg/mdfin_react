import _ from 'lodash';
import GetText from 'node-gettext';

import { defaultLocale, locales, defaultLocaleDomain } from '@src/config.json';

import enEN from '../locales/en-EN/common.po';
import viVN from '../locales/vi-VN/common.po';
import { TJSON } from '@interfaces';

const localesData: TJSON = {
  enEN,
  viVN,
};

class XGetText extends GetText {
  public xnpgettext(
    msgctxt: string,
    msgid: string,
    msgidPlural: string,
    count: number
  ): string {
    return this.npgettext(msgctxt, msgid, msgidPlural, count).replace(
      '%d',
      String(count)
    );
  }
}

export const gt: XGetText = new XGetText();

_.map(locales, (locale: string): void => {
  gt.addTranslations(
    locale,
    defaultLocaleDomain,
    localesData[locale.replace('-', '')]
  );
});

gt.setTextDomain(defaultLocaleDomain);
gt.setLocale(defaultLocale);
