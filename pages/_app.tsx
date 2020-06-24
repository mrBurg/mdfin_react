import NextApp from 'next/app';
import { ReactElement } from 'react';
import { Provider } from 'mobx-react';

import './../src/scss/index.scss';

import { IPageProps } from '../src/interfaces';
import LocaleStore from '../src/stores/localeStore';
import { isServer } from '../src/utils';
import initializeStores, { TStores } from '../src/stores';
import { Layout } from '../src/components/Layout';

type TAppProps = IPageProps & { mobxStores: TStores };
type TLayoutProps = IPageProps & { localeStore: LocaleStore };

export default class App extends NextApp<TAppProps> {
  public readonly mobxStores: TStores;

  constructor(props: TAppProps) {
    super(props);

    this.mobxStores =
      isServer && props.mobxStores
        ? props.mobxStores
        : initializeStores(props.mobxStores);
  }

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
