import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import {Filter, PredicateComparison, repository} from '@loopback/repository';
import {Notification, User} from '../models';
import {NotificationRepository, UserChannelRepository, UserRepository} from '../repositories';
import {NotificationType} from '../types';
import {EmailService} from './email.service';
import {NotificationMessageService} from './notification-message.service';

interface RefObject {
  userId : string,
  userName: string
}

@bind({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserChannelRepository) protected userChannelRepository: UserChannelRepository,
    @repository(NotificationRepository) protected notificationRepository: NotificationRepository,
    @inject('services.NotificationMessageService') public notificationMessageService: NotificationMessageService,
    @inject('services.EmailService') public emailService: EmailService
  ) {}

  async getUserNotifications(refUserId: string, startingDate: Date, limit: number = 20, skip: number = 0) : Promise<Notification[]> {
    let user = await this.userChannelRepository.findOne({
      where: { refUserId : refUserId }
    })

    if(!user || user.channels.length < 0) {
      return []
    }

    let chas : PredicateComparison<string[]> = <PredicateComparison<string[]>>user.channels

    let filter: Filter<Notification> = {
      where: { channels: { inq: chas } as PredicateComparison<string[]>, createdAt: { gte: startingDate }},
      limit: limit,
      skip: skip
    }

    return this.notificationRepository.find(filter)
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
    type: NotificationType,
    action: string,
    refId: string,
    refUserId: string,
    refName: string,
    channels: string[]
  ) {

    const notification = await this.notificationRepository.create({
      refUserId: refUserId,
      refUserName: refName,
      type: type,
      action: action,
      refId: refId,
      channels: channels
    })

    let users = await this.getNotificationUsers(channels)
    let template = await this.notificationMessageService.getTemplate(notification, 'email')

    if(template && users.length > 0) {
      for(const user of users) {
        this.emailService.sendEmailRaw(template.content, template.subject!, user.email)
      }
    }
  }
}
