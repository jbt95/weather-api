import { Weather } from './entity';

export default interface WeatherRepository {
  getByCity(city: string): Promise<Weather | undefined>;
}
