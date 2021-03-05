import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {DtoTopic, Topic, User} from '../models';
import {TagsRepository, TopicRepository} from '../repositories';

export class TopicController {
  constructor(
    @repository(TopicRepository)
    public topicRepository: TopicRepository,
    @repository(TagsRepository)
    public tagsRepository: TagsRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) {}

  @post('/topics', {
    responses: {
      '200': {
        description: 'Topic model instance',
        content: {'application/json': {schema: getModelSchemaRef(Topic)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DtoTopic),
        },
      },
    })
    topic: Omit<DtoTopic, 'id'>,
  ): Promise<Topic> {
    const user = await this.getCurrentUser();

    for (const tagId of topic.tagIds) {
      const tag = await this.tagsRepository.findById(tagId);
      if (!tag) {
        throw new HttpErrors.BadRequest(`Invalid Tag Ids - ${tagId} `);
      }
    }

    const newTopic = await this.topicRepository.create({
      title: topic.title,
      description: topic.description,
      userId: user.user,
    });

    for (const tagId of topic.tagIds) {
      await this.topicRepository.tags(newTopic.id).link(tagId);
    }

    return newTopic;
  }

  @get('/topics/count', {
    responses: {
      '200': {
        description: 'Topic model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Topic) where?: Where<Topic>): Promise<Count> {
    return this.topicRepository.count(where);
  }

  @get('/topics', {
    responses: {
      '200': {
        description: 'Array of Topic model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Topic, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Topic) filter?: Filter<Topic>): Promise<Topic[]> {
    return this.topicRepository.find(filter);
  }

  @patch('/topics', {
    responses: {
      '200': {
        description: 'Topic PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Topic, {partial: true}),
        },
      },
    })
    topic: Topic,
    @param.where(Topic) where?: Where<Topic>,
  ): Promise<Count> {
    return this.topicRepository.updateAll(topic, where);
  }

  @get('/topics/{id}', {
    responses: {
      '200': {
        description: 'Topic model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Topic, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Topic, {exclude: 'where'})
    filter?: FilterExcludingWhere<Topic>,
  ): Promise<Topic> {
    return this.topicRepository.findById(id, filter);
  }

  @patch('/topics/{id}', {
    responses: {
      '204': {
        description: 'Topic PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Topic, {partial: true}),
        },
      },
    })
    topic: Topic,
  ): Promise<void> {
    await this.topicRepository.updateById(id, topic);
  }

  @put('/topics/{id}', {
    responses: {
      '204': {
        description: 'Topic PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() topic: Topic,
  ): Promise<void> {
    await this.topicRepository.replaceById(id, topic);
  }

  @del('/topics/{id}', {
    responses: {
      '204': {
        description: 'Topic DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.topicRepository.deleteById(id);
  }

  @get('/topics/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Topic',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Topic.prototype.id,
  ): Promise<User> {
    return this.topicRepository.user(id);
  }
}
