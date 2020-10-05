import {DefaultCrudRepository} from '@loopback/repository';
import {DevEnvironment, DevEnvironmentRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DevEnvironmentRepository extends DefaultCrudRepository<
  DevEnvironment,
  typeof DevEnvironment.prototype.id,
  DevEnvironmentRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(DevEnvironment, dataSource);
  }
}
