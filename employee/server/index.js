import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';

import db from './config/db';
import Router from './modules/router/index';
import RabbitConnection from './config/rabbitmq';

config();

const port = process.env.PORT || 3000;
const root = path.normalize(`${__dirname}/../..`);
const app = new Express();
app.set('appPath', `${root}client`);
app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '1000kb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '1000kb',
  }),
);
app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '1000kb' }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(Express.static(`${root}/public`));
app.use(
  cors({
    origin: '*',
  }),
);
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'apis is working' });
});

try {
  db();

  setInterval(() => {
    RabbitConnection.getInstance();
  }, 2000);

  app.use('/api/v1', Router);

  http.createServer(app).listen(port, () => {
    const msg = `up and running in ${
      process.env.NODE_ENV || 'development'
    } @: ${os.hostname()} on port: ${port}}`;
    console.info(msg);
  });
} catch (err) {
  console.log(err);
}

export { app };
