import { observable, action } from 'mobx';
import { setCookie, isBrowser } from '../utils';
import { LANG_COOKIE_NAME } from '../constants';

export default class LocaleStore {
  @observable locale: string | null = null;

  @action setCurrentLanguage(data: string) {
    if (isBrowser) {
      setCookie(LANG_COOKIE_NAME, data);
    }

    this.locale = data;
  }
}
