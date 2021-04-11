import {Entity, model, property} from '@loopback/repository';

@model()
export class UserChannel extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  refUserId: string;

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

  constructor(data?: Partial<UserChannel>) {
    super(data);
  }
}

export interface UserChannelRelations {
  // describe navigational properties here
}

export type UserChannelWithRelations = UserChannel & UserChannelRelations;
