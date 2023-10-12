export type Forecast = Readonly<{
  temperature: number;
  humidity: number;
  wind_speed: number;
  by_hour: {
    hour: string;
    temperature: number;
    humidity: number;
    wind_speed: number;
  }[];
}>;

export type Weather = Readonly<{
  current: Forecast;
  forecast: Forecast[];
  average: Omit<Forecast, 'by_hour'>;
}>;
