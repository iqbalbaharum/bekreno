import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Profile, ProfileRelations} from '../models';

export class ProfileRepository extends DefaultCrudRepository<
  Profile,
  typeof Profile.prototype.uuid,
  ProfileRelations
> {
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource) {
    super(Profile, dataSource);
  }
}
