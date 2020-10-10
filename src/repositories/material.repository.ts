import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Material, MaterialRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class MaterialRepository extends DefaultCrudRepository<
  Material,
  typeof Material.prototype.id,
  MaterialRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Material.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Material, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
