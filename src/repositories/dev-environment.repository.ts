import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DevEnvironment, DevEnvironmentRelations, Repository} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RepositoryRepository} from './repository.repository';

export class DevEnvironmentRepository extends DefaultCrudRepository<
  DevEnvironment,
  typeof DevEnvironment.prototype.id,
  DevEnvironmentRelations
> {

  public readonly repositories: HasManyRepositoryFactory<Repository, typeof DevEnvironment.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RepositoryRepository') protected repositoryRepositoryGetter: Getter<RepositoryRepository>,
  ) {
    super(DevEnvironment, dataSource);
    this.repositories = this.createHasManyRepositoryFactoryFor('repositories', repositoryRepositoryGetter,);
    this.registerInclusionResolver('repositories', this.repositories.inclusionResolver);
  }
}
