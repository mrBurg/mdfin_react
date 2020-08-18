const https = require('https');
const http = require('http');
const express = require('express');
const next = require('next');
const { readFileSync } = require('fs');
const dotenv = require('dotenv');
const args = require('yargs').argv;

// const mainPage = require('./modules/main');

switch (true) {
  case args.t:
    dotenv.config({ path: './.env.production.local' });
    break;
  case args.p:
    dotenv.config({ path: './.env.production' });
    break;
  default:
    dotenv.config({ path: './.env.development' });
    break;
}

const {
  HTTPS_SERVER_HOST,
  HTTPS_PORT,
  HTTP_SERVER_HOST,
  HTTP_PORT,
  NODE_ENV,
} = process.env;

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

  // server.use('/static', mainPage);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  if (dev) {
    const httpServer = http.createServer(server);

    httpServer.listen(
      HTTP_PORT,
      serverCallback('HTTP', HTTP_SERVER_HOST, HTTP_PORT)
    );
  }

  const httpsServer = https.createServer(credentials, server);

  httpsServer.listen(
    HTTPS_PORT,
    serverCallback('HTTPS', HTTPS_SERVER_HOST, HTTPS_PORT)
  );
})();
