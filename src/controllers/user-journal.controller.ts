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
  Journal,
} from '../models';
import {UserRepository} from '../repositories';

export class UserJournalController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/journals', {
    responses: {
      '200': {
        description: 'Array of User has many Journal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Journal)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Journal>,
  ): Promise<Journal[]> {
    return this.userRepository.journals(id).find(filter);
  }

  @post('/users/{id}/journals', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Journal)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Journal, {
            title: 'NewJournalInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) journal: Omit<Journal, 'id'>,
  ): Promise<Journal> {
    return this.userRepository.journals(id).create(journal);
  }

  @patch('/users/{id}/journals', {
    responses: {
      '200': {
        description: 'User.Journal PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Journal, {partial: true}),
        },
      },
    })
    journal: Partial<Journal>,
    @param.query.object('where', getWhereSchemaFor(Journal)) where?: Where<Journal>,
  ): Promise<Count> {
    return this.userRepository.journals(id).patch(journal, where);
  }

  @del('/users/{id}/journals', {
    responses: {
      '200': {
        description: 'User.Journal DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Journal)) where?: Where<Journal>,
  ): Promise<Count> {
    return this.userRepository.journals(id).delete(where);
  }
}
