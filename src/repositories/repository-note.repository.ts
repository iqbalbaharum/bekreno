import {DefaultCrudRepository} from '@loopback/repository';
import {RepositoryNote, RepositoryNoteRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RepositoryNoteRepository extends DefaultCrudRepository<
  RepositoryNote,
  typeof RepositoryNote.prototype.id,
  RepositoryNoteRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(RepositoryNote, dataSource);
  }
}
