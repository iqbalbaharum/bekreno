import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Calendar, CalendarRelations, User} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class CalendarRepository extends DefaultCrudRepository<
  Calendar,
  typeof Calendar.prototype.id,
  CalendarRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Calendar.prototype.id>;

  public readonly approval: BelongsToAccessor<User, typeof Calendar.prototype.id>;

  public readonly requestApprovalUser: BelongsToAccessor<User, typeof Calendar.prototype.id>;

  constructor(
    @inject('datasources.Mongo') dataSource: MongoDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Calendar, dataSource);
    this.requestApprovalUser = this.createBelongsToAccessorFor('requestApprovalUser', userRepositoryGetter,);
    this.registerInclusionResolver('requestApprovalUser', this.requestApprovalUser.inclusionResolver);
    this.approval = this.createBelongsToAccessorFor('approval', userRepositoryGetter,);
    this.registerInclusionResolver('approval', this.approval.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
