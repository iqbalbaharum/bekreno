import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {Application} from '../models';
import {ApplicationRepository} from '../repositories';
import {ApplicationStatusSchema} from '../schema';
import {ApplicationStatus} from '../types';

export class ApplicationController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository : ApplicationRepository
  ) {}

  @post('/application', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {
            title: 'NewApplication',
            exclude: ['id'],
          }),
        },
      },
    })
    application: Omit<Application, 'id'>,
  ): Promise<Application> {
    return this.applicationRepository.create(application);
  }

  @post('/application/status', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async changeApplicationStatus(
    @requestBody({
      content: {
        'application/json': {
          schema: ApplicationStatusSchema,
        }
      }
    })
    applicationStatus: ApplicationStatus,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(applicationStatus.applicationId)

    if(!application) {
      throw new HttpErrors.UnprocessableEntity('Invalid application record')
    }

    application.status = applicationStatus.status

    await this.applicationRepository.updateById(
      applicationStatus.applicationId,
      application
    )

    return application
  }

  @get('/application/count', {
    responses: {
      '200': {
        description: 'Application model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Application) where?: Where<Application>,
  ): Promise<Count> {
    return this.applicationRepository.count(where);
  }

  @get('/application', {
    responses: {
      '200': {
        description: 'Array of Application model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Application, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Application) filter?: Filter<Application>,
  ): Promise<Application[]> {
    return this.applicationRepository.find(filter);
  }

  @patch('/application', {
    responses: {
      '200': {
        description: 'Application PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {partial: true}),
        },
      },
    })
    application: Application,
    @param.where(Application) where?: Where<Application>,
  ): Promise<Count> {
    return this.applicationRepository.updateAll(application, where);
  }

  @get('/application/{id}', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Application, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Application, {exclude: 'where'}) filter?: FilterExcludingWhere<Application>
  ): Promise<Application> {
    return this.applicationRepository.findById(id, filter);
  }

  @patch('/application/{id}', {
    responses: {
      '204': {
        description: 'Application PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Application, {partial: true}),
        },
      },
    })
    application: Application,
  ): Promise<void> {
    await this.applicationRepository.updateById(id, application);
  }

  @put('/application/{id}', {
    responses: {
      '204': {
        description: 'Application PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() application: Application,
  ): Promise<void> {
    await this.applicationRepository.replaceById(id, application);
  }

  @del('/application/{id}', {
    responses: {
      '204': {
        description: 'Application DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.applicationRepository.deleteById(id);
  }
}
