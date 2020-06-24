import { ReactElement } from 'react';

import { TJSON } from '../src/interfaces';

type TSSRProps = {
  pageProps: TJSON;
};

export default function SSR(props: TSSRProps): ReactElement {
  const {
    pageProps: { dateTime },
  } = props;

  return <h1>SSR {dateTime}</h1>;
}

export async function getServerSideProps() {
  return { props: { dateTime: Date.now() } };
}
