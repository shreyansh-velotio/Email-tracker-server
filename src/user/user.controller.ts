import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePw } from 'src/utils/bcrypt.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-up')
  async signUp(@Body() dto: CreateUserDto) {
    const user = await this.userService.getByUsername(dto.username);

    if (user) throw new ConflictException('User already exist');

    return this.userService.create(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: SigninUserDto) {
    const user = await this.userService.getByUsername(dto.username);

    if (!user) throw new UnauthorizedException();

    if (comparePw(dto.password, user.password)) {
      return {
        status: 'logged-in',
      };
    }

    throw new UnauthorizedException();
  }
}
