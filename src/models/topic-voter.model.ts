import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class TopicVoter extends BaseEntity {
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
  userId?: string;

  constructor(data?: Partial<TopicVoter>) {
    super(data);
  }
}

export interface TopicVoterRelations {
  // describe navigational properties here
}

export type TopicVoterWithRelations = TopicVoter & TopicVoterRelations;
