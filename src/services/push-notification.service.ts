import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {OneSignalDataSource} from '../datasources';

export interface PushNotificationService {
  notify(opts: object, cb?: Function): Promise<void>;
}

export class PushNotificationServiceProvider
  implements Provider<PushNotificationService> {
  constructor(
    @inject('datasources.onesignal')
    protected dataSource: OneSignalDataSource = new OneSignalDataSource(),
  ) {}

  value(): Promise<PushNotificationService> {
    return getService(this.dataSource);
  }
}
