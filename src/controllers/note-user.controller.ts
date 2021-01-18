import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Note,
  User,
} from '../models';
import {NoteRepository} from '../repositories';

export class NoteUserController {
  constructor(
    @repository(NoteRepository)
    public noteRepository: NoteRepository,
  ) { }

  @get('/notes/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Note',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Note.prototype.id,
  ): Promise<User> {
    return this.noteRepository.fromUser(id);
  }
}
