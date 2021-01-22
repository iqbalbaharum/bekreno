import {model, property, belongsTo, hasMany} from '@loopback/repository';
import {BaseEntity} from '.';
import {DevEnvironment} from './dev-environment.model';
import {User} from './user.model';
import {Project} from './project.model';
import {Position} from './position.model';
import {Note} from './note.model';
import {RepositoryNote} from './repository-note.model';
import {Tags} from './tags.model';
import {Taging} from './taging.model';

@model()
export class Repository extends BaseEntity {
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
  giturl: string;

  @property({
    type: 'string',
  })
  framework?: string;

  @property({
    type: 'string',
  })
  description?: string;
  @belongsTo(() => DevEnvironment)
  devEnvironmentId: string;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => Position)
  positionId: string;

  @hasMany(() => Note, {through: {model: () => RepositoryNote}})
  notes: Note[];

  @hasMany(() => Tags, {through: {model: () => Taging}})
  tags: Tags[];

  constructor(data?: Partial<Repository>) {
    super(data);
  }
}

export interface RepositoryRelations {
  // describe navigational properties here
}

export type RepositoryWithRelations = Repository & RepositoryRelations;
