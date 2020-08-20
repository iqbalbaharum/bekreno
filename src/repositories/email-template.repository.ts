import {DefaultCrudRepository} from '@loopback/repository';
import {EmailTemplate, EmailTemplateRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EmailTemplateRepository extends DefaultCrudRepository<
  EmailTemplate,
  typeof EmailTemplate.prototype.uuid,
  EmailTemplateRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(EmailTemplate, dataSource);
  }
}
