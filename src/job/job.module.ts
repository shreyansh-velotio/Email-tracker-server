import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cron } from '../cron/entities/cron.entity';
import { CronModule } from '../cron/cron.module';
import { JobConsumerService } from './job.consumer.service';
import { JobController } from './job.controller';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';
import { MailgunModule } from '../mailgun/mailgun.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Cron]), CronModule, MailgunModule],
  controllers: [JobController],
  providers: [JobService, JobConsumerService],
  exports: [JobService, JobConsumerService],
})
export class JobModule {}
