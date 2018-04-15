/* @flow */
/* eslint-disable no-magic-numbers */
import assert from 'power-assert';
import nock from 'nock';
import APIClient from './APIClient';

describe('APIClient', () => {
  const endpoint = 'https://localhost';
  const mocks = {
    infos: [
      {
        id: 'aaa',
        title: 'Information!!'
      }
    ],
    user: {
      birthday: '2000-11-11',
      firstName: 'Taro',
      id: 'xxx',
      lastNaem: 'Yamada',
      registeredAt: '2018-04-10T00:00:00Z'
    }
  };
  beforeEach(() => {
    nock(endpoint)
      .post('/users')
      .reply(201, mocks.user)
      .get('/info')
      .reply(200, mocks.infos);
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('client can create user', async () => {
    const client = new APIClient({endpoint});
    const res = await client.userCreate({
      birthday: '2000-11-11',
      email: 'foo@example.com',
      firstName: 'Taro',
      lastName: 'Yamda',
      password: 'password'
    });
    assert(res.status === 201);
    assert.deepEqual(res.body, mocks.user);
    assert(typeof res.headers === 'object');
  });

  it('client throw assertion errors if receive invalid params', () => {
    const client = new APIClient({endpoint});
    assert.throws(() => {
      // missing required params
      // $FlowFixMe: raising flow error is correct. but I want to check validation at runtime.
      client.userCreate({
        birthday: '2000-11-11',
        email: 'foo@example.com',
        firstName: 'Taro',
        lastName: 'Yamda'
      });
    }, /AssertionError/);
  });

  it('client can get info instances', async () => {
    const client = new APIClient({endpoint});
    const res = await client.infoInstances();
    assert(res.status === 200);
    assert.deepEqual(res.body, mocks.infos);
    assert(typeof res.headers === 'object');
  });
});
