import { initContract } from '@ts-rest/core';
import { WeatherSchema } from '@/schema';
import * as z from 'zod';

const c = initContract();

export const contract = c.router({
  getWeather: {
    method: 'GET',
    path: `/weather/:city`,
    responses: {
      200: WeatherSchema,
      404: z.object({
        message: z.string(),
      }),
    },
    summary: 'Get the weather of a city by name',
    strictStatusCodes: true,
  },
});
