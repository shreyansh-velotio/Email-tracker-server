import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGaurd } from '../auth/guards/jwt-auth.guard';
import { GetJobsDto } from './dtos/get-jobs.dto';

@UseGuards(JwtAuthGaurd)
@ApiBearerAuth()
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'User not authenticated' })
@Controller('/cron-job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/history')
  async getJobs(@Query() dto: GetJobsDto) {
    return await this.jobService.getJobHistory(dto.id, dto.page, dto.limit);
  }
}
