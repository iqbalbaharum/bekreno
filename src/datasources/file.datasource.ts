import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'File',
  connector: 'loopback-component-storage',
  provider: process.env.STORAGE_PROVIDER,
  key: process.env.STORAGE_PROVIDER_KEY,
  keyId: process.env.STORAGE_PROVIDER_KEY_ID,
  // provider: 'filesystem',
  // root: './storage',
  nameConflict: 'makeUnique',
  makeUnique: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class FileDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'File';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.File', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
