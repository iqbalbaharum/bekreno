import {DefaultCrudRepository} from '@loopback/repository';
import {ApplicationProject, ApplicationProjectRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ApplicationProjectRepository extends DefaultCrudRepository<
  ApplicationProject,
  typeof ApplicationProject.prototype.id,
  ApplicationProjectRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(ApplicationProject, dataSource);
  }
}
