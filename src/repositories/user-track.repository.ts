import {DefaultCrudRepository} from '@loopback/repository';
import {UserTrack, UserTrackRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserTrackRepository extends DefaultCrudRepository<
  UserTrack,
  typeof UserTrack.prototype.id,
  UserTrackRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(UserTrack, dataSource);
  }
}
