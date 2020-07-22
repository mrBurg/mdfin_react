const http = require('http');
const https = require('https');
const express = require('express');
// const cors = require('cors');
const next = require('next');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');

const mainPage = require('./requests/mainPage');
const faqPage = require('./requests/faqPage');
const signInPage = require('./requests/signInPage');
const signUpPage = require('./requests/signUpPage');
const footer = require('./requests/footer');

dotenv.config({ path: './.env' });

const { HTTP_HOST, HTTP_PORT, HTTPS_HOST, HTTPS_PORT, NODE_ENV } = process.env;

const nextApp = next({ dev: NODE_ENV !== 'production' });
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

  mainPage(server);
  faqPage(server);
  signInPage(server);
  signUpPage(server);
  footer(server);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = http.createServer(server);
  const httpsServer = https.createServer(credentials, server);

  httpServer.listen(HTTP_PORT, serverCallback('HTTP', HTTP_HOST, HTTP_PORT));
  httpsServer.listen(
    HTTPS_PORT,
    serverCallback('HTTPS', HTTPS_HOST, HTTPS_PORT)
  );
})();
