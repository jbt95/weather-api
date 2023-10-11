import { createExpressEndpoints, initServer } from '@ts-rest/express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { mockWeather } from './mock-weather';
import { contract } from './contract';
import morgan from 'morgan';

const port = process.env.port || 3333;

export const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));

const s = initServer();

export const router = s.router(contract, {
  getWeather: async ({ params: { city } }) => {
    const weather = mockWeather.get(city);
    if (!weather) {
      return {
        status: 404,
        body: { message: `CityNotFound` },
      };
    }
    return {
      status: 200,
      body: weather,
    };
  },
});

createExpressEndpoints(contract, router, app);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
