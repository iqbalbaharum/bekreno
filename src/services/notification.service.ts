import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import {Filter, PredicateComparison, repository} from '@loopback/repository';
import {Activity, User} from '../models';
import {DtoNotification} from '../models/dto-notification.model';
import {ActivityRepository, UserChannelRepository, UserRepository} from '../repositories';
import {EmailService} from './email.service';
import {NotificationMessageService} from './notification-message.service';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserChannelRepository) protected userChannelRepository: UserChannelRepository,
    @repository(ActivityRepository) protected activityRepository: ActivityRepository,
    @inject('services.NotificationMessageService') public notificationMessageService: NotificationMessageService,
    @inject('services.EmailService') public emailService: EmailService
  ) {}

  async getUserNotifications(refUserId: string, startingDate: Date, limit: number = 20, skip: number = 0) : Promise<DtoNotification[]> {
    let user = await this.userChannelRepository.findOne({
      where: { refUserId : refUserId }
    })

    if(!user || user.channels.length < 0) {
      return []
    }

    let chas : PredicateComparison<string[]> = <PredicateComparison<string[]>>user.channels

    let filter: Filter<Activity> = {
      where: { channels: { inq: chas } as PredicateComparison<string[]>, createdAt: { gte: startingDate }},
      limit: limit,
      skip: skip
    }

    const activities = await this.activityRepository.find(filter)
    return this.notificationMessageService.convertActivitiesToNotification(activities, 'web')
  }

  /**
   * Get user related to the registered channels
   * @param channels
   * @returns
   */
  async getNotificationUsers(channels: string[]) : Promise<User[]> {

    let chas : PredicateComparison<string[]> = <PredicateComparison<string[]>>channels

    let filter = {
      where: { channels: { inq: chas } as PredicateComparison<string[]> }
    }

    const userChannels = await this.userChannelRepository.find(filter)

    let users : User[] = []

    for(const uc of userChannels) {
      users.push(await this.userRepository.findById(uc.refUserId))
    }

    return users
  }

  /**
   *
   * @param type
   * @param action
   * @param refId
   * @param refUserId
   * @param refName
   * @param channels
   * @param emailService
   */
  async setNotification(
    type: string,
    action: string,
    refId: string,
    refUserId: string,
    refName: string,
    channels: string[]
  ) {

    const activity = await this.activityRepository.create({
      refUserId: refUserId,
      refUserName: refName,
      type: type,
      action: action,
      refId: refId,
      channels: channels
    })

    let users = await this.getNotificationUsers(channels)

    if(users.length <= 0) {
      return
    }

    let template = await this.notificationMessageService.convertActivityToNotification(activity, 'email')

    if(template) {
      for(const user of users) {
        this.emailService.sendEmailRaw(template.message!, template.title!, user.email)
      }
    }
  }
}
