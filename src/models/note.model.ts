import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {User} from './user.model';

@model()
export class Note extends BaseEntity {
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
  text: string;

  @property({
    type: 'string'
  })
  sentiment: string;

  @belongsTo(() => User)
  toUserId: string;

  @belongsTo(() => User)
  fromUserId: string;

  constructor(data?: Partial<Note>) {
    super(data);
  }
}

export interface NoteRelations {
  // describe navigational properties here
}

export type NoteWithRelations = Note & NoteRelations;
