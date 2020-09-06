import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Session} from '../models';
import {SessionRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class SessionController {
  constructor(
    @repository(SessionRepository)
    public sessionRepository : SessionRepository,
  ) {}

  @post('/session', {
    responses: {
      '200': {
        description: 'Session model instance',
        content: {'application/json': {schema: getModelSchemaRef(Session)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Session, {
            title: 'NewSession',
            exclude: ['uuid'],
          }),
        },
      },
    })
    session: Omit<Session, 'uuid'>,
  ): Promise<Session> {
    return this.sessionRepository.create(session);
  }

  @get('/session/count', {
    responses: {
      '200': {
        description: 'Session model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.where(Session) where?: Where<Session>,
  ): Promise<Count> {
    return this.sessionRepository.count(where);
  }

  @get('/session', {
    responses: {
      '200': {
        description: 'Array of Session model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Session, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Session) filter?: Filter<Session>,
  ): Promise<Session[]> {
    return this.sessionRepository.find(filter);
  }

  @patch('/session', {
    responses: {
      '200': {
        description: 'Session PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Session, {partial: true}),
        },
      },
    })
    session: Session,
    @param.where(Session) where?: Where<Session>,
  ): Promise<Count> {
    return this.sessionRepository.updateAll(session, where);
  }

  @get('/session/{id}', {
    responses: {
      '200': {
        description: 'Session model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Session, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Session, {exclude: 'where'}) filter?: FilterExcludingWhere<Session>
  ): Promise<Session> {
    return this.sessionRepository.findById(id, filter);
  }

  @patch('/session/{id}', {
    responses: {
      '204': {
        description: 'Session PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Session, {partial: true}),
        },
      },
    })
    session: Session,
  ): Promise<void> {
    await this.sessionRepository.updateById(id, session);
  }

  @put('/session/{id}', {
    responses: {
      '204': {
        description: 'Session PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() session: Session,
  ): Promise<void> {
    await this.sessionRepository.replaceById(id, session);
  }

  @del('/session/{id}', {
    responses: {
      '204': {
        description: 'Session DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sessionRepository.deleteById(id);
  }
}
