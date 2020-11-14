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
  Project,
  Repository,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectRepositoryController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/repositories', {
    responses: {
      '200': {
        description: 'Array of Project has many Repository',
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
    return this.projectRepository.repositories(id).find(filter);
  }

  @post('/projects/{id}/repositories', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Repository)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Repository, {
            title: 'NewRepositoryInProject',
            exclude: ['id'],
            optional: ['projectId']
          }),
        },
      },
    }) repository: Omit<Repository, 'id'>,
  ): Promise<Repository> {
    return this.projectRepository.repositories(id).create(repository);
  }

  @patch('/projects/{id}/repositories', {
    responses: {
      '200': {
        description: 'Project.Repository PATCH success count',
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
    return this.projectRepository.repositories(id).patch(repository, where);
  }

  @del('/projects/{id}/repositories', {
    responses: {
      '200': {
        description: 'Project.Repository DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Repository)) where?: Where<Repository>,
  ): Promise<Count> {
    return this.projectRepository.repositories(id).delete(where);
  }
}
