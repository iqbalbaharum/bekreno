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
import {Permission} from '../models';
import {PermissionRepository, RoleRepository} from '../repositories';
import {
  ModulePermissionSchema,
  OperationPermissionSchema,
  RolePermissionSchema,
} from '../schema';

export class PermissionController {
  constructor(
    @repository(PermissionRepository)
    public permissionRepository: PermissionRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {}

  @post('/permission', {
    responses: {
      '200': {
        description: 'Permission model instance',
        content: {'application/json': {schema: getModelSchemaRef(Permission)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permission, {
            title: 'NewPermission',
            exclude: ['uuid', 'createdAt', 'updatedAt', 'deletedAt'],
          }),
        },
      },
    })
    permission: Omit<Permission, 'uuid'>,
  ): Promise<Permission> {
    return this.permissionRepository.create(permission);
  }

  @get('/permission/count', {
    responses: {
      '200': {
        description: 'Permission model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Permission) where?: Where<Permission>,
  ): Promise<Count> {
    return this.permissionRepository.count(where);
  }

  @get('/permission', {
    responses: {
      '200': {
        description: 'Array of Permission model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Permission, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Permission) filter?: Filter<Permission>,
  ): Promise<Permission[]> {
    return this.permissionRepository.find(filter);
  }

  @patch('/permission', {
    responses: {
      '200': {
        description: 'Permission PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permission, {partial: true}),
        },
      },
    })
    permission: Permission,
    @param.where(Permission) where?: Where<Permission>,
  ): Promise<Count> {
    return this.permissionRepository.updateAll(permission, where);
  }

  @get('/permission/{id}', {
    responses: {
      '200': {
        description: 'Permission model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Permission, {exclude: 'where'})
    filter?: FilterExcludingWhere<Permission>,
  ): Promise<Permission> {
    return this.permissionRepository.findById(id, filter);
  }

  @patch('/permission/{id}', {
    responses: {
      '204': {
        description: 'Permission PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permission, {partial: true}),
        },
      },
    })
    permission: Permission,
  ): Promise<void> {
    await this.permissionRepository.updateById(id, permission);
  }

  @put('/permission/{id}', {
    responses: {
      '204': {
        description: 'Permission PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() permission: Permission,
  ): Promise<void> {
    await this.permissionRepository.replaceById(id, permission);
  }

  @del('/permission/{id}', {
    responses: {
      '204': {
        description: 'Permission DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.permissionRepository.deleteById(id);
  }

  @post('/permissions/{id}/role/assign', {
    responses: {
      '200': {
        description: 'Assign permission to role',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async assignPermissionToRole(
    @param.path.string('id') id: typeof Permission.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: RolePermissionSchema,
        },
      },
    })
    roleObj: {role: string},
  ): Promise<Permission> {
    await this.permissionRepository.roles(id).link(roleObj.role);
    return this.permissionRepository.findById(id);
  }

  @post('/permissions/{id}/role/unassign', {
    responses: {
      '200': {
        description: 'unassign permission from role',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async unassignPermissionToRole(
    @param.path.string('id') id: typeof Permission.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: RolePermissionSchema,
        },
      },
    })
    roleObj: {role: string},
  ): Promise<Permission> {
    await this.permissionRepository.roles(id).unlink(roleObj.role);
    return this.permissionRepository.findById(id);
  }

  @post('/permissions/{id}/module/assign', {
    responses: {
      '200': {
        description: 'Assign modules to permission',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async assignModuleToPermission(
    @param.path.string('id') id: typeof Permission.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: ModulePermissionSchema,
        },
      },
    })
    module: {moduleId: string},
  ): Promise<Permission> {
    await this.permissionRepository.modules(id).link(module.moduleId);
    return this.permissionRepository.findById(id);
  }

  @post('/permissions/{id}/module/unassign', {
    responses: {
      '200': {
        description: 'Unassign modules to permission',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async unassignModuleToPermission(
    @param.path.string('id') id: typeof Permission.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: ModulePermissionSchema,
        },
      },
    })
    module: {moduleId: string},
  ): Promise<Permission> {
    await this.permissionRepository.modules(id).unlink(module.moduleId);
    return this.permissionRepository.findById(id);
  }

  @post('/permissions/{id}/operation/assign', {
    responses: {
      '200': {
        description: 'Assign operations to permission',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async assignOperationToPermission(
    @param.path.string('id') id: typeof Permission.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: OperationPermissionSchema,
        },
      },
    })
    operation: {operationId: string},
  ): Promise<Permission> {
    await this.permissionRepository.operations(id).link(operation.operationId);
    return this.permissionRepository.findById(id);
  }

  @post('/permissions/{id}/operation/unassign', {
    responses: {
      '200': {
        description: 'Unassign modules to permission',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async unassignOperationToPermission(
    @param.path.string('id') id: typeof Permission.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: OperationPermissionSchema,
        },
      },
    })
    operation: {operationId: string},
  ): Promise<Permission> {
    await this.permissionRepository
      .operations(id)
      .unlink(operation.operationId);
    return this.permissionRepository.findById(id);
  }
}
