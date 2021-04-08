import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import ejs from 'ejs';
import {Activity} from '../models';
import {TemplateRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class NotificationMessageService {
  constructor(
    @repository(TemplateRepository) protected templateRepository: TemplateRepository
  ) {}

  async getTemplate(activity: Activity, type: string) {

    const body = await this.templateRepository.findOne({
      where: {
        code: `${activity.type}.${activity.action?.toLowerCase()}`,
        type: type
      }
    })

    if (!body) {
      return
    }

    const bodyContent = ejs.render(body.body!, activity)

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
