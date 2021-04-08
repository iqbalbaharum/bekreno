import {authenticate, AuthenticationBindings} from '@loopback/authentication';
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
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {Note} from '../models';
import {TopicRepository} from '../repositories';
import {NotificationService, UserChannelService} from '../services';
import {NotificationType} from '../types';
export class TopicNoteController {
  constructor(
    @repository(TopicRepository) protected topicRepository: TopicRepository,
    @inject('services.UserChannelService') protected userChannelService: UserChannelService
  ) {}

  @get('/topics/{id}/notes', {
    responses: {
      '200': {
        description: 'Array of Topic has many Note through TopicNotes',
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

    return this.topicRepository.notes(id).find(filter);
  }

  @post('/topics/{id}/notes', {
    responses: {
      '200': {
        description: 'create a Note model instance',
        content: {'application/json': {schema: getModelSchemaRef(Note)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {
            title: 'NewNoteInTopic',
            exclude: ['id'],
          }),
        },
      },
    })
    note: Omit<Note, 'id'>,
    @inject.getter(AuthenticationBindings.CURRENT_USER) getCurrentUser: Getter<MyUserProfile>,
    @inject('services.NotificationService') notificationService: NotificationService,
  ): Promise<Note> {
    const noteCreated = await this.topicRepository.notes(id).create(note);

    await this.userChannelService.tagged(note.fromUserId, [
      `topic.${id}`
    ])

    const token = await getCurrentUser()

    await notificationService.setNotification(
      NotificationType.TOPIC,
      'COMMENT',
      id,
      token.user,
      token.name || '',
      [
        `topic.${id}`,
        `topic.${id}.comment.${noteCreated.id}`
      ]
    )

    return noteCreated
  }

  @patch('/topics/{id}/notes', {
    responses: {
      '200': {
        description: 'Topic.Note PATCH success count',
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
    return this.topicRepository.notes(id).patch(note, where);
  }

  @del('/topics/{id}/notes', {
    responses: {
      '200': {
        description: 'Topic.Note DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Note)) where?: Where<Note>,
  ): Promise<Count> {
    return this.topicRepository.notes(id).delete(where);
  }
}
