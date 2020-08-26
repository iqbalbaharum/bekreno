import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class Rolepermission extends BaseEntity {
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
  roleUuid?: string;

  @property({
    type: 'string',
  })
  permissionUuid?: string;

  constructor(data?: Partial<Rolepermission>) {
    super(data);
  }
}

export interface RolepermissionRelations {
  // describe navigational properties here
}

export type RolepermissionWithRelations = Rolepermission & RolepermissionRelations;
