import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class ModulePermission extends BaseEntity {
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
  permissionUuid?: string;

  @property({
    type: 'string',
  })
  moduleUuid?: string;

  constructor(data?: Partial<ModulePermission>) {
    super(data);
  }
}

export interface ModulePermissionRelations {
  // describe navigational properties here
}

export type ModulePermissionWithRelations = ModulePermission &
  ModulePermissionRelations;
