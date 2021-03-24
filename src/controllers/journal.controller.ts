import {
  authenticate,
  AuthenticationBindings
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Getter, inject} from '@loopback/core';
import {
  Count,
  CountSchema,

  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JournalAcl} from '../acl';
import {Journal} from '../models';
import {JournalRepository} from '../repositories';

export class JournalController {
  constructor(
    @repository(JournalRepository)
    public journalRepository : JournalRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<UserProfile>,
  ) {}

  @post('/journal', {
    responses: {
      '200': {
        description: 'Journal model instance',
        content: {'application/json': {schema: getModelSchemaRef(Journal)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize(JournalAcl['create-journal'])
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Journal, {
            title: 'NewJournal',
            exclude: ['id'],
          }),
        },
      },
    })
    journal: Omit<Journal, 'id'>,
  ): Promise<Journal> {
    const currentUser = await this.getCurrentUser()

    journal.userId = currentUser.user
    journal.status = 'new'
    return this.journalRepository.create(journal);
  }

  @get('/journal/count', {
    responses: {
      '200': {
        description: 'Journal model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Journal) where?: Where<Journal>,
  ): Promise<Count> {
    return this.journalRepository.count(where);
  }

  @get('/journal', {
    responses: {
      '200': {
        description: 'Array of Journal model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Journal, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findUnreviewedJournal(): Promise<Journal[]> {
    return this.journalRepository.findUnreviewedJournal();
  }

  @get('/journal/all', {
    responses: {
      '200': {
        description: 'Array of Journal model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Journal, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(): Promise<Journal[]> {
    return this.journalRepository.find();
  }

  @get('/journal/{id}', {
    responses: {
      '200': {
        description: 'Journal model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Journal, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Journal, {exclude: 'where'}) filter?: FilterExcludingWhere<Journal>
  ): Promise<Journal> {
    return this.journalRepository.findById(id, filter);
  }

  @patch('/journal/{id}', {
    responses: {
      '204': {
        description: 'Journal PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize(JournalAcl['update-journal'])
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Journal, {partial: true}),
        },
      },
    })
    journal: Journal,
  ): Promise<void> {
    journal.status = 'updated';
    await this.journalRepository.updateById(id, journal);
  }

  @put('/journal/{id}', {
    responses: {
      '204': {
        description: 'Journal PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() journal: Journal,
  ): Promise<void> {
    await this.journalRepository.replaceById(id, journal);
  }

  @del('/journal/{id}', {
    responses: {
      '204': {
        description: 'Journal DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.journalRepository.deleteById(id);
  }

  @post('/journal/{id}/reviewed', {
    responses: {
      '200': {
        description: 'update journal status',
        content: {'application/json': {schema: getModelSchemaRef(Journal)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize(JournalAcl['change-status'])
  async journalReviewed(
    @param.path.string('id') id: string
  ): Promise<void> {

    const journal = await this.journalRepository.findById(id)

    if(!journal) {
      throw new HttpErrors.BadRequest('Journal doesnt exists')
    }

    journal.status = 'review'
    journal.updatedAt = new Date()
    await this.journalRepository.updateById(id, journal);
  }

  @post('/journal/{id}/discuss', {
    responses: {
      '200': {
        description: 'update journal status',
        content: {'application/json': {schema: getModelSchemaRef(Journal)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize(JournalAcl['change-status'])
  async journalNeedDiscussion(
    @param.path.string('id') id: string
  ): Promise<void> {

    const journal = await this.journalRepository.findById(id)

    if(!journal) {
      throw new HttpErrors.BadRequest('Journal doesnt exists')
    }

    journal.status = 'discuss'

    await this.journalRepository.updateById(id, journal);
  }
}
