import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Credential} from './credential.model';

@model()
export class User extends Entity {
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

  @property({
    type: 'date',
    default: Date(),
  })
  createdAt: Date;

  @property({
    type: 'date',
    default: Date(),
  })
  updatedAt: Date;

  @belongsTo(() => Credential)
  credentialId: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
