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
  Position,
} from '../models';
import {RepositoryRepository} from '../repositories';

export class RepositoryPositionController {
  constructor(
    @repository(RepositoryRepository)
    public repositoryRepository: RepositoryRepository,
  ) { }

  @get('/repositories/{id}/position', {
    responses: {
      '200': {
        description: 'Position belonging to Repository',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Position)},
          },
        },
      },
    },
  })
  async getPosition(
    @param.path.string('id') id: typeof Repository.prototype.id,
  ): Promise<Position> {
    return this.repositoryRepository.position(id);
  }
}
