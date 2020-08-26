import {DefaultCrudRepository} from '@loopback/repository';
import {OperationPermission, OperationPermissionRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OperationPermissionRepository extends DefaultCrudRepository<
  OperationPermission,
  typeof OperationPermission.prototype.uuid,
  OperationPermissionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(OperationPermission, dataSource);
  }
}
