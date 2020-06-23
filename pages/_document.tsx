import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';

import { defaultLocale } from './../src/config.json';

type TCustomDocumentProps = {
  defaultLocale: string;
};

export default class CustomDocument extends Document<TCustomDocumentProps> {
  static async getInitialProps(context: DocumentContext) {
    const initialProps: DocumentInitialProps = await Document.getInitialProps(
      context
    );

    return {
      ...initialProps,
      defaultLocale,
    };
  }

  render() {
    const { defaultLocale } = this.props;

    return (
      <html lang={defaultLocale}>
        <Head>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
