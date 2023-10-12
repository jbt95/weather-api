import { app } from '@/app/http/rest/main';
import { initClient } from '@ts-rest/core';
import { contract } from '@/app/http/rest/contract';
import * as assert from 'assert/strict';
import * as http from 'http';
import InMemoryRepository from '@/weather/infrastructure/adapters/in-memory-repository.service';

const port = 3334;

const client = initClient(contract, {
  baseUrl: `http://localhost:${port}`,
  baseHeaders: {},
});

describe('When the server is running', () => {
  let server: http.Server;
  const repository = new InMemoryRepository();
  before(() => (server = app.listen(port)));
  after(() => server.close());

  describe('and a user requests the weather for a city', () => {
    it('should return the weather for that city', async () => {
      const weather = await client.getWeather({ params: { city: 'madrid' } });
      assert.equal(weather.status, 200);
      assert.ok(weather.body);
      assert.deepEqual(weather.body, await repository.getByCity('madrid'));
    });
  });

  describe('and a user requests the weather for a city that does not exist', () => {
    it('should return a 404', async () => {
      const weather = await client.getWeather({
        params: { city: 'not-exist' },
      });
      assert.equal(weather.status, 404);
      assert.equal(weather.body.message, 'CityNotFound');
    });
  });
});
