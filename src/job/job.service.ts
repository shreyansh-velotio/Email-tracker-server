import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CronService } from '../cron/cron.service';

type HistoryResult = {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
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
      const cronJobPage = page ? page : 1;
      const cronJobLimit = limit ? limit : 5;

      const startIndex = (cronJobPage - 1) * cronJobLimit;
      const endIndex = cronJobPage * cronJobLimit;

      const totalResult = await this.jobRepository.count({
        where: { cron: cronId },
      });

      const results: HistoryResult = {
        previous:
          startIndex > 0
            ? {
                page: cronJobPage - 1,
                limit: cronJobLimit,
              }
            : undefined,
        next:
          endIndex < totalResult
            ? {
                page: cronJobPage + 1,
                limit: cronJobLimit,
              }
            : undefined,
        result: await this.jobRepository.find({
          where: { cron: cronId },
          take: cronJobLimit,
          skip: startIndex,
        }),
      };

      return results;
    } else {
      throw new NotFoundException(`No cron found with an id ${cronId}`);
    }
  }
}
