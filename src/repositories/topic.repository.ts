import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {Topic, TopicRelations, User, Note, TopicNotes, Tags, TopicTags, TopicVoter} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {TopicNotesRepository} from './topic-notes.repository';
import {NoteRepository} from './note.repository';
import {TopicTagsRepository} from './topic-tags.repository';
import {TagsRepository} from './tags.repository';
import {TopicVoterRepository} from './topic-voter.repository';

export class TopicRepository extends DefaultCrudRepository<
  Topic,
  typeof Topic.prototype.id,
  TopicRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Topic.prototype.id>;

  public readonly notes: HasManyThroughRepositoryFactory<Note, typeof Note.prototype.id,
          TopicNotes,
          typeof Topic.prototype.id
        >;

  public readonly tags: HasManyThroughRepositoryFactory<Tags, typeof Tags.prototype.id,
          TopicTags,
          typeof Topic.prototype.id
        >;

  public readonly users: HasManyThroughRepositoryFactory<User, typeof User.prototype.uuid,
          TopicVoter,
          typeof Topic.prototype.id
        >;

  public readonly voters: HasManyThroughRepositoryFactory<User, typeof User.prototype.uuid,
          TopicVoter,
          typeof Topic.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TopicNotesRepository') protected topicNotesRepositoryGetter: Getter<TopicNotesRepository>, @repository.getter('NoteRepository') protected noteRepositoryGetter: Getter<NoteRepository>, @repository.getter('TopicTagsRepository') protected topicTagsRepositoryGetter: Getter<TopicTagsRepository>, @repository.getter('TagsRepository') protected tagsRepositoryGetter: Getter<TagsRepository>, @repository.getter('TopicVoterRepository') protected topicVoterRepositoryGetter: Getter<TopicVoterRepository>,
  ) {
    super(Topic, dataSource);
    this.voters = this.createHasManyThroughRepositoryFactoryFor('voters', userRepositoryGetter, topicVoterRepositoryGetter,);
    this.registerInclusionResolver('voters', this.voters.inclusionResolver);
    this.users = this.createHasManyThroughRepositoryFactoryFor('users', userRepositoryGetter, topicVoterRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.tags = this.createHasManyThroughRepositoryFactoryFor('tags', tagsRepositoryGetter, topicTagsRepositoryGetter,);
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
    this.notes = this.createHasManyThroughRepositoryFactoryFor('notes', noteRepositoryGetter, topicNotesRepositoryGetter,);
    this.registerInclusionResolver('notes', this.notes.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
