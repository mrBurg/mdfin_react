import React, { Component, ReactElement } from 'react';

import style from './Footer.module.scss';

import { gt } from '../../utils';

type TFooterProps = {};
type TFooterState = {
  time?: string;
};

export class Footer extends Component<TFooterProps, TFooterState> {
  public readonly state: TFooterState = {};

  public componentDidMount(): void {
    setInterval((): void => {
      this.setState(
        (state: TFooterState): TFooterState => {
          const seconds = new Date().getSeconds();
          const time: string = `${seconds} ${gt.ngettext(
            'plural-seconds',
            'plural',
            seconds
          )}`;

          return {
            ...state,
            time,
          };
        }
      );
    }, 1000);
  }

  public render(): ReactElement {
    const { time } = this.state;

    if (time) {
      return <footer className={style.footer}>{time}</footer>;
    }

    return <footer className={style.footer}></footer>;
  }
}
