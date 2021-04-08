import {injectable, Provider} from '@loopback/context';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import {asNotify} from '../keys';
import {INotify, Message, MessageType, Notify} from '../types';

@injectable(asNotify)
export class NodemailerProvider implements Notify, Provider<INotify> {

  constructor(
  ) {

    if(process.env.EMAIL_ENABLE === '1') {
      this.transporter = nodemailer.createTransport({
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
    }
  }

  transporter: Mail
  type = MessageType.Email

  async push(message: Message) {
    if(!this.transporter) {
      return
    }

    if(!message.content) {
      return
    }

    return await this.transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: message.receiver,
      subject: message.subject,
      html: message.content,
      attachments: message.options?.attachments
    })
  }

  value() {
    return {
      push: async (message: Message) => this.push(message)
    }
  }
}
