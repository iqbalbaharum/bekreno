import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from '.';
import {User} from './user.model';

@model()
export class Comment extends BaseEntity {
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
    mysql: {
      dataType: 'text',
    },
  })
  comment: string;

  @property({
    type: 'string',
  })
  journalId?: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
