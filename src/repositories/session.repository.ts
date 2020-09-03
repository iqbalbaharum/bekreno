import {DefaultCrudRepository} from '@loopback/repository';
import {Session, SessionRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.uuid,
  SessionRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Session, dataSource);
  }
}
