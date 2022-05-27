import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPw } from 'src/utils/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  getByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = hashPw(dto.password);

    const newDto: CreateUserDto = {
      ...dto,
      password: hashedPassword,
    };

    const user = this.userRepository.create(newDto);

    const savedUser = await this.userRepository.save(user);

    return { ...savedUser, password: undefined };
  }
}
