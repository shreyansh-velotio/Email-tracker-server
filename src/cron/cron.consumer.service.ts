import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JobService } from 'src/job/job.service';
import { MailgunService } from 'src/mailgun/mailgun.service';

@Processor('email-queue')
export class CronConsumerService {
  private readonly logger = new Logger(CronConsumerService.name);

  constructor(
    private readonly mailgunService: MailgunService,
    private jobService: JobService,
  ) {}

  @Process('*')
  async readOperationJob(job: Job) {
    try {
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
