import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class Operation extends BaseEntity {
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

  constructor(data?: Partial<Operation>) {
    super(data);
  }
}

export interface OperationRelations {
  // describe navigational properties here
}

export type OperationWithRelations = Operation & OperationRelations;
