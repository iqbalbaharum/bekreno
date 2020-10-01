// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {NotificationSchema} from '../schema';
import {Notification} from '../types';
import {PushNotificationService} from './../services';

export class NotificationController {
  constructor(
    @inject('services.PushNotificationService')
    protected pushNotificationService: PushNotificationService,
  ) {}

  @post('/notify/segment', {
    responses: {
      '200': {
        description: 'Push notification tester',
      },
    },
  })
  async notifyBySegment(
    @requestBody({
      content: {
        'application/json': {schema: NotificationSchema},
      },
    })
    notification: Notification,
  ): Promise<void> {
    return this.pushNotificationService.notifyBySegment(
      notification.segments,
      notification.title,
      notification.message,
    );
  }

  @post('/notify/device', {
    responses: {
      '200': {
        description: 'Push notification tester',
      },
    },
  })
  async notifyByDevice(
    @requestBody({
      content: {
        'application/json': {schema: NotificationSchema},
      },
    })
    notification: Notification,
  ): Promise<void> {
    return this.pushNotificationService.notifyByDevice(
      notification.externalUserIds,
      notification.title,
      notification.message,
    );
  }
}
