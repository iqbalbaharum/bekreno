import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Note, NoteRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class NoteRepository extends DefaultCrudRepository<
  Note,
  typeof Note.prototype.id,
  NoteRelations
> {

  public readonly toUser: BelongsToAccessor<User, typeof Note.prototype.id>;

  public readonly fromUser: BelongsToAccessor<User, typeof Note.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Note, dataSource);
    this.fromUser = this.createBelongsToAccessorFor('fromUser', userRepositoryGetter,);
    this.registerInclusionResolver('fromUser', this.fromUser.inclusionResolver);
    this.toUser = this.createBelongsToAccessorFor('toUser', userRepositoryGetter,);
    this.registerInclusionResolver('toUser', this.toUser.inclusionResolver);
  }
}
