import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class Taging extends BaseEntity {
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
  repositoryId: string;

  @property({
    type: 'string',
    required: true,
  })
  tagsId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Taging>) {
    super(data);
  }
}

export interface TagingRelations {
  // describe navigational properties here
}

export type TagingWithRelations = Taging & TagingRelations;
