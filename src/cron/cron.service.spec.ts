import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from './entities/cron.entity';
import { CronService } from './cron.service';
import { CronDto } from './dtos/cron.dto';
import { UpdateCronDto } from './dtos/update-cron.dto';

describe('Cron Service', () => {
  let cronService: CronService;

  // instance of the actual cronsRepository
  let cronsRepository: Repository<Cron>;

  const CRON_REPOSITORY_TOKEN = getRepositoryToken(Cron);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronService,
        // mocking the cronsRepository functions
        {
          provide: CRON_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    cronService = module.get<CronService>(CronService);

    cronsRepository = module.get<Repository<Cron>>(CRON_REPOSITORY_TOKEN);
  });

  it('cron service should be defined', () => {
    expect(cronService).toBeDefined();
  });

  it('cron repository should be defined', () => {
    expect(cronsRepository).toBeDefined();
  });

  describe('getAll', () => {
    it('should call cronsRepository.find', async () => {
      await cronService.getAll();

      expect(cronsRepository.find).toHaveBeenCalled();
    });

    it('should throw exception if cronsRepository.find throws exception', async () => {
      jest.spyOn(cronsRepository, 'find').mockRejectedValueOnce(new Error());

      try {
        await cronService.getAll();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should get all crons', async () => {
      const mockCronsResult = [
        {
          id: '1',
          frequency: 10,
          message: 'Cron creation test 1',
          jobs: [],
        },
        {
          id: '2',
          frequency: 20,
          message: 'Cron creation test 2',
          jobs: [],
        },
      ];
      jest
        .spyOn(cronsRepository, 'find')
        .mockResolvedValueOnce(mockCronsResult);

      const crons = await cronService.getAll();

      expect(crons.length).toBe(2);
      expect(crons).toEqual(mockCronsResult);
    });
  });

  describe('getById', () => {
    it('should call cronsRepository.findOne', async () => {
      await cronService.getById('1');

      expect(cronsRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw exception if cronsRepository.findOne throws exception', async () => {
      jest.spyOn(cronsRepository, 'findOne').mockRejectedValueOnce(new Error());

      try {
        await cronService.getById('1');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should return the cron', async () => {
      const mockCronResult = {
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      };
      jest
        .spyOn(cronsRepository, 'findOne')
        .mockResolvedValueOnce(mockCronResult);

      const cron = await cronService.getById('1');

      expect(cron).toEqual(mockCronResult);
    });
  });

  describe('create', () => {
    it('should call cronsRepository.create', async () => {
      await cronService.create({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cronsRepository.create).toHaveBeenCalledWith({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
      });
    });

    it('should call cronsRepository.save', async () => {
      jest.spyOn(cronsRepository, 'create').mockReturnValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.create({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cronsRepository.save).toHaveBeenCalledWith({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });
    });

    it('should throw exception if cronsRepository.save throws exception', async () => {
      const cronDto: CronDto = {
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
      };
      jest.spyOn(cronsRepository, 'save').mockRejectedValueOnce(new Error());

      try {
        await cronService.create(cronDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should create cron', async () => {
      const mockCronResult = {
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      };
      jest.spyOn(cronsRepository, 'create').mockReturnValueOnce(mockCronResult);

      jest.spyOn(cronsRepository, 'save').mockResolvedValueOnce(mockCronResult);

      const cron = await cronService.create({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cron).toEqual(mockCronResult);
    });
  });

  describe('update', () => {
    it('should call cronsRepository.findOne', async () => {
      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.update({
        id: '1',
        frequency: 20,
      });

      expect(cronsRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should call cronsRepository.save', async () => {
      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.update({
        id: '1',
        frequency: 20,
      });

      expect(cronsRepository.save).toHaveBeenCalledWith({
        id: '1',
        frequency: 20,
        message: 'Cron creation test',
        jobs: [],
      });
    });

    it('should throw exception when cronService.getById throws exception', async () => {
      jest.spyOn(cronService, 'getById').mockRejectedValueOnce(new Error());

      try {
        await cronService.update({
          id: '1',
          frequency: 20,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should throw exception if cronsRepository.save throws exception', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 10,
      };
      jest.spyOn(cronsRepository, 'save').mockRejectedValueOnce(new Error());

      try {
        await cronService.update(updateCronDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should update the cron', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 20,
      };
      const mockCronResult = {
        id: '1',
        frequency: 20,
        message: 'Cron creation test',
        jobs: [],
      };

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      jest.spyOn(cronsRepository, 'save').mockResolvedValueOnce(mockCronResult);

      const cron = await cronService.update(updateCronDto);
      expect(cron).toEqual(mockCronResult);
    });
  });

  describe('delete', () => {
    it('should call cronsRepository.findOne', async () => {
      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.delete('1');

      expect(cronsRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should call cronsRepository.remove', async () => {
      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.delete('1');

      expect(cronsRepository.remove).toHaveBeenCalledWith({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });
    });

    it('should throw exception when cronService.getById throws exception', async () => {
      jest.spyOn(cronService, 'getById').mockRejectedValueOnce(new Error());

      try {
        await cronService.delete('1');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should throw exception when cronsRepository.remove throws exception', async () => {
      jest.spyOn(cronsRepository, 'remove').mockRejectedValueOnce(new Error());

      try {
        await cronService.delete('1');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should delete the cron', async () => {
      const mockCronResult = {
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      };
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce(mockCronResult);
      jest
        .spyOn(cronsRepository, 'remove')
        .mockResolvedValueOnce(mockCronResult);

      const deletedCron = await cronService.delete('1');
      expect(deletedCron).toEqual(mockCronResult);
    });
  });
});
