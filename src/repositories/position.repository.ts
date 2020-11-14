import {DefaultCrudRepository} from '@loopback/repository';
import {Position, PositionRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PositionRepository extends DefaultCrudRepository<
  Position,
  typeof Position.prototype.id,
  PositionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Position, dataSource);
  }
}
