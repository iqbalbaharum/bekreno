import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {User} from './user.model';

@model()
export class Profile extends BaseEntity {
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
  fullname?: string;

  @property({
    type: 'string',
  })
  github?: string;

  @property({
    type: 'string',
  })
  linkedin?: string;

  @property({
    type: 'string',
  })
  country?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  about?: string;

  @property({
    type: 'date',
  })
  birthday?: string;

  @property({
    type: 'string',
  })
  avatar?: string;


  @belongsTo(() => User)
  userId?: string;

  constructor(data?: Partial<Profile>) {
    super(data);
  }
}

export interface ProfileRelations {
  // describe navigational properties here
}

export type ProfileWithRelations = Profile & ProfileRelations;
