import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongodb: {
      collection: 'Activity'
    }
  }
})
export class Activity extends Entity {
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
    type: 'string',
  })
  type?: string;

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

  constructor(data?: Partial<Activity>) {
    super(data);
  }
}

export interface ActivityRelations {
  // describe navigational properties here
}

export type ActivityWithRelations = Activity & ActivityRelations;
