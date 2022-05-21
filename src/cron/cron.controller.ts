import {
  Controller,
  Get,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobService } from 'src/job/job.service';
import { CreateCronDto, UpdateCronDto } from './cron.dto';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';

@Controller('/cron')
export class CronController {
  constructor(
    private cronService: CronService,
    private cronProducerService: CronProducerService,
    private jobService: JobService,
  ) {}

  @Get()
  async getCrons() {
    return await this.cronService.getAll();
  }

  @Get('/jobs')
  async getJobs(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.jobService.getJobHistory(id);
  }

  @Post()
  async addCron(@Query() dto: CreateCronDto) {
    return await this.cronProducerService.addCron(dto);
  }

  @Patch()
  async updateCron(@Query() dto: UpdateCronDto) {
    return await this.cronProducerService.updateCron(dto);
  }
}
