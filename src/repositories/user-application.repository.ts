import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserApplication, UserApplicationRelations, User, Application} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {ApplicationRepository} from './application.repository';

export class UserApplicationRepository extends DefaultCrudRepository<
  UserApplication,
  typeof UserApplication.prototype.id,
  UserApplicationRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserApplication.prototype.id>;

  public readonly application: BelongsToAccessor<Application, typeof UserApplication.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ApplicationRepository') protected applicationRepositoryGetter: Getter<ApplicationRepository>,
  ) {
    super(UserApplication, dataSource);
    this.application = this.createBelongsToAccessorFor('application', applicationRepositoryGetter,);
    this.registerInclusionResolver('application', this.application.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
