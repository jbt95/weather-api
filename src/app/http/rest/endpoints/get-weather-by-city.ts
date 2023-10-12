import NotFoundError from '@/weather/application/queries/not-found.error';
import GetWeatherByCityQueryHandler from '@/weather/application/queries/get-weather-by-city';
import InMemoryRepository from '@/weather/infrastructure/adapters/in-memory-repository.service';
import { ServerInferRequest, ServerInferResponses } from '@ts-rest/core';
import { contract } from '@/app/http/rest/contract';

const queryHandler = new GetWeatherByCityQueryHandler(new InMemoryRepository());

type Request = ServerInferRequest<typeof contract.getWeather>;
type Response = ServerInferResponses<typeof contract.getWeather>;

export const handler = async (req: Request): Promise<Response> => {
  try {
    const body = await queryHandler.handle({
      city: req.params.city,
    });

    return {
      status: 200,
      body,
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
};
