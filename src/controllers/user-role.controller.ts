import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
User,
UserRole,
Role,
} from '../models';
import {UserRepository} from '../repositories';
import {UserRoleSchema} from './../schema';

export class UserRoleController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/roles', {
    responses: {
      '200': {
        description: 'Array of User has many Role through UserRole',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.userRepository.roles(id).find(filter);
  }

  @post('/users/{id}/roles', {
    responses: {
      '200': {
        description: 'create a Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: UserRoleSchema      
        },
      },
    }) role: {roleId: string},
  ): Promise<User> {
    await this.userRepository.roles(id).link(role.roleId);
    return this.userRepository.findById(id);
  }

  @post('/users/{id}/roles/unassign', {
    responses: {
      '200': {
        description: 'unassign a Role from user',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async unassignRole(
    @param.path.string('id') id: typeof User.prototype.uuid,
    @requestBody({
      content: {
        'application/json': {
          schema: UserRoleSchema      
        },
      },
    }) role: {roleId: string},
  ): Promise<User> {
    await this.userRepository.roles(id).unlink(role.roleId);
    return this.userRepository.findById(id);
  }
}
