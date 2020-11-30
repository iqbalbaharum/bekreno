import {DefaultCrudRepository} from '@loopback/repository';
import {UserApplication, UserApplicationRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserApplicationRepository extends DefaultCrudRepository<
  UserApplication,
  typeof UserApplication.prototype.id,
  UserApplicationRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(UserApplication, dataSource);
  }
}
