import {model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';

@model()
export class RepositoryNote extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
  })
  repositoryId?: string;

  @property({
    type: 'string',
  })
  noteId?: string;

  constructor(data?: Partial<RepositoryNote>) {
    super(data);
  }
}

export interface RepositoryNoteRelations {
  // describe navigational properties here
}

export type RepositoryNoteWithRelations = RepositoryNote & RepositoryNoteRelations;
