import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Application,
  User
} from '../models';
import {ApplicationRepository} from '../repositories';

export class ApplicationUserController {
  constructor(
    @repository(ApplicationRepository)
    public applicationRepository: ApplicationRepository,
  ) { }

  @get('/applications/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Application',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Application.prototype.id,
  ): Promise<User> {
    return this.applicationRepository.user(id);
  }
}
