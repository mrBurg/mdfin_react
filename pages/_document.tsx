import Document, { Head, Main, NextScript } from 'next/document';

import { defaultLocale } from './../src/config.json';

export default class CustomDocument extends Document {
  render() {
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