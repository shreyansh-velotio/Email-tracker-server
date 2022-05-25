import { Controller, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { JobService } from './job.service';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('/cron-job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/history')
  @ApiOkResponse({ description: 'Gets the recent 10 jobs of the cron' })
  @ApiNotFoundResponse({ description: 'No cron found with the given id' })
  @ApiInternalServerErrorResponse({
    description: 'Something on the server went wrong',
  })
  async getJobs(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.jobService.getJobHistory(id);
  }
}
