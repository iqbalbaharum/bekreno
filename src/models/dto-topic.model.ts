import {Model, model, property} from '@loopback/repository';

@model()
export class DtoTopic extends Model {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  tagIds: string[];

  constructor(data?: Partial<DtoTopic>) {
    super(data);
  }
}

export interface DtoTopicRelations {
  // describe navigational properties here
}

export type DtoTopicWithRelations = DtoTopic & DtoTopicRelations;
