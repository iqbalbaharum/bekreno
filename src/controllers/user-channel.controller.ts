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
  getModelSchemaRef,




  HttpErrors, param,


  post,






  requestBody
} from '@loopback/rest';
import {UserChannel} from '../models';
import {UserChannelRepository} from '../repositories';
import {UserChannelSchema} from '../schema';

export class UserChannelController {
  constructor(
    @repository(UserChannelRepository)
    public userChannelRepository : UserChannelRepository,
  ) {}

  @post('/user-channels', {
    responses: {
      '200': {
        description: 'UserChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserChannel)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserChannel, {
            title: 'NewUserChannel',
            exclude: ['id'],
          }),
        },
      },
    })
    userChannel: Omit<UserChannel, 'id'>,
  ): Promise<UserChannel> {
    return this.userChannelRepository.create(userChannel);
  }

  @get('/user-channels/count', {
    responses: {
      '200': {
        description: 'UserChannel model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(UserChannel) where?: Where<UserChannel>,
  ): Promise<Count> {
    return this.userChannelRepository.count(where);
  }

  @get('/user-channels', {
    responses: {
      '200': {
        description: 'Array of UserChannel model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserChannel, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserChannel) filter?: Filter<UserChannel>,
  ): Promise<UserChannel[]> {
    return this.userChannelRepository.find(filter);
  }

  @get('/user-channels/{id}', {
    responses: {
      '200': {
        description: 'UserChannel model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserChannel, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserChannel, {exclude: 'where'}) filter?: FilterExcludingWhere<UserChannel>
  ): Promise<UserChannel> {
    return this.userChannelRepository.findById(id, filter);
  }

  @del('/user-channels/{id}', {
    responses: {
      '204': {
        description: 'UserChannel DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userChannelRepository.deleteById(id);
  }

  @get('/user/{userId}/channels', {
    responses: {
      '200': {
        description: 'Retrieve UserChannel model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserChannel, {includeRelations: true}),
          },
        },
      },
    },
  })
  async getUserChannelByUserId(
    @param.path.string('userId') id: string
  ): Promise<UserChannel | null> {
    return this.userChannelRepository.findOne({
      where: {
        refUserId: id
      }
    });
  }

  @post('/user-channels/{userId}/channels', {
    responses: {
      '200': {
        description: 'UserChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserChannel)}},
      },
    },
  })
  async addUserChannel(
    @param.path.string('userId') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: UserChannelSchema,
        },
      },
    })
    body: UserChannel,
  ): Promise<UserChannel> {

    const userChannel = await this.userChannelRepository.findOne({
      where: {
        refUserId: id
      }
    })

    if(!userChannel) {
      throw new HttpErrors.BadRequest('Invalid user channels')
    }

    userChannel.channels?.push(...body.channels!)
    userChannel.updatedAt = new Date()

    await this.userChannelRepository.updateById(userChannel.id, userChannel)

    return userChannel;
  }

  @del('/user-channels/{userId}/channels', {
    responses: {
      '200': {
        description: 'UserChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserChannel)}},
      },
    },
  })
  async removeUserChannels(
    @param.path.string('userId') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: UserChannelSchema,
        },
      },
    })
    body: UserChannel,
  ): Promise<void> {

    const userChannel = await this.userChannelRepository.findOne({
      where: {
        refUserId: id
      }
    })

    if(!userChannel) {
      throw new HttpErrors.BadRequest('Invalid user channels')
    }

    let bUpdate = false
    for(const channel of body.channels!) {
      const foundIndex = userChannel.channels?.indexOf(channel)
      if(foundIndex !== -1) {
        userChannel.channels?.splice(foundIndex!, 1)
        bUpdate = true
      }
    }

    if(bUpdate) {
      userChannel.updatedAt = new Date()
      await this.userChannelRepository.updateById(userChannel.id, userChannel)
    }
  }
}
