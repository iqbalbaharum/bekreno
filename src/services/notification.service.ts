import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import {Filter, PredicateComparison, repository} from '@loopback/repository';
import {NotifyService} from '../components/notify/services/notify.service';
import {Notification} from '../models';
import {NotificationRepository, UserChannelRepository} from '../repositories';

interface RefObject {
  userId : string,
  userName: string
}

@bind({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(
    @repository(UserChannelRepository) protected userChannelRepository: UserChannelRepository,
    @repository(NotificationRepository) protected notificationRepository: NotificationRepository,
    @inject('services.NotifyService') public notifyService: NotifyService
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

  async setNotification(type: string, action: string, refId: string, refUserId: string, refName: string, channels: string[]) {
    const notification = this.notificationRepository.create({
      refUserId: refUserId,
      refUserName: refName,
      type: type,
      action: action,
      refId: refId,
      channels: channels
    })

    this.notifyService.push('email', notification)
  }
}
