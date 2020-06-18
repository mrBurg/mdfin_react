import NextApp from 'next/app';
import { ReactElement } from 'react';
import { Provider } from 'mobx-react';

import { Layout } from '../src/components/Layout';
import { isServer } from '../src/utils';
import initializeStores, { TStores } from '../src/stores';
import { IPageProps } from '../src/interfaces';

type TAppProps = IPageProps & { mobxStores: TStores };

export default class App extends NextApp {
  public readonly mobxStores: any;

  constructor(props: TAppProps) {
    super(props);

    this.mobxStores =
      isServer && props.mobxStores
        ? props.mobxStores
        : initializeStores(props.mobxStores);
  }

  public render(): ReactElement {
    return (
      <Provider {...this.mobxStores}>
        <Layout {...this.props} />
      </Provider>
    );
  }
}
