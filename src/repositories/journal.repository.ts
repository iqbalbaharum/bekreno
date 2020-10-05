import {DefaultCrudRepository} from '@loopback/repository';
import {Journal, JournalRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class JournalRepository extends DefaultCrudRepository<
  Journal,
  typeof Journal.prototype.id,
  JournalRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Journal, dataSource);
  }
}
