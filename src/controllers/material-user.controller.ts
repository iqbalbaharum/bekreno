import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Material, User} from '../models';
import {MaterialRepository} from '../repositories';

export class MaterialUserController {
  constructor(
    @repository(MaterialRepository)
    public materialRepository: MaterialRepository,
  ) {}

  @get('/materials/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Material',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Material.prototype.id,
  ): Promise<User> {
    return this.materialRepository.user(id);
  }
}
