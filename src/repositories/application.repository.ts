import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Application, ApplicationProject, ApplicationRelations, Project, User} from '../models';
import {ApplicationProjectRepository} from './application-project.repository';
import {ProjectRepository} from './project.repository';
import {UserRepository} from './user.repository';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.id,
  ApplicationRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Application.prototype.id>;

  public readonly projects: HasManyThroughRepositoryFactory<Project, typeof Project.prototype.id,
          ApplicationProject,
          typeof Application.prototype.id
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ApplicationProjectRepository') protected applicationProjectRepositoryGetter: Getter<ApplicationProjectRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Application, dataSource);
    this.projects = this.createHasManyThroughRepositoryFactoryFor('projects', projectRepositoryGetter, applicationProjectRepositoryGetter,);
    this.registerInclusionResolver('projects', this.projects.inclusionResolver)
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
