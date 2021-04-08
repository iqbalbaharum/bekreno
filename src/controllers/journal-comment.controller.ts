import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Getter, inject} from '@loopback/context';
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
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {JournalAcl} from '../acl';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {Comment, Journal} from '../models';
import {JournalRepository} from '../repositories';
import {NotificationService, UserChannelService} from '../services';

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
    @inject('services.UserChannelService') userChannelService: UserChannelService,
    @inject('services.NotificationService') notificationService: NotificationService,
    @inject.getter(AuthenticationBindings.CURRENT_USER) getCurrentUser: Getter<MyUserProfile>
  ): Promise<Comment> {
    const journal = await this.journalRepository.findById(id);

    if (!journal) {
      throw new HttpErrors.BadRequest('Invalid journal');
    }

    let token = await getCurrentUser()
    comment.userId = token.user
    const commentCreated = await this.journalRepository
      .comments(id)
      .create(comment);

    if (!commentCreated) {
      throw new HttpErrors.BadRequest('Invalid comment');
    }

    await userChannelService.tagged(commentCreated.userId, [
      `journal.${journal.id}`,
      `journal.${journal.id}.comment`
    ])

    journal.status = 'updated';
    journal.updatedAt = new Date();

    await this.journalRepository.updateById(journal.id, journal);

    notificationService.setNotification(
      'JOURNAL',
      'COMMENT',
      journal.id!,
      token.user,
      token.name!,
      [`journal.${journal.id}`]
    )

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
