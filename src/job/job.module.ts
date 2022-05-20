import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cron } from 'src/cron/cron.entity';
import { Job } from './job.entity';
import { JobService } from './job.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Cron])],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
