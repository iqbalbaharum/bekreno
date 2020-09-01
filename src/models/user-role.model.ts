import {model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';

@model()
export class UserRole extends BaseEntity {
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
  userUuid?: string;

  @property({
    type: 'string',
  })
  roleUuid?: string;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
