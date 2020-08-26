import {DefaultCrudRepository} from '@loopback/repository';
import {Module, ModuleRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ModuleRepository extends DefaultCrudRepository<
  Module,
  typeof Module.prototype.uuid,
  ModuleRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Module, dataSource);
  }
}
