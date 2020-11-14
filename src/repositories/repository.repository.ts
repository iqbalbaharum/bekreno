import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Repository, RepositoryRelations, DevEnvironment} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DevEnvironmentRepository} from './dev-environment.repository';

export class RepositoryRepository extends DefaultCrudRepository<
  Repository,
  typeof Repository.prototype.id,
  RepositoryRelations
> {

  public readonly devEnvironment: BelongsToAccessor<DevEnvironment, typeof Repository.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('DevEnvironmentRepository') protected devEnvironmentRepositoryGetter: Getter<DevEnvironmentRepository>,
  ) {
    super(Repository, dataSource);
    this.devEnvironment = this.createBelongsToAccessorFor('devEnvironment', devEnvironmentRepositoryGetter,);
    this.registerInclusionResolver('devEnvironment', this.devEnvironment.inclusionResolver);
  }
}
