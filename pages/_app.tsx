import { ReactElement } from 'react';
import { NextComponentType } from 'next';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';

// import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-slider/assets/index.css';

import '../src/scss/index.scss';

import { TStores, useStore } from '../src/stores';
import { Layout } from '../src/components/Layout';
import { TJSON } from '../src/interfaces';
import { TLayoutProps } from '../src/components/Layout/@types';

type TApp = {
  ({ Component, pageProps }: TAppProps): ReactElement;
};

type TAppProps = {
  Component: NextComponentType;
  pageProps: TJSON;
};

configure({ enforceActions: 'always' });

const App: TApp = ({ Component, pageProps }: TAppProps): ReactElement => {
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

export default App;
