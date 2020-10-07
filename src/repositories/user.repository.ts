import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Credential, User, UserRelations, Role, UserRole, Session, Profile} from '../models';
import {CredentialRepository} from './credential.repository';
import {UserRoleRepository} from './user-role.repository';
import {RoleRepository} from './role.repository';
import {SessionRepository} from './session.repository';
import {ProfileRepository} from './profile.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.uuid,
  UserRelations
> {
  public readonly credential: HasOneRepositoryFactory<
    Credential,
    typeof User.prototype.uuid
  >;

  public readonly roles: HasManyThroughRepositoryFactory<Role, typeof Role.prototype.uuid,
          UserRole,
          typeof User.prototype.uuid
        >;

  public readonly sessions: HasManyRepositoryFactory<Session, typeof User.prototype.uuid>;

  public readonly profile: HasOneRepositoryFactory<Profile, typeof User.prototype.uuid>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('CredentialRepository')
    protected credentialRepositoryGetter: Getter<CredentialRepository>, @repository.getter('UserRoleRepository') protected userRoleRepositoryGetter: Getter<UserRoleRepository>, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('SessionRepository') protected sessionRepositoryGetter: Getter<SessionRepository>, @repository.getter('ProfileRepository') protected profileRepositoryGetter: Getter<ProfileRepository>,
  ) {
    super(User, dataSource);
    this.profile = this.createHasOneRepositoryFactoryFor('profile', profileRepositoryGetter);
    this.registerInclusionResolver('profile', this.profile.inclusionResolver);
    this.sessions = this.createHasManyRepositoryFactoryFor('sessions', sessionRepositoryGetter,);
    this.registerInclusionResolver('sessions', this.sessions.inclusionResolver);
    this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', roleRepositoryGetter, userRoleRepositoryGetter,);
    this.credential = this.createHasOneRepositoryFactoryFor(
      'credential',
      credentialRepositoryGetter,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.uuid,
  ): Promise<Credential | undefined> {
    try {
      return await this.credential(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
