import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Permission, Role, Rolepermission, RoleRelations} from '../models';
import {PermissionRepository} from './permission.repository';
import {RolepermissionRepository} from './rolepermission.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.uuid,
  RoleRelations
> {

  public readonly permissions: HasManyThroughRepositoryFactory<Permission, typeof Permission.prototype.uuid,
          Rolepermission,
          typeof Role.prototype.uuid
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RolepermissionRepository') protected rolepermissionRepositoryGetter: Getter<RolepermissionRepository>, @repository.getter('PermissionRepository') protected permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(Role, dataSource);
    this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', permissionRepositoryGetter, rolepermissionRepositoryGetter,);
  }
}
