import {
  Controller,
  Get,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGaurd } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGaurd)
@ApiBearerAuth()
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'User not authenticated' })
@Controller('/cron-job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/history')
  async getJobs(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.jobService.getJobHistory(id);
  }
}
