import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from '../utils/bcrypt.service';

const mockUser: User = {
  id: 1,
  username: 'test1@admin.com',
  password: 'password',
  name: 'Tester 1',
  role: 'admin',
};

const mockUsers: User[] = [
  {
    id: 1,
    username: 'test1@admin.com',
    password: 'password',
    name: 'Tester 1',
    role: 'admin',
  },
  {
    id: 2,
    username: 'test2@user.com',
    password: 'password',
    name: 'Tester 2',
    role: 'user',
  },
];

const mockDto: CreateUserDto = {
  username: 'test1@admin.com',
  password: 'password',
  name: 'Tester 1',
  role: 'admin',
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('user service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('user repository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('getAll', () => {
    it('should call userRepository.find', async () => {
      await userService.getAll();

      expect(userRepository.find).toBeCalled();
    });

    it('should throw exception if userRepository.find throws exception', async () => {
      jest.spyOn(userRepository, 'find').mockRejectedValueOnce(new Error());

      try {
        await userService.getAll();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should return all the users', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(mockUsers);

      const users = await userService.getAll();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('getByUsername', () => {
    it('should call userRepository.findOne', async () => {
      await userService.getByUsername('test1@admin.com');

      expect(userRepository.findOne).toBeCalledWith({
        where: { username: 'test1@admin.com' },
      });
    });

    it('should throw exception if userRepository.findOne throws exception', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      try {
        await userService.getByUsername('test1@admin.com');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should return a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const user = await userService.getByUsername('test1@admin.com');
      expect(user).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should call userRepository.create', async () => {
      jest
        .spyOn(bcrypt, 'hashPw')
        .mockReturnValueOnce(
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
        );
      await userService.create(mockDto);

      const newMockDto: CreateUserDto = {
        ...mockDto,
        password:
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
      };

      expect(userRepository.create).toBeCalledWith(newMockDto);
    });

    it('should call userRepository.save', async () => {
      jest
        .spyOn(bcrypt, 'hashPw')
        .mockReturnValueOnce(
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
        );
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        ...mockUser,
        password:
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
      });
      await userService.create(mockDto);

      expect(userRepository.save).toBeCalledWith({
        ...mockUser,
        password:
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
      });
    });

    it('should throw exception if userRepository.save throws exception', async () => {
      jest
        .spyOn(bcrypt, 'hashPw')
        .mockReturnValueOnce(
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
        );
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        ...mockUser,
        password:
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
      });
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      try {
        await userService.create(mockDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should create a user', async () => {
      jest
        .spyOn(bcrypt, 'hashPw')
        .mockReturnValueOnce(
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
        );
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        ...mockUser,
        password:
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
      });
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...mockUser,
        password:
          '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
      });

      const user = await userService.create(mockDto);
      expect(user).toEqual({
        ...mockUser,
        password: undefined,
      });
    });
  });
});
