import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserService } from './user/user.service';

@Controller('/ping')
export class AppController {
  constructor(
    private appService: AppService,
    private userService: UserService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Base route' })
  getHello() {
    return this.appService.getHello();
  }
}
