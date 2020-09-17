import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'SmsTac',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: process.env.SMS_URL,
        query: {
          email: '',
          key: process.env.SMS_API,
          recipient: '{mobile}',
          message: process.env.SMS_TAG + ' {message}',
          referenceID: '{rid}',
        },
      },
      functions: {
        sendSms: ['mobile', 'message', 'rid'],
      },
    },
  ],
  crud: false,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SmsTacDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'SmsTac';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.SmsTac', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
