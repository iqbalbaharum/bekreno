import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'OneSignal',
  connector: 'rest',
  options: {
    headers: {
      Authorization: `Basic ${process.env.ONESIGNAL_APPKEY}`,
      'Content-Type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: 'https://onesignal.com/api/v1/notifications',
        body: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          app_id: process.env.ONESIGNAL_APPID,
          contents: {
            en: '{message}',
          },
          headings: {
            en: '{title}',
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          included_segments: '{segment}',
        },
      },
      functions: {
        notifyBySegment: ['segment', 'title', 'message'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'https://onesignal.com/api/v1/notifications',
        body: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          app_id: process.env.ONESIGNAL_APPID,
          contents: {
            en: '{message}',
          },
          headings: {
            en: '{title}',
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          include_external_user_ids: '{externalIds}',
        },
      },
      functions: {
        notifyByDevice: ['externalIds', 'title', 'message'],
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
export class OneSignalDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'OneSignal';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.OneSignal', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
