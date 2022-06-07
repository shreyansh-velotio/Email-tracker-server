import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CronService } from '../cron/cron.service';

type HistoryResult = {
  total: number;
  result: Job[];
};

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    private cronService: CronService,
  ) {}

  async create(
    id: string,
    cronId: string,
    emailSender: string,
    emailReceiver: string,
    sentAt: Date,
    isEmailSent: boolean,
  ): Promise<Job> {
    const job = this.jobRepository.create({
      id,
      emailSender,
      emailReceiver,
      sentAt,
      isEmailSent,
    });

    job.cron = await this.cronService.getById(cronId);

    return this.jobRepository.save(job);
  }

  // get recent top 10 job entries of the cron
  async getJobHistory(
    cronId: string,
    page?: number,
    limit?: number,
  ): Promise<HistoryResult> {
    const cron = await this.cronService.getById(cronId);
    if (cron) {
      const skip = page && page > 0 ? page : 1;
      const take = limit && limit > 0 ? limit : 5;

      const offset = (skip - 1) * take;

      const totalResult = await this.jobRepository.count({
        where: { cron: cronId },
      });

      const results: HistoryResult = {
        total: totalResult,
        result: await this.jobRepository.find({
          where: { cron: cronId },
          take,
          skip: offset,
        }),
      };

      return results;
    } else {
      throw new NotFoundException(`No cron found with an id ${cronId}`);
    }
  }
}
