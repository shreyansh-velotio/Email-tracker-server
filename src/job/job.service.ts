import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CronService } from '../cron/cron.service';

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
  async getJobHistory(cron: string) {
    try {
      const jobs = await this.jobRepository.find({
        where: { cron },
        take: 10,
      });

      if (jobs.length === 0)
        throw new NotFoundException(
          `Not found any job related to the cron ${cron}`,
        );

      return jobs;
    } catch (err) {
      this.logger.error(err);

      console.log(err);

      if (err instanceof NotFoundException)
        throw new NotFoundException(err.message);
      throw new InternalServerErrorException();
    }
  }
}
