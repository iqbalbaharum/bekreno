import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Journal, JournalRelations, Project, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class JournalRepository extends DefaultCrudRepository<
  Journal,
  typeof Journal.prototype.id,
  JournalRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Journal.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Journal.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Journal, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
