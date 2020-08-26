import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class OperationPermission extends BaseEntity {
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
  operationUuid?: string;

  constructor(data?: Partial<OperationPermission>) {
    super(data);
  }
}

export interface OperationPermissionRelations {
  // describe navigational properties here
}

export type OperationPermissionWithRelations = OperationPermission &
  OperationPermissionRelations;
