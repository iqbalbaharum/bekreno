import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Note, Repository
} from '../models';
import {RepositoryRepository} from '../repositories';

export class RepositoryNoteController {
  constructor(
    @repository(RepositoryRepository) protected repositoryRepository: RepositoryRepository,
  ) { }

  @get('/repositories/{id}/notes', {
    responses: {
      '200': {
        description: 'Array of Repository has many Note through RepositoryNote',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Note)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Note>,
  ): Promise<Note[]> {
    return this.repositoryRepository.notes(id).find(filter);
  }

  @post('/repositories/{id}/notes', {
    responses: {
      '200': {
        description: 'create a Note model instance',
        content: {'application/json': {schema: getModelSchemaRef(Note)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Repository.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {
            title: 'NewNoteInRepository',
            exclude: ['id'],
          }),
        },
      },
    }) note: Omit<Note, 'id'>,
  ): Promise<Note> {
    return this.repositoryRepository.notes(id).create(note);
  }

  @patch('/repositories/{id}/notes', {
    responses: {
      '200': {
        description: 'Repository.Note PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {partial: true}),
        },
      },
    })
    note: Partial<Note>,
    @param.query.object('where', getWhereSchemaFor(Note)) where?: Where<Note>,
  ): Promise<Count> {
    return this.repositoryRepository.notes(id).patch(note, where);
  }

  @del('/repositories/{id}/notes', {
    responses: {
      '200': {
        description: 'Repository.Note DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Note)) where?: Where<Note>,
  ): Promise<Count> {
    return this.repositoryRepository.notes(id).delete(where);
  }
}
