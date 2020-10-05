import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class UserTrack extends BaseEntity {
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
  trackId: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  constructor(data?: Partial<UserTrack>) {
    super(data);
  }
}

export interface UserTrackRelations {
  // describe navigational properties here
}

export type UserTrackWithRelations = UserTrack & UserTrackRelations;
