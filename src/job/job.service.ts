import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Repository } from 'typeorm';
import { Cron } from 'src/cron/cron.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private jobsRepository: Repository<Job>,
    @InjectRepository(Cron) private cronsRepository: Repository<Cron>,
  ) {}

  async create(
    id: string,
    cronId: string,
    emailSender: string,
    emailReceiver: string,
    sentAt: Date,
    isEmailSent: boolean,
  ): Promise<Job> {
    const job = this.jobsRepository.create({
      id,
      emailSender,
      emailReceiver,
      sentAt,
      isEmailSent,
    });

    job.cron = await this.cronsRepository.findOne(cronId);

    return this.jobsRepository.save(job);
  }

  // get recent top 10 job entries of the cron
  getJobHistory(cron: string) {
    const jobs = this.jobsRepository.find({
      where: { cron },
      take: 10,
    });

    return jobs;
  }
}
