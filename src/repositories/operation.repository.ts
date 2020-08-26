import {DefaultCrudRepository} from '@loopback/repository';
import {Operation, OperationRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OperationRepository extends DefaultCrudRepository<
  Operation,
  typeof Operation.prototype.uuid,
  OperationRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Operation, dataSource);
  }
}
