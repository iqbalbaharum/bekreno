import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Journal, JournalRelations, Project, User, Comment} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';
import {CommentRepository} from './comment.repository';

export class JournalRepository extends DefaultCrudRepository<
  Journal,
  typeof Journal.prototype.id,
  JournalRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Journal.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Journal.prototype.id>;

  public readonly comments: HasManyRepositoryFactory<Comment, typeof Journal.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('CommentRepository') protected commentRepositoryGetter: Getter<CommentRepository>,
  ) {
    super(Journal, dataSource);
    this.comments = this.createHasManyRepositoryFactoryFor('comments', commentRepositoryGetter,);
    this.registerInclusionResolver('comments', this.comments.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
