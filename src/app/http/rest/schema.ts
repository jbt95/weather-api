import * as z from 'zod';

export const ForecastSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  wind_speed: z.number(),
  by_hour: z.array(
    z.object({
      hour: z.string(),
      temperature: z.number(),
      humidity: z.number(),
      wind_speed: z.number(),
    }),
  ),
});

export const WeatherSchema = z.object({
  current: ForecastSchema,
  forecast: z.array(ForecastSchema),
  average: ForecastSchema.omit({ by_hour: true }),
});
