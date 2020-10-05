import {model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from '.';
import {User} from './user.model';
import {UserTrack} from './user-track.model';

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
