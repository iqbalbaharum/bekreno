import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
import {


  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors
} from '@loopback/rest';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {Notification} from '../models';
import {NotificationRepository, UserRepository} from '../repositories';
import {NotificationService} from '../services';

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository : NotificationRepository,
    @inject('services.NotificationService') public notificationService: NotificationService
  ) {}

  @get('/notifications', {
    responses: {
      '200': {
        description: 'Array of Notification model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Notification, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @repository(UserRepository) userRepository: UserRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER) getCurrentUser: Getter<MyUserProfile>
  ): Promise<Notification[]> {

    const token = await getCurrentUser()

    const user = await userRepository.findById(token.user)

    if(!user) {
      throw new HttpErrors.InternalServerError('Invalid user token')
    }

    return this.notificationService.getUserNotifications(user.uuid!, user.createdAt!)
  }
}
