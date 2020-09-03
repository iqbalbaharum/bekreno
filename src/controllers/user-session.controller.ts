import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Session,
} from '../models';
import {UserRepository} from '../repositories';

export class UserSessionController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/sessions', {
    responses: {
      '200': {
        description: 'Array of User has many Session',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Session)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Session>,
  ): Promise<Session[]> {
    return this.userRepository.sessions(id).find(filter);
  }

  @post('/users/{id}/sessions', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Session)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Session, {
            title: 'NewSessionInUser',
            exclude: ['uuid'],
            optional: ['userUuid']
          }),
        },
      },
    }) session: Omit<Session, 'uuid'>,
  ): Promise<Session> {
    return this.userRepository.sessions(id).create(session);
  }

  @patch('/users/{id}/sessions', {
    responses: {
      '200': {
        description: 'User.Session PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Session, {partial: true}),
        },
      },
    })
    session: Partial<Session>,
    @param.query.object('where', getWhereSchemaFor(Session)) where?: Where<Session>,
  ): Promise<Count> {
    return this.userRepository.sessions(id).patch(session, where);
  }

  @del('/users/{id}/sessions', {
    responses: {
      '200': {
        description: 'User.Session DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Session)) where?: Where<Session>,
  ): Promise<Count> {
    return this.userRepository.sessions(id).delete(where);
  }
}
