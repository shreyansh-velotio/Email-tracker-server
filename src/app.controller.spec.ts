import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './user/dtos/create-user.dto';
import { SigninUserDto } from './user/dtos/signin-user.dto';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';

const mockCreateUserDto: CreateUserDto = {
  username: 'test1@admin.com',
  password: 'password',
  name: 'Tester 1',
  role: 'admin',
};

const mockUser: User = {
  id: 1,
  username: 'test1@admin.com',
  password: 'password',
  name: 'Tester 1',
  role: 'admin',
};

const mockSigninDto: SigninUserDto = {
  username: 'test1@admin.com',
  password: '$2a$10$eo8SenGbc0nkxX81avQ4jee7UsljIVCDKWOMh5XasVw7xjJXpsZO6',
};

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {
            getJwt: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);
  });

  it('app controller should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('app service should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('user service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('auth service should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call userService.getByUsername', async () => {
      await appController.signUp(mockCreateUserDto);

      expect(userService.getByUsername).toBeCalledWith(
        mockCreateUserDto.username,
      );
    });

    it('should call userService.create', async () => {
      await appController.signUp(mockCreateUserDto);

      expect(userService.create).toBeCalledWith(mockCreateUserDto);
    });

    it('should throw exception if userService.getByUsername throws exception', async () => {
      jest
        .spyOn(userService, 'getByUsername')
        .mockRejectedValueOnce(new Error());

      try {
        await appController.signUp(mockCreateUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(userService.create).not.toBeCalled();
      }
    });

    it('should throw conflict exception if user already exists', async () => {
      jest.spyOn(userService, 'getByUsername').mockResolvedValueOnce(mockUser);

      try {
        await appController.signUp(mockCreateUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(userService.create).not.toBeCalled();
      }
    });

    it('should throw exception if userService.create throws exception', async () => {
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      try {
        await appController.signUp(mockCreateUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should sign-up a user', async () => {
      jest.spyOn(userService, 'create').mockResolvedValueOnce(mockUser);

      const user = await appController.signUp(mockCreateUserDto);
      expect(user).toEqual(mockUser);
    });
  });

  describe('signIn', () => {
    it('should call authService.getJwt', async () => {
      await appController.signIn(mockSigninDto, {
        user: { ...mockUser, password: undefined },
      });

      expect(authService.getJwt).toBeCalledWith({
        ...mockUser,
        password: undefined,
      });
    });

    it('should throw exception if authService.getJwt throws exception', async () => {
      jest.spyOn(authService, 'getJwt').mockRejectedValueOnce(new Error());

      try {
        await appController.signIn(mockSigninDto, {
          user: { ...mockUser, password: undefined },
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should sign-in the user', async () => {
      jest
        .spyOn(authService, 'getJwt')
        .mockResolvedValueOnce(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHJleWFuc2guc2hyZXlAdmVsb3Rpby5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTM4MjM0OTUsImV4cCI6MTY1MzgyNTI5NX0.Uj2k_QkggxiuX65L3xSBrBN6ry9RQDraaFzc5fxb24E',
        );

      const singinUser = await appController.signIn(mockSigninDto, {
        user: { ...mockUser, password: undefined },
      });
      expect(singinUser).toEqual({
        ...mockUser,
        password: undefined,
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaHJleWFuc2guc2hyZXlAdmVsb3Rpby5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTM4MjM0OTUsImV4cCI6MTY1MzgyNTI5NX0.Uj2k_QkggxiuX65L3xSBrBN6ry9RQDraaFzc5fxb24E',
      });
    });
  });

  describe('getHello', () => {
    it('should call appService.getHello()', () => {
      appController.getHello();

      expect(appService.getHello).toBeCalled();
    });

    it('should return Hello world', () => {
      jest.spyOn(appService, 'getHello').mockReturnValueOnce({
        message: 'Hello World!',
      });
      const result = appController.getHello();
      expect(result).toEqual({ message: 'Hello World!' });
    });
  });
});
