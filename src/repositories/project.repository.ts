import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Project, ProjectRelations, Repository} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RepositoryRepository} from './repository.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly repositories: HasManyRepositoryFactory<Repository, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RepositoryRepository') protected repositoryRepositoryGetter: Getter<RepositoryRepository>,
  ) {
    super(Project, dataSource);
    this.repositories = this.createHasManyRepositoryFactoryFor('repositories', repositoryRepositoryGetter,);
    this.registerInclusionResolver('repositories', this.repositories.inclusionResolver);
  }
}
