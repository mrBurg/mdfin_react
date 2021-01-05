import { observable, action } from 'mobx';

import { defaultLocale } from '@src/config.json';
import { gt } from '@utils';

export class LocaleStore {
  @observable public locale: string = defaultLocale;

  @action setCurrentLanguage(data: string): void {
    this.locale = data;

    gt.setLocale(this.locale);

    console.info(`Language has been changed to "${this.locale}"`);
  }
}
