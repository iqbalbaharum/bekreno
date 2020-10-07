import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Journal,
  User,
} from '../models';
import {JournalRepository} from '../repositories';

export class JournalUserController {
  constructor(
    @repository(JournalRepository)
    public journalRepository: JournalRepository,
  ) { }

  @get('/journals/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Journal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Journal.prototype.id,
  ): Promise<User> {
    return this.journalRepository.user(id);
  }
}
