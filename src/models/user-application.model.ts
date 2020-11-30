import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class UserApplication extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  applicationId: string;

  @property({
    type: 'string',
  })
  answers?: string;

  @property({
    type: 'string',
    default: 'joined'
  })
  status: string;

  constructor(data?: Partial<UserApplication>) {
    super(data);
  }
}

export interface UserApplicationRelations {
  // describe navigational properties here
}

export type UserApplicationWithRelations = UserApplication & UserApplicationRelations;
