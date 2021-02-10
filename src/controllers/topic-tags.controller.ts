import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, post} from '@loopback/rest';
import {Tags, Topic} from '../models';
import {TagsRepository, TopicRepository} from '../repositories';

export class TopicTagsController {
  constructor(
    @repository(TopicRepository) protected topicRepository: TopicRepository,
    @repository(TagsRepository) protected tagRepository: TagsRepository,
  ) {}

  @get('/topics/{id}/tags', {
    responses: {
      '200': {
        description: 'Array of Topic has many Tags through TopicTags',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tags)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tags>,
  ): Promise<Tags[]> {
    return this.topicRepository.tags(id).find(filter);
  }

  @post('/topics/{id}/tags/{tid}/tagged', {
    responses: {
      '200': {
        description: 'create a Tags model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tags)}},
      },
    },
  })
  async tagged(
    @param.path.string('id') id: typeof Topic.prototype.id,
    @param.path.string('tid') tid: typeof Tags.prototype.id,
  ): Promise<void> {
    const tag = await this.tagRepository.findById(tid);

    if (!tag) {
      throw new HttpErrors.BadRequest('Invalid tag');
    }

    return this.topicRepository.tags(id).link(tag.id);
  }

  @post('/topics/{id}/tags/{tid}/untagged', {
    responses: {
      '200': {
        description: 'Untag tag from topic',
        content: {'application/json': {schema: getModelSchemaRef(Tags)}},
      },
    },
  })
  async untagged(
    @param.path.string('id') id: typeof Topic.prototype.id,
    @param.path.string('tid') tid: typeof Tags.prototype.id,
  ): Promise<void> {
    const tag = await this.tagRepository.findById(tid);

    if (!tag) {
      throw new HttpErrors.BadRequest('Invalid tag');
    }

    return this.topicRepository.tags(id).unlink(tag.id);
  }
}
