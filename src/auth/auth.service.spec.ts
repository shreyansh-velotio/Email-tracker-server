import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/entities/user.entity';
import { SigninUserDto } from '../user/dtos/signin-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from '../utils/bcrypt.service';

const mockDto: SigninUserDto = {
  username: 'test1@admin.com',
  password: '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
};

const mockUser: User = {
  id: 1,
  username: 'test1@admin.com',
  password: 'hashed-password',
  name: 'Tester 1',
  role: 'admin',
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('auth service should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('user service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('jwt service should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should call userService.getByUsername', async () => {
      await authService.validateUser(mockDto);

      expect(userService.getByUsername).toBeCalledWith(mockDto.username);
    });

    it('should throw exception if userService.getByUsername throws exception', async () => {
      jest
        .spyOn(userService, 'getByUsername')
        .mockRejectedValueOnce(new Error());

      try {
        await authService.validateUser(mockDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should validate the user', async () => {
      jest.spyOn(userService, 'getByUsername').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'comparePw').mockReturnValueOnce(true);

      const validatedUser = await authService.validateUser(mockDto);
      expect(validatedUser).toEqual({
        ...mockUser,
        password: undefined,
      });
    });
  });

  describe('getJwt', () => {
    it('should call jwtService.sign', async () => {
      await authService.getJwt(mockUser);

      expect(jwtService.sign).toBeCalledWith({
        sub: mockUser.username,
        role: mockUser.role,
      });
    });

    it('should generate jwt token', async () => {
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHJleWFuc2guc2hyZXlAdmVsb3Rpby5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTM4MjM0OTUsImV4cCI6MTY1MzgyNTI5NX0.Uj2k_QkggxiuX65L3xSBrBN6ry9RQDraaFzc5fxb24E',
        );
      const jwt = await authService.getJwt(mockUser);

      expect(jwt).toEqual(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHJleWFuc2guc2hyZXlAdmVsb3Rpby5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTM4MjM0OTUsImV4cCI6MTY1MzgyNTI5NX0.Uj2k_QkggxiuX65L3xSBrBN6ry9RQDraaFzc5fxb24E',
      );
    });
  });
});
