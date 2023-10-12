import WeatherRepository from '@/weather/domain/repository';
import { Weather } from '@/weather/domain/entity';
import * as z from 'zod';
import { ForecastSchema, WeatherSchema } from '@/app/http/rest/schema';

type City = string;
const round = (n: number): number => Math.round(n * 100) / 100;
const generateRandomNumber = (): number => round(Math.random() * 100);

export default class InMemoryRepository implements WeatherRepository {
  private static readonly cities = new Map<City, z.infer<typeof WeatherSchema>>(
    [
      ['malaga', InMemoryRepository.generateMockWeather()],
      ['barcelona', InMemoryRepository.generateMockWeather()],
      ['madrid', InMemoryRepository.generateMockWeather()],
    ],
  );

  private static generateMockWeather(): z.infer<typeof WeatherSchema> {
    const forecast = Array.from(
      { length: 7 },
      (): z.infer<typeof ForecastSchema> => ({
        temperature: generateRandomNumber(),
        humidity: generateRandomNumber(),
        wind_speed: generateRandomNumber(),
        by_hour: Array.from({ length: 24 }, (_, i) => ({
          hour: new Date(
            `2021-01-01T${(i + 1).toString().padStart(2, '0')}:00:00`,
          ).toISOString(),
          temperature: generateRandomNumber(),
          humidity: generateRandomNumber(),
          wind_speed: generateRandomNumber(),
        })).sort(
          (a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime(),
        ),
      }),
    );

    return {
      current: forecast.at(0)!,
      forecast: forecast.slice(1),
      average: {
        temperature: round(
          forecast.reduce((acc, { temperature }) => acc + temperature, 0) /
            forecast.length,
        ),
        humidity: round(
          forecast.reduce((acc, { humidity }) => acc + humidity, 0) /
            forecast.length,
        ),
        wind_speed: round(
          forecast.reduce((acc, { wind_speed }) => acc + wind_speed, 0) /
            forecast.length,
        ),
      },
    };
  }

  async getByCity(city: string): Promise<Weather | undefined> {
    return InMemoryRepository.cities.get(city);
  }
}
