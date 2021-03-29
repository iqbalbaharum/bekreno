import {DefaultCrudRepository} from '@loopback/repository';
import {UserChannel, UserChannelRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserChannelRepository extends DefaultCrudRepository<
  UserChannel,
  typeof UserChannel.prototype.id,
  UserChannelRelations
> {
  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource,
  ) {
    super(UserChannel, dataSource);
  }
}
