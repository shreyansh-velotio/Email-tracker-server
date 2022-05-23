import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
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
      await this.queue.add(
        id,
        {
          message: dto.message,
        },
        {
          repeat: {
            every: dto.frequency * 1000,
            /**
             * @note
             * Remove the limit option only here for development
             * so that my email don't get spammed
             */
            limit: 3,
          },
        },
      );

      // adding the cron to the db
      return await this.cronService.create({
        id,
        message: dto.message,
        frequency: dto.frequency,
      });
    } catch (err) {
      this.logger.error(err);

      throw new InternalServerErrorException();
    }
  }

  async updateCron(dto: UpdateCronDto): Promise<Cron> {
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

              /**
               * @note
               * Remove the limit option only here for development
               * so that my email don't get spammed
               */
              limit: 3,
            },
          },
        );

        // update the cron in the db
        return await this.cronService.update(dto);
      } else {
        throw new NotFoundException(
          `Unable to find a cron with the id ${dto.id}`,
        );
      }
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
