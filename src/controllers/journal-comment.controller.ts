import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {JournalAcl} from '../acl';
import {Comment, Journal} from '../models';
import {JournalRepository} from '../repositories';

@authenticate('jwt')
export class JournalCommentController {
  constructor(
    @repository(JournalRepository)
    protected journalRepository: JournalRepository,
  ) {}

  @get('/journal/{id}/comments', {
    responses: {
      '200': {
        description: 'Array of Journal has many Comment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Comment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.journalRepository.comments(id).find(filter);
  }

  @post('/journal/{id}/comments', {
    responses: {
      '200': {
        description: 'Journal model instance',
        content: {'application/json': {schema: getModelSchemaRef(Comment)}},
      },
    },
  })
  @authorize(JournalAcl['add-comment'])
  async create(
    @param.path.string('id') id: typeof Journal.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewCommentInJournal',
            exclude: ['id'],
            optional: ['journalId'],
          }),
        },
      },
    })
    comment: Omit<Comment, 'id'>,
  ): Promise<Comment> {
    const journal = await this.journalRepository.findById(id);

    if (!journal) {
      throw new HttpErrors.BadRequest('Invalid journal');
    }

    const commentCreated = await this.journalRepository
      .comments(id)
      .create(comment);

    if (!commentCreated) {
      throw new HttpErrors.BadRequest('Invalid comment');
    }

    journal.status = 'updated';
    journal.updatedAt = new Date();

    await this.journalRepository.updateById(journal.id, journal);

    return commentCreated;
  }

  @patch('/journal/{id}/comments', {
    responses: {
      '200': {
        description: 'Journal.Comment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {partial: true}),
        },
      },
    })
    comment: Partial<Comment>,
    @param.query.object('where', getWhereSchemaFor(Comment))
    where?: Where<Comment>,
  ): Promise<Count> {
    return this.journalRepository.comments(id).patch(comment, where);
  }

  @del('/journal/{id}/comments', {
    responses: {
      '200': {
        description: 'Journal.Comment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Comment))
    where?: Where<Comment>,
  ): Promise<Count> {
    return this.journalRepository.comments(id).delete(where);
  }
}
