import {bind, BindingScope} from '@loopback/core';
import * as nodemailer from 'nodemailer';
import {Email} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class EmailService {
  constructor() {}

  async sendMail(email: Email): Promise<Object> {
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
}
