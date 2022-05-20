import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { v4 as uuid } from 'uuid';
import { CreateCronDto, UpdateCronDto } from './cron.dto';
import { Cron } from './cron.entity';
import { CronService } from './cron.service';

@Injectable()
export class CronProducerService {
  private readonly logger = new Logger(CronProducerService.name);

  constructor(
    @InjectQueue('email-queue') private queue: Queue,
    private cronService: CronService,
  ) {}

  async addCron(dto: CreateCronDto): Promise<Cron> {
    try {
      const id: string = uuid();

      // add cron to the queue
      const cron = await this.queue.add(
        id,
        {
          message: dto.message,
        },
        {
          repeat: {
            every: dto.frequency * 1000,
          },
        },
      );

      // adding the cron to the db
      return (
        cron &&
        (await this.cronService.create({
          id,
          message: dto.message,
          frequency: dto.frequency,
        }))
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  async updateCron(dto: UpdateCronDto) {
    try {
      const cron: Cron = await this.cronService.getById(dto.id);

      if (cron) {
        const cronFullId = `${cron.id}:::${cron.frequency * 1000}`;

        // remove the old cron from redis
        await this.queue.removeRepeatableByKey(cronFullId);

        // create a new job with same id and new frequency
        await this.queue.add(
          dto.id,
          {
            message: cron.message,
          },
          {
            repeat: {
              every: dto.frequency * 1000,
            },
          },
        );

        // update the cron in the db
        await this.cronService.update(dto);

        return {
          status: 'success',
        };
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      this.logger.error(err);

      return {
        status: 'error',
      };
    }
  }
}
