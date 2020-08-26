import {hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Permission} from './permission.model';
import {Rolepermission} from './rolepermission.model';

@model()
export class Role extends BaseEntity {
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

  @hasMany(() => Permission, {through: {model: () => Rolepermission, keyFrom: 'roleUuid', keyTo: 'permissionUuid'}})
  permissions: Permission[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
