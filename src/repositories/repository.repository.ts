import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {Repository, RepositoryRelations, DevEnvironment, User, Project, Position, Note, RepositoryNote, Tags, Taging} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DevEnvironmentRepository} from './dev-environment.repository';
import {UserRepository} from './user.repository';
import {ProjectRepository} from './project.repository';
import {PositionRepository} from './position.repository';
import {RepositoryNoteRepository} from './repository-note.repository';
import {NoteRepository} from './note.repository';
import {TagingRepository} from './taging.repository';
import {TagsRepository} from './tags.repository';

export class RepositoryRepository extends DefaultCrudRepository<
  Repository,
  typeof Repository.prototype.id,
  RepositoryRelations
> {

  public readonly devEnvironment: BelongsToAccessor<DevEnvironment, typeof Repository.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Repository.prototype.id>;

  public readonly project: BelongsToAccessor<Project, typeof Repository.prototype.id>;

  public readonly position: BelongsToAccessor<Position, typeof Repository.prototype.id>;

  public readonly notes: HasManyThroughRepositoryFactory<Note, typeof Note.prototype.id,
          RepositoryNote,
          typeof Repository.prototype.id
        >;

  public readonly tags: HasManyThroughRepositoryFactory<Tags, typeof Tags.prototype.id,
          Taging,
          typeof Repository.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('DevEnvironmentRepository') protected devEnvironmentRepositoryGetter: Getter<DevEnvironmentRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('PositionRepository') protected positionRepositoryGetter: Getter<PositionRepository>, @repository.getter('RepositoryNoteRepository') protected repositoryNoteRepositoryGetter: Getter<RepositoryNoteRepository>, @repository.getter('NoteRepository') protected noteRepositoryGetter: Getter<NoteRepository>, @repository.getter('TagingRepository') protected tagingRepositoryGetter: Getter<TagingRepository>, @repository.getter('TagsRepository') protected tagsRepositoryGetter: Getter<TagsRepository>,
  ) {
    super(Repository, dataSource);
    this.tags = this.createHasManyThroughRepositoryFactoryFor('tags', tagsRepositoryGetter, tagingRepositoryGetter,);
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
    this.notes = this.createHasManyThroughRepositoryFactoryFor('notes', noteRepositoryGetter, repositoryNoteRepositoryGetter,);
    this.position = this.createBelongsToAccessorFor('position', positionRepositoryGetter,);
    this.registerInclusionResolver('position', this.position.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.devEnvironment = this.createBelongsToAccessorFor('devEnvironment', devEnvironmentRepositoryGetter,);
    this.registerInclusionResolver('devEnvironment', this.devEnvironment.inclusionResolver);
  }
}
