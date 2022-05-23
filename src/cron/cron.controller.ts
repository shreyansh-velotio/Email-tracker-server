import { Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateCronDto, UpdateCronDto } from './cron.dto';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';

@Controller('/cron')
export class CronController {
  constructor(
    private cronService: CronService,
    private cronProducerService: CronProducerService,
  ) {}

  @Get()
  async getCrons() {
    return await this.cronService.getAll();
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
