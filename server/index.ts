import http from 'http';
import https from 'https';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import Server from 'next/dist/next-server/server/next-server';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const { HTTP_HOST, HTTP_PORT, HTTPS_HOST, HTTPS_PORT, NODE_ENV } = process.env;

const nextApp: Server = next({ dev: NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();

const credentials: { [key: string]: string } = {
  key: readFileSync('./certificates/localhost.key', { encoding: 'utf8' }),
  cert: readFileSync('./certificates/localhost.cert', { encoding: 'utf8' }),
};

const serverCallback = ((err?: any): Function => {
  return (protocol: string, host: string, port: string) => {
    if (err) throw err;

    console.info(
      `${protocol} App ready on =>\n  host -> ${host}\n  port -> :${port}\n`
    );
  };
})();

(async () => {
  await nextApp.prepare();

  const server = express();

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.all(
    '*',
    (req: Request, res: Response): Promise<void> => {
      return handle(req, res);
    }
  );

  const httpServer: http.Server = http.createServer(server);
  const httpsServer: https.Server = https.createServer(credentials, server);

  httpServer.listen(HTTP_PORT, serverCallback('HTTP', HTTP_HOST, HTTP_PORT));
  httpsServer.listen(
    HTTPS_PORT,
    serverCallback('HTTPS', HTTPS_HOST, HTTPS_PORT)
  );
})();
