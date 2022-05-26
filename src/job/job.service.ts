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
  async getJobHistory(cronId: string) {
    const cron = await this.cronService.getById(cronId);
    if (cron) {
      return await this.jobRepository.find({
        where: { cron: cronId },
        take: 10,
      });
    } else {
      throw new NotFoundException(`No cron found with an id ${cronId}`);
    }
  }
}
