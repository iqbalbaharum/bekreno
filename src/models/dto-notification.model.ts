import {Model, model, property} from '@loopback/repository';

@model()
export class DtoNotification extends Model {
  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  avatar?: string;

  @property({
    type: 'string',
  })
  refId?: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  message?: string;

  @property({
    type: 'date'
  })
  timestamp?: Date

  constructor(data?: Partial<DtoNotification>) {
    super(data);
  }
}

export interface DtoNotificationRelations {
  // describe navigational properties here
}

export type DtoNotificationWithRelations = DtoNotification & DtoNotificationRelations;
