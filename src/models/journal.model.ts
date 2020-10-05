import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class Journal extends BaseEntity {
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
  detail: string;

  constructor(data?: Partial<Journal>) {
    super(data);
  }
}

export interface JournalRelations {
  // describe navigational properties here
}

export type JournalWithRelations = Journal & JournalRelations;
