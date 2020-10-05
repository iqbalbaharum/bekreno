import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {Track, User} from '../models';
import {UserRepository} from '../repositories';
import {UserTrackSchema} from './../schema';

export class UserTrackController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/tracks', {
    responses: {
      '200': {
        description: 'Array of User has many Track through UserTrack',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Track)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Track>,
  ): Promise<Track[]> {
    return this.userRepository.tracks(id).find(filter);
  }

  @post('/users/{id}/tracks/join', {
    responses: {
      '200': {
        description: 'Join Track model instance',
        content: {'application/json': {schema: getModelSchemaRef(Track)}},
      },
    },
  })
  async join(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: UserTrackSchema,
        },
      },
    })
    track: {trackId: string},
  ): Promise<User> {
    await this.userRepository.tracks(id).link(track.trackId);
    return this.userRepository.findById(id);
  }

  @post('/users/{id}/track/quit', {
    responses: {
      '200': {
        description: 'unassign a Track from user',
        content: {'application/json': {schema: getModelSchemaRef(Track)}},
      },
    },
  })
  async quit(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: UserTrackSchema,
        },
      },
    })
    track: {trackId: string},
  ): Promise<User> {
    await this.userRepository.roles(id).unlink(track.trackId);
    return this.userRepository.findById(id);
  }
}
