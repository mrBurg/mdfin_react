import React, { Component, ReactElement } from 'react';
import { IPageProps } from '../../interfaces';

import './../../scss/index.scss';
import './Layout.scss';
import Header from '../Header';

export class Layout extends Component<IPageProps> {
  // public state: any = {};

  /* public static getDerivedStateFromProps(props: any, state: any) {
    // props.authStore.readToken();
    console.info(props, '###');

    return {
      ...state,
    };
  }
 */

  /* public componentDidMount(): void {
    console.info('componentDidMount');

    this.setState((state: IPageState) => {
      return {
        ...state,
        isCSR: isBrowser
      };
    });
  } */

  /* public componentDidUpdate(): void {
    console.info('componentDidUpdate');
    let { authStore } = this.props;

    if (!authStore.hasToken) {
      this.redirectToSignin();
    }
  } */

  public render(): ReactElement {
    let { Component, ...pageProps } = this.props;

    return (
      <>
        <Header {...pageProps} />
        <main>
          <Component {...pageProps} />
        </main>
      </>
    );
  }
}
