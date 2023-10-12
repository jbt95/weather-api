import { createExpressEndpoints, initServer } from '@ts-rest/express';
import * as express from 'express';
import helmet from 'helmet';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { mockWeather } from '@/mock-weather';
import { contract } from '@/contract';
import * as morgan from 'morgan';
import { generateOpenApi } from '@ts-rest/open-api';
import * as swaggerUi from 'swagger-ui-express';

const port = 3333;

export const app: express.Express = express();

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

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(
    generateOpenApi(
      contract,
      {
        info: {
          title: 'Weather API',
          version: '3.0.0',
        },
      },
      { setOperationId: true },
    ),
  ),
);

createExpressEndpoints(contract, router, app);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
