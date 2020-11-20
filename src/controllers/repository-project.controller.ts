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
  Project,
} from '../models';
import {RepositoryRepository} from '../repositories';

export class RepositoryProjectController {
  constructor(
    @repository(RepositoryRepository)
    public repositoryRepository: RepositoryRepository,
  ) { }

  @get('/repositories/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to Repository',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof Repository.prototype.id,
  ): Promise<Project> {
    return this.repositoryRepository.project(id);
  }
}
