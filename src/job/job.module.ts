import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Mailgun from 'mailgun.js';
import { Cron } from 'src/cron/cron.entity';
import { CronModule } from 'src/cron/cron.module';
import { JobController } from './job.controller';
import { Job } from './job.entity';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Cron]), CronModule, Mailgun],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
