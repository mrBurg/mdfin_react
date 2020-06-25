import NextApp from 'next/app';
import { ReactElement } from 'react';
import { Provider } from 'mobx-react';

import './../src/scss/index.scss';

import { IPageProps } from '../src/interfaces';
import initializeStores, { TStores } from '../src/stores';
import { Layout, TLayoutProps } from '../src/components/Layout';

type TAppProps = IPageProps & { mobxStores: TStores };

export default class App extends NextApp<TAppProps> {
  public readonly mobxStores: TStores = initializeStores();

  public render(): ReactElement {
    const { localeStore } = this.mobxStores;

    const layoutProps: TLayoutProps = {
      localeStore,
      ...this.props,
    };

    return (
      <Provider {...this.mobxStores}>
        <Layout {...layoutProps} />
      </Provider>
    );
  }
}
