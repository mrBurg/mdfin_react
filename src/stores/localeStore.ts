import { observable, action } from 'mobx';

import { setCookie, isBrowser, gt } from '../utils';
import { LANG_COOKIE_NAME } from '../constants';
import { defaultLocale } from './../config.json';

export default class LocaleStore {
  @observable public locale: string = defaultLocale;

  @action setCurrentLanguage(data: string) {
    if (isBrowser) {
      setCookie(LANG_COOKIE_NAME, data);

      this.locale = data;
      gt.setLocale(this.locale);

      console.info(`Locale has been changed to "${this.locale}"`);
    }
  }
}
