import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User} from './user.model';

@model()
export class Material extends BaseEntity {
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

  @property({
    type: 'string',
    mysql: {
      dataType: 'text',
    },
  })
  description?: string;

  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
    default: 'pending',
  })
  reviewStatus?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'text',
    },
  })
  remark?: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Material>) {
    super(data);
  }
}

export interface MaterialRelations {
  // describe navigational properties here
}

export type MaterialWithRelations = Material & MaterialRelations;
