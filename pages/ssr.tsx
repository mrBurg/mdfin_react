export default function SSR(props: any) {
  const {
    pageProps: { dateTime },
  } = props;

  return <h1>SSR {dateTime}</h1>;
}

export async function getServerSideProps() {
  return { props: { dateTime: Date.now() } };
}
