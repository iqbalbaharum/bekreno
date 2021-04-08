import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import ejs from 'ejs';
import {Notification} from '../models';
import {TemplateRepository} from '../repositories';
import {NotificationType} from '../types';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationMessageService {
  constructor(
    @repository(TemplateRepository) protected templateRepository: TemplateRepository
  ) {}

  async getTemplate(notification: Notification, type: string) {

    const body = await this.templateRepository.findOne({
      where: {
        code: `${NotificationType[notification.type!]}.${notification.action?.toLowerCase()}`,
        type: type
      }
    })

    if (!body) {
      throw new HttpErrors.InternalServerError('Invalid. Please make sure there is an email template under the code')
    }

    const bodyContent = ejs.render(body.body!, notification)

    if(!body) {
      throw new HttpErrors.InternalServerError('Invalid message structure')
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
      content = ejs.render(container.body!, {
        content: {
          header: headerContent.body,
          footer: footerContent.body,
          body: body
        }
      })
    } else {
      content = bodyContent
    }

    return {
      content: content,
      subject: body.subject
    }
  }
}
