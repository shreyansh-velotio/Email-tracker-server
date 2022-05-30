import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dtos/create-user.dto';
import { LocalAuthGaurd } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { SigninUserDto } from './user/dtos/signin-user.dto';

interface SigninResponse {
  id: string;
  username: string;
  name: string;
  role: string;
  jwt: string;
}

@Controller('')
export class AppController {
  constructor(
    private appService: AppService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    const user = await this.userService.getByUsername(dto.username);

    if (user) throw new ConflictException('User already exist');

    return this.userService.create(dto);
  }

  @UseGuards(LocalAuthGaurd)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SigninUserDto, @Request() req: any) {
    const jwt = await this.authService.getJwt(req.user);

    return {
      ...req.user,
      jwt,
    };
  }

  @Get('ping')
  getHello() {
    return this.appService.getHello();
  }
}
