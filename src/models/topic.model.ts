import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from '.';
import {Note} from './note.model';
import {Tags} from './tags.model';
import {TopicNotes} from './topic-notes.model';
import {TopicTags} from './topic-tags.model';
import {TopicVoter} from './topic-voter.model';
import {User} from './user.model';

@model()
export class Topic extends BaseEntity {
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
  })
  description?: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Note, {through: {model: () => TopicNotes}})
  notes: Note[];

  @hasMany(() => Tags, {through: {model: () => TopicTags}})
  tags: Tags[];

  @hasMany(() => User, {through: {model: () => TopicVoter}})
  users: User[];

  @hasMany(() => User, {through: {model: () => TopicVoter}})
  voters: User[];

  constructor(data?: Partial<Topic>) {
    super(data);
  }
}

export interface TopicRelations {
  // describe navigational properties here
}

export type TopicWithRelations = Topic & TopicRelations;
