import {belongsTo, model, property, hasMany} from '@loopback/repository';
import {BaseEntity} from '.';
import {Project} from './project.model';
import {User} from './user.model';
import {Comment} from './comment.model';

@model()
export class Journal extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
    default: 'personal',
  })
  category: string;

  @property({
    type: 'string',
    required: true,
    mysql: {
      dataType: 'text',
    },
  })
  detail: string;

  @property({
    type: 'string',
    default: 'new',
  })
  status: string;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Comment)
  comments: Comment[];

  constructor(data?: Partial<Journal>) {
    super(data);
  }
}

export interface JournalRelations {
  // describe navigational properties here
}

export type JournalWithRelations = Journal & JournalRelations;
