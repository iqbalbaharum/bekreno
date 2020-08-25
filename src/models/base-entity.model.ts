import {Entity, model, property} from '@loopback/repository';

@model()
export abstract class BaseEntity extends Entity {
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

  constructor(data?: Partial<BaseEntity>) {
    super(data);
  }
}
