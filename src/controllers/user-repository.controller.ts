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
  User,
  Repository,
} from '../models';
import {UserRepository} from '../repositories';

export class UserRepositoryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/repositories', {
    responses: {
      '200': {
        description: 'Array of User has many Repository',
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
    return this.userRepository.repositories(id).find(filter);
  }

  @post('/users/{id}/repositories', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Repository)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {
            title: 'NewRepositoryInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) repository: Omit<Repository, 'id'>,
  ): Promise<Repository> {
    return this.userRepository.repositories(id).create(repository);
  }

  @patch('/users/{id}/repositories', {
    responses: {
      '200': {
        description: 'User.Repository PATCH success count',
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
    return this.userRepository.repositories(id).patch(repository, where);
  }

  @del('/users/{id}/repositories', {
    responses: {
      '200': {
        description: 'User.Repository DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Repository)) where?: Where<Repository>,
  ): Promise<Count> {
    return this.userRepository.repositories(id).delete(where);
  }
}
