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
import {Position} from '../models';
import {PositionRepository} from '../repositories';

export class PositionController {
  constructor(
    @repository(PositionRepository)
    public positionRepository : PositionRepository,
  ) {}

  @post('/position', {
    responses: {
      '200': {
        description: 'Position model instance',
        content: {'application/json': {schema: getModelSchemaRef(Position)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Position, {
            title: 'NewPosition',
            exclude: ['id'],
          }),
        },
      },
    })
    position: Omit<Position, 'id'>,
  ): Promise<Position> {
    return this.positionRepository.create(position);
  }

  @get('/position/count', {
    responses: {
      '200': {
        description: 'Position model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Position) where?: Where<Position>,
  ): Promise<Count> {
    return this.positionRepository.count(where);
  }

  @get('/position', {
    responses: {
      '200': {
        description: 'Array of Position model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Position, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Position) filter?: Filter<Position>,
  ): Promise<Position[]> {
    return this.positionRepository.find(filter);
  }

  @patch('/position', {
    responses: {
      '200': {
        description: 'Position PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Position, {partial: true}),
        },
      },
    })
    position: Position,
    @param.where(Position) where?: Where<Position>,
  ): Promise<Count> {
    return this.positionRepository.updateAll(position, where);
  }

  @get('/position/{id}', {
    responses: {
      '200': {
        description: 'Position model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Position, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Position, {exclude: 'where'}) filter?: FilterExcludingWhere<Position>
  ): Promise<Position> {
    return this.positionRepository.findById(id, filter);
  }

  @patch('/position/{id}', {
    responses: {
      '204': {
        description: 'Position PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Position, {partial: true}),
        },
      },
    })
    position: Position,
  ): Promise<void> {
    await this.positionRepository.updateById(id, position);
  }

  @put('/position/{id}', {
    responses: {
      '204': {
        description: 'Position PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() position: Position,
  ): Promise<void> {
    await this.positionRepository.replaceById(id, position);
  }

  @del('/position/{id}', {
    responses: {
      '204': {
        description: 'Position DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.positionRepository.deleteById(id);
  }
}
