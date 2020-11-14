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
  DevEnvironment,
} from '../models';
import {RepositoryRepository} from '../repositories';

export class RepositoryDevEnvironmentController {
  constructor(
    @repository(RepositoryRepository)
    public repositoryRepository: RepositoryRepository,
  ) { }

  @get('/repositories/{id}/dev-environment', {
    responses: {
      '200': {
        description: 'DevEnvironment belonging to Repository',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DevEnvironment)},
          },
        },
      },
    },
  })
  async getDevEnvironment(
    @param.path.string('id') id: typeof Repository.prototype.id,
  ): Promise<DevEnvironment> {
    return this.repositoryRepository.devEnvironment(id);
  }
}
