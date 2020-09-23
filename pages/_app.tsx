import { FC, ReactElement } from 'react';
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
import { NextHead } from '../src/components/NextHead';

type TAppProps = {
  Component: NextComponentType;
  pageProps: TJSON;
};

configure({ enforceActions: 'always' });

const App: FC<TAppProps> = (props): ReactElement => {
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
