import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Tags, TagsRelations} from '../models';

export class TagsRepository extends DefaultCrudRepository<
  Tags,
  typeof Tags.prototype.id,
  TagsRelations
> {
  public readonly parentTags: BelongsToAccessor<Tags, typeof Tags.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('TagsRepository')
    protected tagsRepositoryGetter: Getter<TagsRepository>,
  ) {
    super(Tags, dataSource);
    this.parentTags = this.createBelongsToAccessorFor(
      'parentTags',
      tagsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'parentTags',
      this.parentTags.inclusionResolver,
    );
  }
}
