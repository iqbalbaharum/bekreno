import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    hiddenProperties: ['password'],
  },
})
export class Credential extends Entity {
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
  password: string;

  @property({
    type: 'string',
  })
  resetToken: string;

  @property({
    type: 'date',
  })
  tokenCreatedAt?: Date;

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

  @property({
    type: 'boolean',
    default: true,
  })
  isActive: Boolean;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Credential>) {
    super(data);
  }
}

export interface CredentialRelations {
  // describe navigational properties here
}

export type CredentialWithRelations = Credential & CredentialRelations;
