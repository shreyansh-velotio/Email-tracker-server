import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('/ping')
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: 'Base route' })
  getHello() {
    return this.appService.getHello();
  }
}
