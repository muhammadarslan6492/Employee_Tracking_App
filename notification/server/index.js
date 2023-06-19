import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import * as http from 'http';
import { config } from 'dotenv';

import RabbitConnection from './core/rabbitmq';
import Socket from './core/socket';

config();

const root = path.normalize(`${__dirname}/../..`);
const app = new Express();
const server = http.createServer(app);
const socketServer = new Socket(server);

app.set('appPath', `${root}client`);
app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '1000kb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '1000kb',
  }),
);
app.use(Express.static(path.join(__dirname, './public')));
app.use(
  cors({
    origin: '*',
  }),
);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

try {
  setTimeout(() => {
    RabbitConnection.getInstance();
  }, 2000);

  app.use((req, res) => {
    res.status(404).json({ message: `${req.url} path not found` });
  });

  server.listen(8000, () => {
    console.log(`app running on system ${8000}`);
  });
} catch (err) {
  console.log(err);
}

export { socketServer };
