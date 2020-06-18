import Counter from './../src/components/Counter';

export default function (props: any) {
  return (
    <>
      <Counter />
      <h2>{props.pageProps.date}</h2>
    </>
  );
}

/* export async function getStaticProps() {
  return { props: { date: Date.now() } };
} */

/* export async function getServerSideProps() {
  return { props: { date: Date.now() } };
} */
