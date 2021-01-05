import React, { ReactElement } from 'react';
import { NextComponentType } from 'next';
import { Provider, useStaticRendering } from 'mobx-react';
import { configure } from 'mobx';

// import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-slider/assets/index.css';

import '../src/scss/index.scss';

import { isServer } from '@utils';
import { TJSON } from '@interfaces';
import { TStores, useStore } from '@stores';
import { TLayoutProps } from '@components/Layout/@types';
import { NextHead } from '@components/NextHead';
import { Layout } from '@components/Layout';

type TAppProps = {
  Component: NextComponentType;
  pageProps: TJSON;
};

configure({ enforceActions: 'always' });

const App = (props: TAppProps): ReactElement => {
  useStaticRendering(isServer);

  const {
    Component,
    pageProps: { pageData, template },
  } = props;

  const mobxStores: TStores = useStore(pageData);
  const layoutProps: TLayoutProps = {
    Component,
    ...mobxStores,
  };

  return (
    <Provider {...mobxStores}>
      <NextHead />
      <Layout template={template} {...layoutProps} />
    </Provider>
  );
};

export default App;
