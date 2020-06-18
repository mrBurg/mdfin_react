export default function SSG(props: any) {
  const {
    pageProps: { dateTime },
  } = props;

  return <h1>SSG {dateTime}</h1>;
}
export async function getStaticProps() {
  return { props: { dateTime: Date.now() } };
}
