import {BalJsApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: BalJsApplication;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });
});
