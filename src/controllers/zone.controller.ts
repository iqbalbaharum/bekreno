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
import {Zone} from '../models';
import {ZoneRepository} from '../repositories';

export class ZoneController {
  constructor(
    @repository(ZoneRepository)
    public zoneRepository : ZoneRepository,
  ) {}

  @post('/zone', {
    responses: {
      '200': {
        description: 'Zone model instance',
        content: {'application/json': {schema: getModelSchemaRef(Zone)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zone, {
            title: 'NewZone',
            exclude: ['uuid'],
          }),
        },
      },
    })
    zone: Omit<Zone, 'uuid'>,
  ): Promise<Zone> {
    return this.zoneRepository.create(zone);
  }

  @get('/zone/count', {
    responses: {
      '200': {
        description: 'Zone model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Zone) where?: Where<Zone>,
  ): Promise<Count> {
    return this.zoneRepository.count(where);
  }

  @get('/zone', {
    responses: {
      '200': {
        description: 'Array of Zone model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Zone, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Zone) filter?: Filter<Zone>,
  ): Promise<Zone[]> {
    return this.zoneRepository.find(filter);
  }

  @patch('/zone', {
    responses: {
      '200': {
        description: 'Zone PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zone, {partial: true}),
        },
      },
    })
    zone: Zone,
    @param.where(Zone) where?: Where<Zone>,
  ): Promise<Count> {
    return this.zoneRepository.updateAll(zone, where);
  }

  @get('/zone/{id}', {
    responses: {
      '200': {
        description: 'Zone model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Zone, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Zone, {exclude: 'where'}) filter?: FilterExcludingWhere<Zone>
  ): Promise<Zone> {
    return this.zoneRepository.findById(id, filter);
  }

  @patch('/zone/{id}', {
    responses: {
      '204': {
        description: 'Zone PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Zone, {partial: true}),
        },
      },
    })
    zone: Zone,
  ): Promise<void> {
    await this.zoneRepository.updateById(id, zone);
  }

  @put('/zone/{id}', {
    responses: {
      '204': {
        description: 'Zone PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() zone: Zone,
  ): Promise<void> {
    await this.zoneRepository.replaceById(id, zone);
  }

  @del('/zone/{id}', {
    responses: {
      '204': {
        description: 'Zone DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.zoneRepository.deleteById(id);
  }
}
