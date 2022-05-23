import { Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateCronDto, UpdateCronDto } from './cron.dto';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('/cron')
export class CronController {
  constructor(
    private cronService: CronService,
    private cronProducerService: CronProducerService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Gets all the crons' })
  @ApiInternalServerErrorResponse({
    description: 'Something on the server went wrong',
  })
  async getCrons() {
    return await this.cronService.getAll();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Creates a new cron' })
  @ApiBadRequestResponse({ description: 'Bad request provided by the user' })
  @ApiInternalServerErrorResponse({
    description: 'Something on the server went wrong',
  })
  async addCron(@Query() dto: CreateCronDto) {
    return await this.cronProducerService.addCron(dto);
  }

  @Patch()
  @ApiOkResponse({ description: 'Updates the given cron with a new frequency' })
  @ApiBadRequestResponse({ description: 'Bad request provided by the user' })
  @ApiNotFoundResponse({ description: 'Cron not found with the given id' })
  @ApiInternalServerErrorResponse({
    description: 'Something on the server went wrong',
  })
  async updateCron(@Query() dto: UpdateCronDto) {
    return await this.cronProducerService.updateCron(dto);
  }
}
