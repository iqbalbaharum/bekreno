import {DefaultCrudRepository} from '@loopback/repository';
import {UserNote, UserNoteRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserNoteRepository extends DefaultCrudRepository<
  UserNote,
  typeof UserNote.prototype.id,
  UserNoteRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(UserNote, dataSource);
  }
}
