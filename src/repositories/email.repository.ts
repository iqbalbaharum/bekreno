import {DefaultCrudRepository} from '@loopback/repository';
import {Email, EmailRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EmailRepository extends DefaultCrudRepository<
  Email,
  typeof Email.prototype.uuid,
  EmailRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Email, dataSource);
  }
}
