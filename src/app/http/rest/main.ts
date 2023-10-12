import { createExpressEndpoints, initServer } from '@ts-rest/express';
import * as express from 'express';
import helmet from 'helmet';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { contract } from '@/app/http/rest/contract';
import * as morgan from 'morgan';
import { generateOpenApi } from '@ts-rest/open-api';
import * as swaggerUi from 'swagger-ui-express';
import GetWeatherByCityQueryHandler from '@/weather/application/queries/get-weather-by-city';
import InMemoryRepository from '@/weather/infrastructure/adapters/in-memory-repository.service';
import NotFoundError from '@/weather/application/queries/not-found.error';

const port = 3333;

export const app: express.Express = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));

const s = initServer();

const getWeatherByCityQueryHandler = new GetWeatherByCityQueryHandler(
  new InMemoryRepository(),
);

export const router = s.router(contract, {
  getWeather: async ({ params: { city } }) => {
    try {
      const result = await getWeatherByCityQueryHandler.handle({ city });
      return {
        status: 200,
        body: result,
      };
    } catch (err) {
      if (err instanceof NotFoundError) {
        return {
          status: 404,
          body: { message: `CityNotFound` },
        };
      }
      return {
        status: 500,
        body: { message: `InternalError` },
      };
    }
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
