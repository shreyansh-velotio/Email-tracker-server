import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CreateCronDto } from './dtos/create-cron.dto';
import { UpdateCronDto } from './dtos/update-cron.dto';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGaurd } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

@UseGuards(JwtAuthGaurd, new RolesGuard(new Reflector()))
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'User not authenticated' })
@ApiForbiddenResponse({ description: 'User not authorized' })
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
  @SetMetadata('roles', ['admin'])
  async addCron(@Body() dto: CreateCronDto) {
    return await this.cronProducerService.addCron(dto);
  }

  @Patch()
  @SetMetadata('roles', ['admin'])
  async updateCron(@Body() dto: UpdateCronDto) {
    return await this.cronProducerService.updateCron(dto);
  }
}
