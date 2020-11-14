import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  DevEnvironment,
  Repository,
} from '../models';
import {DevEnvironmentRepository} from '../repositories';

export class DevEnvironmentRepositoryController {
  constructor(
    @repository(DevEnvironmentRepository) protected devEnvironmentRepository: DevEnvironmentRepository,
  ) { }

  @get('/dev-environments/{id}/repositories', {
    responses: {
      '200': {
        description: 'Array of DevEnvironment has many Repository',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Repository)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Repository>,
  ): Promise<Repository[]> {
    return this.devEnvironmentRepository.repositories(id).find(filter);
  }

  @post('/dev-environments/{id}/repositories', {
    responses: {
      '200': {
        description: 'DevEnvironment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Repository)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DevEnvironment.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {
            title: 'NewRepositoryInDevEnvironment',
            exclude: ['id'],
            optional: ['devEnvironmentId']
          }),
        },
      },
    }) repository: Omit<Repository, 'id'>,
  ): Promise<Repository> {
    return this.devEnvironmentRepository.repositories(id).create(repository);
  }

  @patch('/dev-environments/{id}/repositories', {
    responses: {
      '200': {
        description: 'DevEnvironment.Repository PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {partial: true}),
        },
      },
    })
    repository: Partial<Repository>,
    @param.query.object('where', getWhereSchemaFor(Repository)) where?: Where<Repository>,
  ): Promise<Count> {
    return this.devEnvironmentRepository.repositories(id).patch(repository, where);
  }

  @del('/dev-environments/{id}/repositories', {
    responses: {
      '200': {
        description: 'DevEnvironment.Repository DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Repository)) where?: Where<Repository>,
  ): Promise<Count> {
    return this.devEnvironmentRepository.repositories(id).delete(where);
  }
}
