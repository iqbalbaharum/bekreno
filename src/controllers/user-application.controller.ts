import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
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
  getModelSchemaRef,
  HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {Application, User, UserApplication} from '../models';
import {UserApplicationRepository, UserRepository} from '../repositories';
import {UserApplicationSchema} from '../schema';

export class UserApplicationController {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(UserApplicationRepository)
    public userApplicationRepository : UserApplicationRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) {}

  @get('/users/{id}/applications', {
    responses: {
      '200': {
        description: 'Array of User has many Application through UserApplication',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Application)},
          },
        },
      },
    },
  })
  async findUserApplication(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Application>,
  ): Promise<UserApplication[]> {
    return this.userApplicationRepository.find({
      where: {
        userId: id
      }
    });
  }

  @get('/users/applications', {
    responses: {
      '200': {
        description: 'Array of User has many Application through UserApplication',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Application)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findCurrentUserApplication(
    @param.query.object('filter') filter?: Filter<Application>,
  ): Promise<UserApplication[]> {

    const userProfile = await this.getCurrentUser();

    return this.userApplicationRepository.find({
      where: {
        userId: userProfile.user
      }
    }, filter);
  }

  @post('/users/applications/apply', {
    responses: {
      '200': {
        description: 'create a Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  @authenticate('jwt')
  async apply(
    @requestBody({
      content: {
        'application/json': {
          schema: UserApplicationSchema
        },
      },
    })
    application: {applicationId: string},
  ): Promise<UserApplication> {

    const userProfile = await this.getCurrentUser();

    const result = await this.userApplicationRepository.find({
      where: {
        userId: userProfile.user,
        applicationId: application.applicationId
      }
    })

    if(result.length > 0) {
      throw new HttpErrors.BadRequest('User have apply for the application')
    }

    await this.userRepository.applications(userProfile.user).link(application.applicationId);
    return this.userApplicationRepository.findById(userProfile.user);
  }

  @post('/users/{id}/applications/unapply', {
    responses: {
      '200': {
        description: 'create a Application model instance',
        content: {'application/json': {schema: getModelSchemaRef(Application)}},
      },
    },
  })
  async unapply(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: UserApplicationSchema
        },
      },
    })
    application: {applicationId: string},
  ): Promise<UserApplication> {
    const result = await this.userApplicationRepository.find({
      where: {
        userId: id,
        applicationId: application.applicationId
      }
    })

    if(result.length <= 0) {
      throw new HttpErrors.BadRequest('User have not applied for this application')
    }

    await this.userRepository.applications(id).unlink(application.applicationId);
    return this.userApplicationRepository.findById(id);
  }

  @get('/user-application/count', {
    responses: {
      '200': {
        description: 'UserApplication model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(UserApplication) where?: Where<UserApplication>,
  ): Promise<Count> {
    return this.userApplicationRepository.count(where);
  }

  @get('/user-application', {
    responses: {
      '200': {
        description: 'Array of UserApplication model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserApplication, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserApplication) filter?: Filter<UserApplication>,
  ): Promise<UserApplication[]> {
    return this.userApplicationRepository.find(filter);
  }

  @patch('/user-application', {
    responses: {
      '200': {
        description: 'UserApplication PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserApplication, {partial: true}),
        },
      },
    })
    userApplication: UserApplication,
    @param.where(UserApplication) where?: Where<UserApplication>,
  ): Promise<Count> {
    return this.userApplicationRepository.updateAll(userApplication, where);
  }

  @get('/user-application/{id}', {
    responses: {
      '200': {
        description: 'UserApplication model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserApplication, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserApplication, {exclude: 'where'}) filter?: FilterExcludingWhere<UserApplication>
  ): Promise<UserApplication> {
    return this.userApplicationRepository.findById(id, filter);
  }

  @patch('/user-application/{id}', {
    responses: {
      '204': {
        description: 'UserApplication PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserApplication, {partial: true}),
        },
      },
    })
    userApplication: UserApplication,
  ): Promise<void> {
    await this.userApplicationRepository.updateById(id, userApplication);
  }

  @put('/user-application/{id}', {
    responses: {
      '204': {
        description: 'UserApplication PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userApplication: UserApplication,
  ): Promise<void> {
    await this.userApplicationRepository.replaceById(id, userApplication);
  }

  @del('/user-application/{id}', {
    responses: {
      '204': {
        description: 'UserApplication DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userApplicationRepository.deleteById(id);
  }
}
