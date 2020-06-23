import { action, runInAction, observable } from 'mobx';

// import { URLS } from '../routes';
import { isBrowser } from '../utils';

export default class MainStore {
  @observable isMainPage: boolean = true;

  constructor() {
    // this.start();
  }

  /* @computed get isMainPage() {
    if (isBrowser) {
      return Router.route == URLS.HOME;
    }
  } */

  @action start = () => {
    setInterval(() => {
      runInAction(() => {
        if (isBrowser) {
          // this.isMainPage = Router.route == URLS.HOME;
          this.isMainPage = !this.isMainPage;
        }
      });
    }, 1000);
  };
}
