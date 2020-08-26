import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {Role} from '../models';
import {RoleRepository} from '../repositories';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository : RoleRepository,
  ) {}

  @post('/role', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRole',
            exclude: ['uuid', 'createdAt', 'updatedAt', 'deletedAt'],
          }),
        },
      },
    })
    role: Omit<Role, 'uuid'>,
  ): Promise<Role> {
    return this.roleRepository.create(role);
  }

  @get('/role/count', {
    responses: {
      '200': {
        description: 'Role model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.count(where);
  }

  @get('/role', {
    responses: {
      '200': {
        description: 'Array of Role model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Role, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.roleRepository.find(filter);
  }

  @patch('/role', {
    responses: {
      '200': {
        description: 'Role PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.updateAll(role, where);
  }

  @get('/role/{id}', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Role, {exclude: 'where'}) filter?: FilterExcludingWhere<Role>
  ): Promise<Role> {
    return this.roleRepository.findById(id, filter);
  }

  @patch('/role/{id}', {
    responses: {
      '204': {
        description: 'Role PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    await this.roleRepository.updateById(id, role);
  }

  @put('/role/{id}', {
    responses: {
      '204': {
        description: 'Role PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() role: Role,
  ): Promise<void> {
    await this.roleRepository.replaceById(id, role);
  }

  @del('/role/{id}', {
    responses: {
      '204': {
        description: 'Role DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.roleRepository.deleteById(id);
  }
}
