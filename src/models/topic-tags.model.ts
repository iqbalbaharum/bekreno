import {model, property} from '@loopback/repository';
import {BaseEntity} from '.';

@model()
export class TopicTags extends BaseEntity {
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
  tagsId?: string;

  constructor(data?: Partial<TopicTags>) {
    super(data);
  }
}

export interface TopicTagsRelations {
  // describe navigational properties here
}

export type TopicTagsWithRelations = TopicTags & TopicTagsRelations;
