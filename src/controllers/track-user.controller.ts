import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {User} from '../models';
import {TrackRepository} from '../repositories';

export class TrackUserController {
  constructor(
    @repository(TrackRepository) protected trackRepository: TrackRepository,
  ) {}

  @get('/tracks/{id}/users', {
    responses: {
      '200': {
        description: 'Array of Track has many User through UserTrack',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    return this.trackRepository.users(id).find(filter);
  }
}
