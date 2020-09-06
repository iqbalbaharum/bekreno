import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Session, SessionRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.uuid,
  SessionRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Session.prototype.uuid>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Session, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
