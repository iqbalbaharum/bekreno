import {hasOne, model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Credential} from './credential.model';
import {Role} from './role.model';
import {UserRole} from './user-role.model';
import {Session} from './session.model';
import {Profile} from './profile.model';

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
  email: string;
  
  @hasOne(() => Credential)
  credential: Credential;

  @hasMany(() => Role, {through: {model: () => UserRole, keyFrom: 'userUuid', keyTo: 'roleUuid'}})
  roles: Role[];

  @hasMany(() => Session, {keyTo: 'userUuid'})
  sessions: Session[];

  @hasOne(() => Profile)
  profile: Profile;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
