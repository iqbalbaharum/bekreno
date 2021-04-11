import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {render} from 'mustache';
import {Activity, Template} from '../models';
import {DtoNotification} from '../models/dto-notification.model';
import {TemplateRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationMessageService {
  constructor(
    @repository(TemplateRepository) protected templateRepository: TemplateRepository
  ) {}

  async convertActivitiesToNotification(activities: Activity[], type: string) : Promise<DtoNotification[]> {

    const notifications: DtoNotification[] = []

    for(const activity of activities) {
      const notification = await this.convertActivityToNotification(activity, type)
      if(notification) {
        notifications.push(notification)
      }
    }

    return notifications
  }

  async convertActivityToNotification(activity: Activity, type: string) : Promise<DtoNotification | null> {

    const body = await this.templateRepository.findOne({
      where: {
        code: `${activity.type}.${activity.action?.toLowerCase()}`,
        type: type,
        language: 'en'
      }
    })

    if (!body) {
      return null
    }

    let content = ''

    switch(type) {
      case 'web':
        content = await this.renderMessageTemplate(body, activity)
        break
      case 'email':
        content = await this.renderEmailTemplate(body, activity)
        break;
      default:
        return null
    }

    return new DtoNotification({
      title: body.subject,
      message: content,
      refId: activity.refId,
      type: activity.type,
      timestamp: activity.createdAt
    })
  }

  private async renderMessageTemplate(body: Template, activity: Activity) : Promise<string> {
    return render(body.body!, activity)
  }

  /**
   * Get template based on email
   * @param body
   * @param activity
   * @returns
   */
  private async renderEmailTemplate(body: Template, activity: Activity) : Promise<string> {

    const bodyContent = render(body.body!, activity)

    if(!bodyContent) {
      return ''
    }

    // Setup email container
    const container = await this.templateRepository.findOne({
      where: {code: 'general.container'}
    })

    const headerContent = await this.templateRepository.findOne({
      where: {code: 'general.header'}
    })

    const footerContent = await this.templateRepository.findOne({
      where: {code: 'general.footer'}
    })

    if(!container || !headerContent || !footerContent || !bodyContent) {
      throw new HttpErrors.InternalServerError('Internal error. Please reseed a fresh copy of email templates.')
    }

    let content = ''

    if(headerContent && bodyContent && footerContent) {
      content = render(container.body!, {
        content: {
          header: headerContent.body,
          footer: footerContent.body,
          body: body
        }
      })
    } else {
      content = bodyContent
    }

    return content
  }
}
