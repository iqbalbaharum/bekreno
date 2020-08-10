import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
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
  public readonly credential: BelongsToAccessor<
    Credential,
    typeof User.prototype.uuid
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('CredentialRepository')
    protected credentialRepositoryGetter: Getter<CredentialRepository>,
  ) {
    super(User, dataSource);
    this.credential = this.createBelongsToAccessorFor(
      'credential',
      credentialRepositoryGetter,
    );
  }
}
