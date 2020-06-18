import { NextComponentType } from 'next';
import { AppInitialProps } from 'next/app';
import { Router } from 'next/router';

export type IPageProps = {
  Component: NextComponentType;
  pageProps: AppInitialProps;
  router: Router;
};
