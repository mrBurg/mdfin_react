import { observable, action, runInAction, computed } from 'mobx';

export default class MainStore {
  timer: NodeJS.Timeout | undefined;

  constructor() {
    this.start();
  }

  @observable counter = 0;

  @action start = () => {
    setInterval(() => {
      runInAction(() => {
        this.counter += 1;
      });
    }, 1000);
  };

  @computed get timeString() {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const format = (t: Date) =>
      `${pad(t.getUTCHours())}
			:${pad(t.getUTCMinutes())}
      :${pad(t.getUTCSeconds())}`;

    return format(new Date(this.counter));
  }
}
