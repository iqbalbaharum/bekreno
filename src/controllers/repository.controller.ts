import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Repository} from '../models';
import {RepositoryRepository} from '../repositories';

export class RepositoryController {
  constructor(
    @repository(RepositoryRepository)
    public repositoryRepository : RepositoryRepository,
  ) {}

  @post('/repository', {
    responses: {
      '200': {
        description: 'Repository model instance',
        content: {'application/json': {schema: getModelSchemaRef(Repository)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {
            title: 'NewRepository',
            exclude: ['id'],
          }),
        },
      },
    })
    repository: Omit<Repository, 'id'>,
  ): Promise<Repository> {
    return this.repositoryRepository.create(repository);
  }

  @get('/repository/count', {
    responses: {
      '200': {
        description: 'Repository model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Repository) where?: Where<Repository>,
  ): Promise<Count> {
    return this.repositoryRepository.count(where);
  }

  @get('/repository', {
    responses: {
      '200': {
        description: 'Array of Repository model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Repository, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Repository) filter?: Filter<Repository>,
  ): Promise<Repository[]> {
    return this.repositoryRepository.find(filter);
  }

  @patch('/repository', {
    responses: {
      '200': {
        description: 'Repository PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {partial: true}),
        },
      },
    })
    repository: Repository,
    @param.where(Repository) where?: Where<Repository>,
  ): Promise<Count> {
    return this.repositoryRepository.updateAll(repository, where);
  }

  @get('/repository/{id}', {
    responses: {
      '200': {
        description: 'Repository model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Repository, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Repository, {exclude: 'where'}) filter?: FilterExcludingWhere<Repository>
  ): Promise<Repository> {
    return this.repositoryRepository.findById(id, filter);
  }

  @patch('/repository/{id}', {
    responses: {
      '204': {
        description: 'Repository PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {partial: true}),
        },
      },
    })
    repository: Repository,
  ): Promise<void> {
    await this.repositoryRepository.updateById(id, repository);
  }

  @put('/repository/{id}', {
    responses: {
      '204': {
        description: 'Repository PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() repository: Repository,
  ): Promise<void> {
    await this.repositoryRepository.replaceById(id, repository);
  }

  @del('/repository/{id}', {
    responses: {
      '204': {
        description: 'Repository DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.repositoryRepository.deleteById(id);
  }
}
