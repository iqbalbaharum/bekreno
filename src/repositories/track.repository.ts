import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {Track, TrackRelations, User, UserTrack} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserTrackRepository} from './user-track.repository';
import {UserRepository} from './user.repository';

export class TrackRepository extends DefaultCrudRepository<
  Track,
  typeof Track.prototype.id,
  TrackRelations
> {

  public readonly users: HasManyThroughRepositoryFactory<User, typeof User.prototype.uuid,
          UserTrack,
          typeof Track.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserTrackRepository') protected userTrackRepositoryGetter: Getter<UserTrackRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Track, dataSource);
    this.users = this.createHasManyThroughRepositoryFactoryFor('users', userRepositoryGetter, userTrackRepositoryGetter,);
  }
}
