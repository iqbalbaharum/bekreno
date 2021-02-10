import {DefaultCrudRepository} from '@loopback/repository';
import {TopicVoter, TopicVoterRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TopicVoterRepository extends DefaultCrudRepository<
  TopicVoter,
  typeof TopicVoter.prototype.id,
  TopicVoterRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(TopicVoter, dataSource);
  }
}
