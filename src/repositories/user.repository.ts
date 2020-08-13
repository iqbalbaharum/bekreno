import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Credential, User, UserRelations} from '../models';
import {CredentialRepository} from './credential.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.uuid,
  UserRelations
> {
  public readonly credential: HasOneRepositoryFactory<
    Credential,
    typeof User.prototype.uuid
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('CredentialRepository')
    protected credentialRepositoryGetter: Getter<CredentialRepository>,
  ) {
    super(User, dataSource);
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
