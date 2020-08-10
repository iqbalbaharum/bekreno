import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Credential, CredentialRelations} from '../models';

export class CredentialRepository extends DefaultCrudRepository<
  Credential,
  typeof Credential.prototype.uuid,
  CredentialRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Credential, dataSource);
  }
}
