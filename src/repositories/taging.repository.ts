import {DefaultCrudRepository} from '@loopback/repository';
import {Taging, TagingRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TagingRepository extends DefaultCrudRepository<
  Taging,
  typeof Taging.prototype.id,
  TagingRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Taging, dataSource);
  }
}
