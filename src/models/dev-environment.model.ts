import {hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Repository} from './repository.model';

@model()
export class DevEnvironment extends BaseEntity {
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
  language: string;

  @property({
    type: 'string',
  })
  version?: number;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @hasMany(() => Repository)
  repositories: Repository[];

  constructor(data?: Partial<DevEnvironment>) {
    super(data);
  }
}

export interface DevEnvironmentRelations {
  // describe navigational properties here
}

export type DevEnvironmentWithRelations = DevEnvironment &
  DevEnvironmentRelations;
