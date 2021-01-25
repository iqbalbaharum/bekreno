import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Repository,

  Tags
} from '../models';
import {RepositoryRepository, TagsRepository} from '../repositories';
import {TagSchema} from '../schema';

export class RepositoryTagsController {
  constructor(
    @repository(RepositoryRepository) protected repositoryRepository: RepositoryRepository,
    @repository(TagsRepository) protected tagsRepository: TagsRepository,
  ) { }

  @get('/repositories/{id}/tags', {
    responses: {
      '200': {
        description: 'Array of Repository has many Tags through Taging',
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
    return this.repositoryRepository.tags(id).find(filter);
  }

  @post('/repositories/{id}/tags', {
    responses: {
      '200': {
        description: 'create a Tags model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tags)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Repository.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: TagSchema,
        },
      },
    }) parameter: {tagsId: string},
  ): Promise<void> {

    const tag = await this.tagsRepository.findById(parameter.tagsId)

    if(!tag) {
      throw new HttpErrors.UnprocessableEntity('Invalid tags id')
    }

    return  this.repositoryRepository.tags(id).link(tag.id)
  }

  @patch('/repositories/{id}/tags', {
    responses: {
      '200': {
        description: 'Repository.Tags PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tags, {partial: true}),
        },
      },
    })
    tags: Partial<Tags>,
    @param.query.object('where', getWhereSchemaFor(Tags)) where?: Where<Tags>,
  ): Promise<Count> {
    return this.repositoryRepository.tags(id).patch(tags, where);
  }

  @del('/repositories/{id}/tags', {
    responses: {
      '200': {
        description: 'Repository.Tags DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tags)) where?: Where<Tags>,
  ): Promise<Count> {
    return this.repositoryRepository.tags(id).delete(where);
  }
}
