import {model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from '.';
import {Repository} from './repository.model';

@model()
export class Project extends BaseEntity {
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
    mysql: {
      dataType: 'text'
    }
  })
  description?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'text'
    }
  })
  requirements?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'string',
  })
  icon?: string;

  @hasMany(() => Repository)
  repositories: Repository[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
