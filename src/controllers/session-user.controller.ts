import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Session,
  User,
} from '../models';
import {SessionRepository} from '../repositories';

export class SessionUserController {
  constructor(
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
  ) { }

  @get('/sessions/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Session',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Session.prototype.uuid,
  ): Promise<User> {
    return this.sessionRepository.user(id);
  }
}
