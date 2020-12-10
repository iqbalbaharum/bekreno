import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {ApplicationProject} from './application-project.model';
import {Project} from './project.model';
import {User} from './user.model';

@model()
export class Application extends BaseEntity {
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
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'text',
    },
  })
  about?: string;

  @property({
    type: 'number',
    default: 0,
  })
  minProject?: number;

  @property({
    type: 'number',
    default: 1,
  })
  maxApplied?: number;

  @property({
    type: 'string',
  })
  logo?: string;

  @property({
    type: 'string',
  })
  icon?: string;

  @property({
    type: 'string',
  })
  questions?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  featured?: boolean;

  @property({
    type: 'string',
    default: 'online',
  })
  method?: string;

  @property({
    type: 'string',
  })
  location?: string;

  @belongsTo(() => User, {name: 'user'})
  createdby: string;

  @hasMany(() => Project, {through: {model: () => ApplicationProject, keyFrom: 'applicationId', keyTo: 'projectId'}})
  projects: Project[];

  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  // describe navigational properties here
}

export type ApplicationWithRelations = Application & ApplicationRelations;
