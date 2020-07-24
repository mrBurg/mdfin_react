const https = require('https');
const express = require('express');
const next = require('next');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');
const args = require('yargs').argv;

const mainPage = require('./pages/main');
const contactsPage = require('./pages/contacts');
const faqPage = require('./pages/faq');
const paymentPage = require('./pages/payment');
const signInPage = require('./pages/signIn');
const signUpPage = require('./pages/signUp');
const footer = require('./footer');

let envVarPath = !args.p ? './.env.development' : './.env.production';

dotenv.config({ path: envVarPath });

const { HTTPS_HOST, HTTPS_PORT, NODE_ENV, PO_STATIC } = process.env;

const dev = NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const credentials = {
  key: readFileSync('./certificates/localhost.key', { encoding: 'utf8' }),
  cert: readFileSync('./certificates/localhost.cert', { encoding: 'utf8' }),
};

// const textParser = express.text({ type: 'text/html' });
// const urlencodedParser = express.urlencoded({ extended: false });
// const rawParser = express.raw({ type: 'application/vnd.custom-type' });
// const jsonParser = express.json({ type: 'application/*+json' });

const serverCallback = ((err) => {
  return (protocol, host, port) => {
    if (err) throw err;

    console.info(
      `${protocol} App ready on =>\n  host -> ${host}\n  port -> :${port}\n`
    );
  };
})();

(async () => {
  await nextApp.prepare();

  const server = express();

  server.use(PO_STATIC, mainPage);
  server.use(PO_STATIC, contactsPage);
  server.use(PO_STATIC, faqPage);
  server.use(PO_STATIC, paymentPage);
  server.use(PO_STATIC, signInPage);
  server.use(PO_STATIC, signUpPage);
  server.use(PO_STATIC, footer);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpsServer = https.createServer(credentials, server);

  httpsServer.listen(
    HTTPS_PORT,
    serverCallback('HTTPS', HTTPS_HOST, HTTPS_PORT)
  );
})();
