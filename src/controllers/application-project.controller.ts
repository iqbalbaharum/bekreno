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
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Application,

  Project
} from '../models';
import {ApplicationRepository} from '../repositories';
import {ApplicationProjectSchema} from '../schema';

export class ApplicationProjectController {
  constructor(
    @repository(ApplicationRepository) protected applicationRepository: ApplicationRepository,
  ) { }

  @get('/applications/{id}/projects', {
    responses: {
      '200': {
        description: 'Array of Application has many Project through ApplicationProject',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.applicationRepository.projects(id).find(filter);
  }

  @post('/applications/{id}/projects', {
    responses: {
      '200': {
        description: 'create a Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Application.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProjectInApplication',
            exclude: ['id'],
          }),
        },
      },
    }) project: Omit<Project, 'id'>,
  ): Promise<Project> {
    return this.applicationRepository.projects(id).create(project);
  }

  @post('/applications/{id}/link/projects', {
    responses: {
      '200': {
        description: 'create a Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async linkProject(
    @param.path.string('id') id: typeof Application.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: ApplicationProjectSchema
        },
      },
    }) project: {projectId : string},
  ): Promise<void> {
    return this.applicationRepository.projects(id).link(project.projectId);
  }

  @post('/applications/{id}/unlink/projects', {
    responses: {
      '200': {
        description: 'create a Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Project)}},
      },
    },
  })
  async unlinkProject(
    @param.path.string('id') id: typeof Application.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: ApplicationProjectSchema
        },
      },
    }) project: {projectId : string},
  ): Promise<void> {
    return this.applicationRepository.projects(id).unlink(project.projectId);
  }

  @patch('/applications/{id}/projects', {
    responses: {
      '200': {
        description: 'Application.Project PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Partial<Project>,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where<Project>,
  ): Promise<Count> {
    return this.applicationRepository.projects(id).patch(project, where);
  }

  @del('/applications/{id}/projects', {
    responses: {
      '200': {
        description: 'Application.Project DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where<Project>,
  ): Promise<Count> {
    return this.applicationRepository.projects(id).delete(where);
  }
}
