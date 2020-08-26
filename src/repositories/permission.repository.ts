import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Permission, PermissionRelations, Role, Rolepermission, Module, ModulePermission, Operation, OperationPermission} from '../models';
import {RoleRepository} from './role.repository';
import {RolepermissionRepository} from './rolepermission.repository';
import {ModulePermissionRepository} from './module-permission.repository';
import {ModuleRepository} from './module.repository';
import {OperationPermissionRepository} from './operation-permission.repository';
import {OperationRepository} from './operation.repository';

export class PermissionRepository extends DefaultCrudRepository<
  Permission,
  typeof Permission.prototype.uuid,
  PermissionRelations
> {

  public readonly roles: HasManyThroughRepositoryFactory<Role, typeof Role.prototype.uuid,
          Rolepermission,
          typeof Permission.prototype.uuid
        >;

  public readonly modules: HasManyThroughRepositoryFactory<Module, typeof Module.prototype.uuid,
          ModulePermission,
          typeof Permission.prototype.uuid
        >;

  public readonly operations: HasManyThroughRepositoryFactory<Operation, typeof Operation.prototype.uuid,
          OperationPermission,
          typeof Permission.prototype.uuid
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RolepermissionRepository') protected rolepermissionRepositoryGetter: Getter<RolepermissionRepository>, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('ModulePermissionRepository') protected modulePermissionRepositoryGetter: Getter<ModulePermissionRepository>, @repository.getter('ModuleRepository') protected moduleRepositoryGetter: Getter<ModuleRepository>, @repository.getter('OperationPermissionRepository') protected operationPermissionRepositoryGetter: Getter<OperationPermissionRepository>, @repository.getter('OperationRepository') protected operationRepositoryGetter: Getter<OperationRepository>,
  ) {
    super(Permission, dataSource);
    this.operations = this.createHasManyThroughRepositoryFactoryFor('operations', operationRepositoryGetter, operationPermissionRepositoryGetter,);
    this.modules = this.createHasManyThroughRepositoryFactoryFor('modules', moduleRepositoryGetter, modulePermissionRepositoryGetter,);
    this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', roleRepositoryGetter, rolepermissionRepositoryGetter,);
  }
}
