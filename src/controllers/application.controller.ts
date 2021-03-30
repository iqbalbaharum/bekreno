import {inject} from '@loopback/core';
import {
  Count, CountSchema,
  Filter,
  FilterExcludingWhere,
  repository, Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {Application} from '../models';
import {ApplicationRepository, RoleRepository, UserApplicationRepository, UserRepository} from '../repositories';
import {ApplicationCloseSchema} from '../schema';
import {EmailService, NotificationService} from '../services';
import {ApplicationClose} from '../types';

export class ApplicationController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository : ApplicationRepository,
    @repository(UserApplicationRepository)
    public userApplicationRepository : UserApplicationRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(RoleRepository)
    public roleRepository : RoleRepository,
    @inject('services.EmailService') protected emailService: EmailService,
    @inject('services.NotificationService') protected notificationService: NotificationService
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
    application.status = 'draft'
    return this.applicationRepository.create(application);
  }

  @post('/application/{id}/activate', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async activatedApplication(
    @param.path.string('id') id: string,
  ): Promise<Application> {

    const filter = {
      where: {
        and: [
          {applicationId: id },
          {status: 'draft'}
        ]
      }
    }

    const application = await this.applicationRepository.findOne(filter)

    if(!application) {
      throw new HttpErrors.UnprocessableEntity('Invalid application record to be activate')
    }

    application.status = 'active'

    await this.applicationRepository.updateById(
      application.id,
      application
    )

    return application
  }

  @post('/application/{id}/deactivated', {
    responses: {
      '200': {
        description: 'Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async deactivateApplication(
    @param.path.string('id') id: string,
  ): Promise<Application> {

    const filter = {
      where: {
        and: [
          {applicationId: id },
          {status: 'active'}
        ]
      }
    }

    const application = await this.applicationRepository.findOne(filter)

    if(!application) {
      throw new HttpErrors.UnprocessableEntity('Invalid application record to be deactivate')
    }

    application.status = 'deactivated'

    await this.applicationRepository.updateById(
      application.id,
      application
    )

    return application
  }

  @post('/application/close', {
    responses: {
      '200': {
        description: 'Close application and send out details for succesful applicants',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async closeApplication(
    @requestBody({
      content: {
        'application/json': {
          schema: ApplicationCloseSchema,
        }
      }
    })
    applicationClose: ApplicationClose,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(applicationClose.applicationId)

    if(!application) {
      throw new HttpErrors.UnprocessableEntity('Invalid application record')
    }

    const acceptedUserApplications = []

    const allUserApplications = await this.userApplicationRepository.find({
      where: {
        applicationId: applicationClose.applicationId
      }
    })

    // look for cohort id
    const cohortRole = await this.roleRepository.findOne({
      where: {
        name: 'cohort'
      }
    })

    if(!cohortRole) {
      throw new HttpErrors.BadRequest(
        'Invalid role data. Please reseed role with default value',
      );
    }

    for(const userAppId of applicationClose.acceptedUserApplicationIds) {

      const userApp = await this.userApplicationRepository.findById(userAppId, {
        include: [
          { relation: "user" },
        ]
      })

      if(userApp) {

        if(userApp.user) {
          await this.userRepository.roles(userApp.user!.uuid).link(cohortRole.uuid)
        }

        userApp.status = 'accepted'
        acceptedUserApplications.push(userApp)

        delete userApp.user
        await this.userApplicationRepository.updateById(userApp.id, userApp)

        const index = allUserApplications.findIndex(item => item.id === userApp.id)
        allUserApplications.splice(index, 1)
      }
    }

    for(const userApplication of allUserApplications) {
      if(userApplication.status === 'submitted') {
        userApplication.status = 'rejected'
        await this.userApplicationRepository.updateById(userApplication.id, userApplication)
      }
    }

    application.status = 'closed'

    await this.applicationRepository.updateById(
      applicationClose.applicationId,
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
