import { ReactElement } from 'react';

import { TJSON } from '../src/interfaces';

type TSSRProps = {
  pageProps: TJSON;
};

export default function SSG(props: TSSRProps): ReactElement {
  const {
    pageProps: { dateTime },
  } = props;

  return <h1>SSG {dateTime}</h1>;
}
export async function getStaticProps() {
  return { props: { dateTime: Date.now() } };
}
