import { observable, action } from 'mobx';

import { gt } from '../utils';
import { defaultLocale } from './../config.json';

export default class LocaleStore {
  @observable public locale: string = defaultLocale;

  @action setCurrentLanguage(data: string) {
    this.locale = data;

    gt.setLocale(this.locale);

    console.info(`Locale has been changed to "${this.locale}"`);
  }
}
