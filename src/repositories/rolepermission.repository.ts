import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Rolepermission, RolepermissionRelations} from '../models';

export class RolepermissionRepository extends DefaultCrudRepository<
  Rolepermission,
  typeof Rolepermission.prototype.uuid,
  RolepermissionRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Rolepermission, dataSource);
  }
}
