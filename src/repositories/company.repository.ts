import {DefaultCrudRepository} from '@loopback/repository';
import {Company, CompanyRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.uuid,
  CompanyRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Company, dataSource);
  }
}
