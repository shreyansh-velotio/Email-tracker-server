import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { SigninUserDto } from '../user/dtos/signin-user.dto';
import { comparePw } from 'src/utils/bcrypt.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: SigninUserDto): Promise<User> {
    const user = await this.userService.getByUsername(dto.username);

    if (user && comparePw(dto.password, user.password)) {
      return {
        ...user,
        password: undefined,
      };
    }

    return null;
  }

  async getJwt(user: User) {
    const payload = {
      sub: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
