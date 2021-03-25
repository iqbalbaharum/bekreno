import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import {Email} from '../models';
import {EmailRepository, EmailTemplateRepository} from '../repositories';

@bind({scope: BindingScope.SINGLETON})
export class EmailService {


  constructor(
    @repository(EmailRepository) protected emailRepository: EmailRepository,
    @repository(EmailTemplateRepository) protected emailTemplateRepository: EmailTemplateRepository
  ) {}

  private async sendMail(email: Email): Promise<Object> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      secure: Boolean(process.env.SMTP_SECURE),
      port: Number(process.env.SMTP_PORT),
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    return transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: email.to,
      subject: email.subject,
      html: email.content,
    });
  }

  async sendEmailFromTemplate(code: string, data: ejs.Data, to: string) : Promise<Object> {

    const bodyContent = await this.emailTemplateRepository.findOne({
      where: {code: code}
    })

    if (!bodyContent) {
      throw new HttpErrors.InternalServerError('Invalid Email. Please make sure there is an email template under the code')
    }

    // data need to be sent as an object
    const body = ejs.render(bodyContent.body!, {data})

    /* No longer needed to reduce logic processing */
    // Setup email container
    // const container = await this.emailTemplateRepository.findOne({
    //   where: {code: 'CONTAINER'}
    // })

    // const headerContent = await this.emailTemplateRepository.findOne({
    //   where: {code: 'HEADER'}
    // })

    // const footerContent = await this.emailTemplateRepository.findOne({
    //   where: {code: 'FOOTER'}
    // })

    if(!bodyContent) {
      throw new HttpErrors.InternalServerError('Internal error. Please reseed a fresh copy of email templates.')
    }

    /* render method did not has any key named as 'content' */
    // const template = ejs.render(container.body!, {
    //   content: {
    //     header: headerContent.body,
    //     footer: footerContent.body,
    //     body: body
    //   }
    // })

    const email = new Email({
      to: to,
      subject: bodyContent.subject,
      content: body, // Sent the whole body of PASSWORDRESET as a whole including header and footer
    });

    return this.sendMail(email)
  }

  async sendEmailRaw(content: string, subject: string, to: string) : Promise<Object> {
    const email = new Email({
      to: to,
      subject: subject,
      content: to
    });

    return this.sendMail(email)
  }
 }
