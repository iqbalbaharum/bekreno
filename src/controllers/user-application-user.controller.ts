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
  User,
} from '../models';
import {UserApplicationRepository} from '../repositories';

export class UserApplicationUserController {
  constructor(
    @repository(UserApplicationRepository)
    public userApplicationRepository: UserApplicationRepository,
  ) { }

  @get('/user-applications/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserApplication',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof UserApplication.prototype.id,
  ): Promise<User> {
    return this.userApplicationRepository.user(id);
  }
}
