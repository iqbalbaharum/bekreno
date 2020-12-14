import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserApplication,
  Application,
} from '../models';
import {UserApplicationRepository} from '../repositories';

export class UserApplicationApplicationController {
  constructor(
    @repository(UserApplicationRepository)
    public userApplicationRepository: UserApplicationRepository,
  ) { }

  @get('/user-applications/{id}/application', {
    responses: {
      '200': {
        description: 'Application belonging to UserApplication',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Application)},
          },
        },
      },
    },
  })
  async getApplication(
    @param.path.string('id') id: typeof UserApplication.prototype.id,
  ): Promise<Application> {
    return this.userApplicationRepository.application(id);
  }
}
