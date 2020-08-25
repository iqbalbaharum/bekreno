import {hasOne, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Credential} from './credential.model';

@model()
export class User extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  uuid?: string;

  @property({
    type: 'string',
    required: true,
  })
  mobile: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  email?: string;

  @hasOne(() => Credential)
  credential: Credential;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
