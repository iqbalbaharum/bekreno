import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Template, TemplateRelations} from '../models';

export class TemplateRepository extends DefaultCrudRepository<
  Template,
  typeof Template.prototype.uuid,
  TemplateRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Template, dataSource);
  }
}
