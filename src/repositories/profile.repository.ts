import {DefaultCrudRepository} from '@loopback/repository';
import {Profile, ProfileRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProfileRepository extends DefaultCrudRepository<
  Profile,
  typeof Profile.prototype.uuid,
  ProfileRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Profile, dataSource);
  }
}
