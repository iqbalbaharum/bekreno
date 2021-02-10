import {DefaultCrudRepository} from '@loopback/repository';
import {TopicNotes, TopicNotesRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TopicNotesRepository extends DefaultCrudRepository<
  TopicNotes,
  typeof TopicNotes.prototype.id,
  TopicNotesRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(TopicNotes, dataSource);
  }
}
