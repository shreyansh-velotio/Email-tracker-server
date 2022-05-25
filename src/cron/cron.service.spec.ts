import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from './entities/cron.entity';
import { CronService } from './cron.service';
import { v4 as uuid } from 'uuid';

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
  });

  describe('getById', () => {
    it('should call cronsRepository.findOne', async () => {
      const id: string = uuid();
      await cronService.getById(id);

      expect(cronsRepository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should call cronsRepository.create', async () => {
      const id: string = uuid();
      await cronService.create({
        id,
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cronsRepository.create).toHaveBeenCalledWith({
        id,
        frequency: 10,
        message: 'Cron creation test',
      });
    });

    it('should call cronsRepository.save', async () => {
      const id: string = uuid();

      jest.spyOn(cronsRepository, 'create').mockReturnValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.create({
        id,
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cronsRepository.save).toHaveBeenCalledWith({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });
    });
  });

  describe('update', () => {
    it('should call cronsRepository.findOne', async () => {
      const id: string = uuid();

      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.update({
        id,
        frequency: 20,
      });

      expect(cronsRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('should call cronsRepository.save', async () => {
      const id: string = uuid();

      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.update({
        id,
        frequency: 20,
      });

      expect(cronsRepository.save).toHaveBeenCalledWith({
        id,
        frequency: 20,
        message: 'Cron creation test',
        jobs: [],
      });
    });
  });

  describe('delete', () => {
    it('should call cronsRepository.findOne', async () => {
      const id: string = uuid();

      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.delete(id);

      expect(cronsRepository.findOne).toHaveBeenCalledWith(id);
    });

    it('should call cronsRepository.remove', async () => {
      const id: string = uuid();

      jest.spyOn(cronsRepository, 'findOne').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronService.delete(id);

      expect(cronsRepository.remove).toHaveBeenCalledWith({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });
    });
  });
});
