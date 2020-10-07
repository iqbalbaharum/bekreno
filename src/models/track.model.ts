import {hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {UserTrack} from './user-track.model';
import {User} from './user.model';

@model()
export class Track extends BaseEntity {
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
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'string',
  })
  icon?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'text',
    },
  })
  about?: string;

  @hasMany(() => User, {through: {model: () => UserTrack}})
  users: User[];

  constructor(data?: Partial<Track>) {
    super(data);
  }
}

export interface TrackRelations {
  // describe navigational properties here
}

export type TrackWithRelations = Track & TrackRelations;
