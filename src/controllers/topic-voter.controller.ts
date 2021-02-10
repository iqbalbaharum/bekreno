import {Count, repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, param, post} from '@loopback/rest';
import {Topic, User} from '../models';
import {TopicRepository, UserRepository} from '../repositories';

export class TopicUserController {
  constructor(
    @repository(TopicRepository) protected topicRepository: TopicRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/topics/{id}/voters/count', {
    responses: {
      '200': {
        description: 'Return total count',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(@param.path.string('id') id: string): Promise<Count> {
    return this.topicRepository.count({
      id: id,
    });
  }

  @post('/topics/{id}/voters/{uid}/vote', {
    responses: {
      '200': {
        description: 'User vote on a topic',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async vote(
    @param.path.string('id') id: typeof Topic.prototype.id,
    @param.path.string('uid') uid: typeof User.prototype.uuid,
  ): Promise<void> {
    const user = await this.userRepository.findById(uid);

    if (!user) {
      throw new HttpErrors.BadRequest('Invalid user');
    }

    return this.topicRepository.voters(id).link(user.uuid);
  }

  @post('/topics/{id}/voters/{uid}/unvote', {
    responses: {
      '200': {
        description: 'User unvote on a topic',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async unvote(
    @param.path.string('id') id: typeof Topic.prototype.id,
    @param.path.string('uid') uid: typeof User.prototype.uuid,
  ): Promise<void> {
    const user = await this.userRepository.findById(uid);

    if (!user) {
      throw new HttpErrors.BadRequest('Invalid user');
    }

    return this.topicRepository.voters(id).unlink(user.uuid);
  }
}
