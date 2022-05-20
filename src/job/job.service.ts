import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Repository } from 'typeorm';
import Bull from 'bull';

@Injectable()
export class JobService {
  constructor(@InjectRepository(Job) private jobsRepository: Repository<Job>) {}

  create(
    id: string,
    cronId: string,
    emailSender: string,
    emailReceiver: string,
    sentAt: Date,
    isEmailSent: boolean,
  ): Promise<Job> {
    const job = this.jobsRepository.create({
      id,
      cron: cronId,
      emailSender,
      emailReceiver,
      sentAt,
      isEmailSent,
    });

    return this.jobsRepository.save(job);
  }
}
