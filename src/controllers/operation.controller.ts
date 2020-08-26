import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {Operation} from '../models';
import {OperationRepository} from '../repositories';

export class OperationController {
  constructor(
    @repository(OperationRepository)
    public operationRepository: OperationRepository,
  ) {}

  @post('/operation', {
    responses: {
      '200': {
        description: 'Operation model instance',
        content: {'application/json': {schema: getModelSchemaRef(Operation)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operation, {
            title: 'NewOperation',
            exclude: ['uuid', 'createdAt', 'updatedAt', 'deletedAt'],
          }),
        },
      },
    })
    operation: Omit<Operation, 'uuid'>,
  ): Promise<Operation> {
    return this.operationRepository.create(operation);
  }

  @get('/operation/count', {
    responses: {
      '200': {
        description: 'Operation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Operation) where?: Where<Operation>,
  ): Promise<Count> {
    return this.operationRepository.count(where);
  }

  @get('/operation', {
    responses: {
      '200': {
        description: 'Array of Operation model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Operation, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Operation) filter?: Filter<Operation>,
  ): Promise<Operation[]> {
    return this.operationRepository.find(filter);
  }

  @patch('/operation', {
    responses: {
      '200': {
        description: 'Operation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operation, {partial: true}),
        },
      },
    })
    operation: Operation,
    @param.where(Operation) where?: Where<Operation>,
  ): Promise<Count> {
    return this.operationRepository.updateAll(operation, where);
  }

  @get('/operation/{id}', {
    responses: {
      '200': {
        description: 'Operation model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Operation, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Operation, {exclude: 'where'})
    filter?: FilterExcludingWhere<Operation>,
  ): Promise<Operation> {
    return this.operationRepository.findById(id, filter);
  }

  @patch('/operation/{id}', {
    responses: {
      '204': {
        description: 'Operation PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operation, {partial: true}),
        },
      },
    })
    operation: Operation,
  ): Promise<void> {
    await this.operationRepository.updateById(id, operation);
  }

  @put('/operation/{id}', {
    responses: {
      '204': {
        description: 'Operation PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() operation: Operation,
  ): Promise<void> {
    await this.operationRepository.replaceById(id, operation);
  }

  @del('/operation/{id}', {
    responses: {
      '204': {
        description: 'Operation DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.operationRepository.deleteById(id);
  }
}
