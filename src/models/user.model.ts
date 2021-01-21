import {hasMany, hasOne, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Credential} from './credential.model';
import {Journal} from './journal.model';
import {Profile} from './profile.model';
import {Role} from './role.model';
import {Session} from './session.model';
import {UserRole} from './user-role.model';
import {Repository} from './repository.model';
import {Application} from './application.model';
import {UserApplication} from './user-application.model';
import {Note} from './note.model';
import {UserNote} from './user-note.model';

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

  @hasMany(() => Role, {
    through: {model: () => UserRole, keyFrom: 'userUuid', keyTo: 'roleUuid'},
  })
  roles: Role[];

  @hasMany(() => Session, {keyTo: 'userUuid'})
  sessions: Session[];

  @hasMany(() => Journal)
  journals: Journal[];

  @hasOne(() => Profile)
  profile: Profile;

  @hasMany(() => Repository)
  repositories: Repository[];

  @hasMany(() => Application, {
    through: {model: () => UserApplication, keyFrom: 'userId', keyTo: 'applicationId'}
  })
  applications: Application[];

  @hasMany(() => Note, {through: {model: () => UserNote}})
  notes: Note[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
