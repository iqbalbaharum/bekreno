import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Repository,
  User,
} from '../models';
import {RepositoryRepository} from '../repositories';

export class RepositoryUserController {
  constructor(
    @repository(RepositoryRepository)
    public repositoryRepository: RepositoryRepository,
  ) { }

  @get('/repositories/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Repository',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Repository.prototype.id,
  ): Promise<User> {
    return this.repositoryRepository.user(id);
  }
}
