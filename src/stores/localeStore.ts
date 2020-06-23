import { observable, action } from 'mobx';

import { setCookie, isBrowser } from '../utils';
import { LANG_COOKIE_NAME } from '../constants';
import { defaultLocale } from './../config.json';

export default class LocaleStore {
  @observable locale: string = defaultLocale;

  @action setCurrentLanguage(data: string) {
    if (isBrowser) {
      setCookie(LANG_COOKIE_NAME, data);

      this.locale = data;
      console.info(`Locale has been changed to "${this.locale}"`);
    }
  }
}
