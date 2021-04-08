import {Entity, model, property} from '@loopback/repository';
import {NotificationType} from '../types';

@model({
  settings: {
    mongodb: {
      collection: 'Notification'
    }
  }
})
export class Notification extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  refUserId?: string;

  @property({
    type: 'string',
  })
  refUserName?: string;

  @property({
    type: 'string',
  })
  refTypeId?: string;

  @property({
    type: 'number',
  })
  type?: NotificationType;

  @property({
    type: 'string',
  })
  action?: string;

  @property({
    type: 'string',
  })
  refId?: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: () => []
  })
  channels: string[];

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: Date;

  @property({
    type: 'date',
  })
  deletedAt?: Date;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  // describe navigational properties here
}

export type NotificationWithRelations = Notification & NotificationRelations;
