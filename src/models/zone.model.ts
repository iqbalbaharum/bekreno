import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class Zone extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  uuid: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<Zone>) {
    super(data);
  }
}

export interface ZoneRelations {
  // describe navigational properties here
}

export type ZoneWithRelations = Zone & ZoneRelations;
