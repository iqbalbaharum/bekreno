import {hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {ModulePermission} from './module-permission.model';
import {Module} from './module.model';
import {OperationPermission} from './operation-permission.model';
import {Operation} from './operation.model';
import {Role} from './role.model';
import {Rolepermission} from './rolepermission.model';

@model()
export class Permission extends BaseEntity {
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
  name: string;

  @hasMany(() => Role, {through: {model: () => Rolepermission, keyFrom: 'permissionUuid', keyTo: 'roleUuid'}})
  roles: Role[];

  @hasMany(() => Module, {through: {model: () => ModulePermission, keyFrom: 'permissionUuid', keyTo: 'moduleUuid'}})
  modules: Module[];

  @hasMany(() => Operation, {through: {model: () => OperationPermission, keyFrom: 'permissionUuid', keyTo: 'operationUuid'}})
  operations: Operation[];

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}

export interface PermissionRelations {
}

export type PermissionWithRelations = Permission & PermissionRelations;
