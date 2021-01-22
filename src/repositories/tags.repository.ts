import {DefaultCrudRepository} from '@loopback/repository';
import {Tags, TagsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TagsRepository extends DefaultCrudRepository<
  Tags,
  typeof Tags.prototype.id,
  TagsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Tags, dataSource);
  }
}
