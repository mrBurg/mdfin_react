import { ReactElement } from 'react';
import { NextComponentType } from 'next';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';

import '../src/scss/index.scss';

import { TStores, useStore } from '../src/stores';
import Layout from '../src/components/Layout';
import { TLayoutProps } from '../src/components/Layout/Layout';
import { TJSON } from '../src/interfaces';

type TAppProps = {
  Component: NextComponentType;
  pageProps: TJSON;
};

configure({ enforceActions: 'always' });

export default ({ Component, pageProps }: TAppProps): ReactElement => {
  const { pageData, template } = pageProps;

  const mobxStores: TStores = useStore(pageData);
  const layoutProps: TLayoutProps = {
    Component,
    ...mobxStores,
  };

  return (
    <Provider {...mobxStores}>
      <Layout template={template} {...layoutProps} />
    </Provider>
  );
};
