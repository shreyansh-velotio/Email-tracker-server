import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Job as CronJob } from './job.entity';
import { JobService } from './job.service';
import { MailgunService } from '../mailgun/mailgun.service';

@Processor('email-queue')
export class JobConsumerService {
  private readonly logger = new Logger(JobConsumerService.name);

  constructor(
    private readonly mailgunService: MailgunService,
    private jobService: JobService,
  ) {}

  @Process('*')
  async readOperationJob(job: Job<CronJob>) {
    try {
      console.log(job);

      const { id: jobId, name: cronId } = job;
      const payload = job.data;

      // send an email
      const email = await this.mailgunService.sendEmail(payload);

      const emailSuccess: boolean =
        email && email.status === 200 ? true : false;

      // create an entry in the table
      await this.jobService.create(
        jobId.toString(),
        cronId,
        process.env.MAILGUN_SENDER,
        process.env.MAILGUN_RECEIVER,
        new Date(),
        emailSuccess,
      );

      return email;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
