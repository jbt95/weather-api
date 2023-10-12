import {Weather} from "@/weather/domain/entity";
import NotFoundError from "./not-found.error";
import WeatherRepository from "@/weather/domain/repository";

interface Query {
  city: string;
}

export default class GetWeatherByCityQueryHandler {
  constructor(private readonly weatherRepository: WeatherRepository) {}

  public async handle(query: Query): Promise<Weather> {
    const weather = await this.weatherRepository.getByCity(query.city);
    if (!weather) {
      throw new NotFoundError(`City ${query.city} not found`);
    }
    return weather;
  }
}
