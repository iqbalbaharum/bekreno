import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {Notification} from '../models';
import {NotificationType} from '../types';

/*
 * Fix the service type. Possible options can be:
 * - import {NotificationMessageCenter} from 'your-module';
 * - export type NotificationMessageCenter = string;
 * - export interface NotificationMessageCenter {}
 */
export type NotificationMessageCenter = unknown;

@bind({scope: BindingScope.TRANSIENT})
export class NotificationMessageCenterProvider implements Provider<NotificationMessageCenter> {
  constructor(
  ) {}

  value() {
    // Add your implementation here
    throw new Error('To be implemented');
  }

  async notify(notification: Notification) {
    switch(notification.type) {
      case NotificationType.TOPIC:

        break;
    }
  }


}
