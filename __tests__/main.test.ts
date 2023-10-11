import { app } from '../src/main';
import { initClient } from '@ts-rest/core';
import { contract } from '../src/contract';
import { mockWeather } from '../src/mock-weather';
import assert from 'node:assert/strict';

const port = 3334;

const client = initClient(contract, {
  baseUrl: `http://localhost:${port}`,
  baseHeaders: {},
});

const server = app.listen(port);

describe('When the server is running', () => {
  after(() => server.close());

  describe('and a user requests the weather for a city', () => {
    it('should return the weather for that city', async () => {
      const weather = await client.getWeather({ params: { city: 'madrid' } });
      assert.equal(weather.status, 200);
      assert.ok(weather.body);
      assert.deepEqual(weather.body, mockWeather.get('madrid'));
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
