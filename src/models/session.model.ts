import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {User} from './user.model';

@model()
export class Session extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  uuid?: string;

  @property({
    type: 'string',
  })
  deviceToken?: string;

  @property({
    type: 'string',
  })
  pushType?: string;

  @belongsTo(() => User, {name: 'user'})
  userUuid: string;

  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
  // describe navigational properties here
}

export type SessionWithRelations = Session & SessionRelations;
