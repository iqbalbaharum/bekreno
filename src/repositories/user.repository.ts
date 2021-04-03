import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  HasOneRepositoryFactory,
  repository
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {
  Application, Credential,
  Journal,





  Note, Profile,




  Repository, Role,
  Session,
  User,

  UserApplication, UserNote, UserRelations,
  UserRole
} from '../models';
import {ApplicationRepository} from './application.repository';
import {CredentialRepository} from './credential.repository';
import {JournalRepository} from './journal.repository';
import {NoteRepository} from './note.repository';
import {ProfileRepository} from './profile.repository';
import {RepositoryRepository} from './repository.repository';
import {RoleRepository} from './role.repository';
import {SessionRepository} from './session.repository';
import {UserApplicationRepository} from './user-application.repository';
import {UserNoteRepository} from './user-note.repository';
import {UserRoleRepository} from './user-role.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.uuid,
  UserRelations
> {
  public readonly credential: HasOneRepositoryFactory<
    Credential,
    typeof User.prototype.uuid
  >;

  public readonly roles: HasManyThroughRepositoryFactory<
    Role,
    typeof Role.prototype.uuid,
    UserRole,
    typeof User.prototype.uuid
  >;

  public readonly sessions: HasManyRepositoryFactory<
    Session,
    typeof User.prototype.uuid
  >;

  public readonly journals: HasManyRepositoryFactory<
    Journal,
    typeof User.prototype.uuid
  >;
  public readonly profile: HasOneRepositoryFactory<
    Profile,
    typeof User.prototype.uuid
  >;

  public readonly repositories: HasManyRepositoryFactory<Repository, typeof User.prototype.uuid>;

  public readonly applications: HasManyThroughRepositoryFactory<
    Application,
    typeof Application.prototype.id,
    UserApplication,
    typeof User.prototype.uuid
  >;

  public readonly notes: HasManyThroughRepositoryFactory<Note, typeof Note.prototype.id,
          UserNote,
          typeof User.prototype.uuid
        >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('CredentialRepository')
    protected credentialRepositoryGetter: Getter<CredentialRepository>,
    @repository.getter('UserRoleRepository')
    protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('SessionRepository')
    protected sessionRepositoryGetter: Getter<SessionRepository>,
    @repository.getter('JournalRepository')
    protected journalRepositoryGetter: Getter<JournalRepository>,
    @repository.getter('ProfileRepository')
    protected profileRepositoryGetter: Getter<ProfileRepository>,
    @repository.getter('RepositoryRepository')
    protected repositoryRepositoryGetter: Getter<RepositoryRepository>,
    @repository.getter('UserApplicationRepository')
    protected userApplicationRepositoryGetter: Getter<UserApplicationRepository>,
    @repository.getter('ApplicationRepository')
    protected applicationRepositoryGetter: Getter<ApplicationRepository>, @repository.getter('UserNoteRepository') protected userNoteRepositoryGetter: Getter<UserNoteRepository>, @repository.getter('NoteRepository') protected noteRepositoryGetter: Getter<NoteRepository>,
  ) {
    super(User, dataSource);
    this.notes = this.createHasManyThroughRepositoryFactoryFor('notes', noteRepositoryGetter, userNoteRepositoryGetter,);
    this.registerInclusionResolver('notes', this.notes.inclusionResolver);
    this.repositories = this.createHasManyRepositoryFactoryFor('repositories', repositoryRepositoryGetter,);
    this.registerInclusionResolver('repositories', this.repositories.inclusionResolver);
    this.journals = this.createHasManyRepositoryFactoryFor(
      'journals',
      journalRepositoryGetter,
    );
    this.registerInclusionResolver('journals', this.journals.inclusionResolver);
    this.profile = this.createHasOneRepositoryFactoryFor(
      'profile',
      profileRepositoryGetter,
    );
    this.registerInclusionResolver('profile', this.profile.inclusionResolver);
    this.sessions = this.createHasManyRepositoryFactoryFor(
      'sessions',
      sessionRepositoryGetter,
    );
    this.registerInclusionResolver('sessions', this.sessions.inclusionResolver);
    this.roles = this.createHasManyThroughRepositoryFactoryFor(
      'roles',
      roleRepositoryGetter,
      userRoleRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
    this.applications = this.createHasManyThroughRepositoryFactoryFor(
      'applications',
      applicationRepositoryGetter,
      userApplicationRepositoryGetter,
    );
    this.registerInclusionResolver('applications', this.applications.inclusionResolver);
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
