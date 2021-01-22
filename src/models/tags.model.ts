import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class Tags extends BaseEntity {
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
  title: string;


  constructor(data?: Partial<Tags>) {
    super(data);
  }
}

export interface TagsRelations {
  // describe navigational properties here
}

export type TagsWithRelations = Tags & TagsRelations;
