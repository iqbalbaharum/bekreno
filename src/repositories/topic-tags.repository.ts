import {DefaultCrudRepository} from '@loopback/repository';
import {TopicTags, TopicTagsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TopicTagsRepository extends DefaultCrudRepository<
  TopicTags,
  typeof TopicTags.prototype.id,
  TopicTagsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(TopicTags, dataSource);
  }
}
