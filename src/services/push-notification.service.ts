import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {OneSignalDataSource} from '../datasources';

export interface PushNotificationService {
  /**
   * Sending push notification
   * @params [string] {opts.playerIds} - List of OneSignal player_id
   * @params [string] {opts.externalUserIds} - List of user session id
   * @params string {opts.title} - Notification title. Support english (en) only
   * @params string {opts.message} - Notification message body (en). Support english (en) only
   * @returns Promise {void}
   */
  // notify(opts: object, cb?: Function): Promise<void>;
  notifyBySegment(
    segments: [string],
    title: string,
    message: string,
  ): Promise<void>;
  notifyByDevice(
    externalIds: [string],
    title: string,
    message: string,
  ): Promise<void>;
}

export class PushNotificationServiceProvider
  implements Provider<PushNotificationService> {
  constructor(
    @inject('datasources.OneSignal')
    protected dataSource: OneSignalDataSource = new OneSignalDataSource(),
  ) {}

  value(): Promise<PushNotificationService> {
    return getService(this.dataSource);
  }
}
