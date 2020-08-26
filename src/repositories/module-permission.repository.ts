import {DefaultCrudRepository} from '@loopback/repository';
import {ModulePermission, ModulePermissionRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ModulePermissionRepository extends DefaultCrudRepository<
  ModulePermission,
  typeof ModulePermission.prototype.uuid,
  ModulePermissionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ModulePermission, dataSource);
  }
}
