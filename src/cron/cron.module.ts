import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailgunModule } from 'src/mailgun/mailgun.module';

import { Cron } from './cron.entity';
import { CronController } from './cron.controller';
import { CronProducerService } from './cron.producer.service';
import { CronConsumerService } from './cron.consumer.service';
import { CronService } from './cron.service';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cron]),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    JobModule,
    MailgunModule,
  ],
  controllers: [CronController],
  providers: [CronService, CronProducerService, CronConsumerService],
  exports: [CronService, CronProducerService, CronConsumerService],
})
export class CronModule {}
