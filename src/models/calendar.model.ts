import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User} from './user.model';

@model()
export class Calendar extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    default: 'pending'
  })
  status?: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: () => []
  })
  channels?: string[];

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    jsonSchema: {
      format: 'date-time',
    },
    required: true,
  })
  start: string;

  @property({
    type: 'date',
    jsonSchema: {
      format: 'date-time',
    },
  })
  end?: string;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => User, {name: 'approval'})
  approvalBy: string;

  @belongsTo(() => User)
  requestApprovalUserId: string;

  constructor(data?: Partial<Calendar>) {
    super(data);
  }
}

export interface CalendarRelations {
  // describe navigational properties here
}

export type CalendarWithRelations = Calendar & CalendarRelations;
