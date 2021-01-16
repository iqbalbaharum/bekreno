import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {Application} from './application.model';
import {User, UserWithRelations} from './user.model';

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
    mysql: {
      dataType: 'text'
    }
  })
  answers?: string;

  @property({
    type: 'string',
    default: 'draft'
  })
  state: string;

  @property({
    type: 'string',
    default: ''
  })
  status: string;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Application)
  applicationId: string;

  constructor(data?: Partial<UserApplication>) {
    super(data);
  }
}

export interface UserApplicationRelations {
  user?: UserWithRelations
}

export type UserApplicationWithRelations = UserApplication & UserApplicationRelations;
