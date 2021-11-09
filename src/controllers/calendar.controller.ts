import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Getter,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param,


  patch, post,






  requestBody
} from '@loopback/rest';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {Calendar} from '../models';
import {CalendarRepository} from '../repositories';
import {CalendarStatusSchema} from '../schema';
import {CalendarStatusType} from '../types';

export class CalendarController {
  constructor(
    @repository(CalendarRepository)
    public calendarRepository : CalendarRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER) public getCurrentUser: Getter<MyUserProfile>
  ) {}

  @post('/calendars', {
    responses: {
      '200': {
        description: 'Calendar model instance',
        content: {'application/json': {schema: getModelSchemaRef(Calendar)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Calendar, {
            title: 'NewCalendar',
            exclude: ['id'],
          }),
        },
      },
    })
    calendar: Omit<Calendar, 'id'>,
  ): Promise<Calendar> {

    const token = await this.getCurrentUser()

    calendar.userId = token.user

    return this.calendarRepository.create(calendar);
  }

  @post('/calendars/{id}/approval/', {
    responses: {
      '200': {
        description: 'Change calendar status',
        content: {'application/json': {schema: getModelSchemaRef(Calendar)}},
      },
    },
  })
  @authenticate('jwt')
  async changeCalendarStatus(
    @requestBody({
      content: {
        'application/json': {
          schema: CalendarStatusSchema,
        },
      },
    })
    request: CalendarStatusType,
    @param.path.string('id') id: string,
  ): Promise<Calendar> {

    const calendar = await this.calendarRepository.findById(id)

    if(!calendar) {
      throw new HttpErrors.BadRequest('Invalid calendar record')
    }

    const token = await this.getCurrentUser()

    if(!((calendar.type === 'onetoone' && calendar.requestApprovalUserId === token.user) ||
      token.roles.includes('admin') || token.roles.includes('master'))){
      throw new HttpErrors.BadRequest('Invalid role to approve')
    }

    if(request.status !== 'approved' && request.status !== 'rejected') {
      throw new HttpErrors.BadRequest('Invalid request')
    }

    calendar.status = request.status
    calendar.updatedAt = new Date()

    await this.calendarRepository.updateById(id, calendar)

    return calendar;
  }

  @get('/calendars/count', {
    responses: {
      '200': {
        description: 'Calendar model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Calendar) where?: Where<Calendar>,
  ): Promise<Count> {
    return this.calendarRepository.count(where);
  }

  @get('/calendars', {
    responses: {
      '200': {
        description: 'Array of Calendar model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Calendar, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Calendar) filter?: Filter<Calendar>,
  ): Promise<Calendar[]> {
    return this.calendarRepository.find(filter);
  }

  @get('/calendars/{id}', {
    responses: {
      '200': {
        description: 'Calendar model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Calendar, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Calendar, {exclude: 'where'}) filter?: FilterExcludingWhere<Calendar>
  ): Promise<Calendar> {
    return this.calendarRepository.findById(id, filter);
  }

  @patch('/calendars/{id}', {
    responses: {
      '204': {
        description: 'Calendar PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Calendar, {partial: true}),
        },
      },
    })
    calendar: Calendar,
  ): Promise<void> {
    await this.calendarRepository.updateById(id, calendar);
  }

  @del('/calendars/{id}', {
    responses: {
      '204': {
        description: 'Calendar DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.calendarRepository.deleteById(id);
  }
}
