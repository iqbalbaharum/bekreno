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
import {DevEnvironment} from '../models';
import {DevEnvironmentRepository} from '../repositories';

export class DevEnvironmentController {
  constructor(
    @repository(DevEnvironmentRepository)
    public devEnvironmentRepository : DevEnvironmentRepository,
  ) {}

  @post('/environment', {
    responses: {
      '200': {
        description: 'DevEnvironment model instance',
        content: {'application/json': {schema: getModelSchemaRef(DevEnvironment)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DevEnvironment, {
            title: 'NewDevEnvironment',
            exclude: ['id'],
          }),
        },
      },
    })
    devEnvironment: Omit<DevEnvironment, 'id'>,
  ): Promise<DevEnvironment> {
    return this.devEnvironmentRepository.create(devEnvironment);
  }

  @get('/environment/count', {
    responses: {
      '200': {
        description: 'DevEnvironment model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(DevEnvironment) where?: Where<DevEnvironment>,
  ): Promise<Count> {
    return this.devEnvironmentRepository.count(where);
  }

  @get('/environment', {
    responses: {
      '200': {
        description: 'Array of DevEnvironment model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DevEnvironment, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(DevEnvironment) filter?: Filter<DevEnvironment>,
  ): Promise<DevEnvironment[]> {
    return this.devEnvironmentRepository.find(filter);
  }

  @patch('/environment', {
    responses: {
      '200': {
        description: 'DevEnvironment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DevEnvironment, {partial: true}),
        },
      },
    })
    devEnvironment: DevEnvironment,
    @param.where(DevEnvironment) where?: Where<DevEnvironment>,
  ): Promise<Count> {
    return this.devEnvironmentRepository.updateAll(devEnvironment, where);
  }

  @get('/environment/{id}', {
    responses: {
      '200': {
        description: 'DevEnvironment model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DevEnvironment, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(DevEnvironment, {exclude: 'where'}) filter?: FilterExcludingWhere<DevEnvironment>
  ): Promise<DevEnvironment> {
    return this.devEnvironmentRepository.findById(id, filter);
  }

  @patch('/environment/{id}', {
    responses: {
      '204': {
        description: 'DevEnvironment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DevEnvironment, {partial: true}),
        },
      },
    })
    devEnvironment: DevEnvironment,
  ): Promise<void> {
    await this.devEnvironmentRepository.updateById(id, devEnvironment);
  }

  @put('/environment/{id}', {
    responses: {
      '204': {
        description: 'DevEnvironment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() devEnvironment: DevEnvironment,
  ): Promise<void> {
    await this.devEnvironmentRepository.replaceById(id, devEnvironment);
  }

  @del('/environment/{id}', {
    responses: {
      '204': {
        description: 'DevEnvironment DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.devEnvironmentRepository.deleteById(id);
  }
}
