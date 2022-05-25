import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';

// mailgun SDK setup
const mailgun = new Mailgun(formData).client({
  username: 'api',
  key: process.env.MAILGUN_APIKEY,
});

@Injectable()
export class MailgunService {
  async sendEmail(payload) {
    const res = await mailgun.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Email Tracker <${process.env.MAILGUN_SENDER}>`,
      to: [process.env.MAILGUN_RECEIVER],
      subject: 'Hello',
      text: payload.message,
      html: `${payload.message}`,
    });

    return res;
  }
}
