import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class TopicNotes extends BaseEntity {
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
  topicId?: string;

  @property({
    type: 'string',
  })
  noteId?: string;

  constructor(data?: Partial<TopicNotes>) {
    super(data);
  }
}

export interface TopicNotesRelations {
  // describe navigational properties here
}

export type TopicNotesWithRelations = TopicNotes & TopicNotesRelations;
