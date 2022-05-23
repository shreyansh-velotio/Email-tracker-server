import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('/cron-job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/history')
  async getJobs(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.jobService.getJobHistory(id);
  }
}
