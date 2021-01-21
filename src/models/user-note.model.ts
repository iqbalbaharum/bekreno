import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class UserNote extends BaseEntity {
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
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  noteId: string;


  constructor(data?: Partial<UserNote>) {
    super(data);
  }
}

export interface UserNoteRelations {
  // describe navigational properties here
}

export type UserNoteWithRelations = UserNote & UserNoteRelations;
