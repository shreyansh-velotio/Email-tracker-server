import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';
import * as uuid from 'uuid';

// mocking the uuid
const UUID = '046fc812-6764-4850-8657-4b30f4802544';
jest.mock('uuid');
jest.spyOn(uuid, 'v4').mockReturnValue(UUID);

describe('Cron Producer Service', () => {
  let cronProducerService: CronProducerService;
  let cronService: CronService;
  let queue: Queue;

  const QUEUE_TOKEN = getQueueToken('email-queue');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronProducerService,
        // mocking the bull queue
        {
          provide: QUEUE_TOKEN,
          useValue: {
            add: jest.fn(),
            removeRepeatableByKey: jest.fn(),
          },
        },
        // mocking the cron service
        {
          provide: CronService,
          useValue: {
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    cronProducerService = module.get<CronProducerService>(CronProducerService);
    cronService = module.get<CronService>(CronService);
    queue = module.get<Queue>(QUEUE_TOKEN);
  });

  it('cron producer service should be defined', () => {
    expect(cronProducerService).toBeDefined();
  });

  it('cron service should be defined', () => {
    expect(cronService).toBeDefined();
  });

  it('bull queue should be defined', () => {
    expect(queue).toBeDefined();
  });

  describe('addCron', () => {
    it('should call queue.add', async () => {
      const id: string = UUID;

      jest.spyOn(uuid, 'v4').mockReturnValue(id);

      await cronProducerService.addCron({
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(queue.add).toHaveBeenCalledWith(
        id,
        {
          message: 'Cron creation test',
        },
        {
          repeat: {
            every: 10 * 1000,
            limit: 3,
          },
        },
      );
    });

    it('should call cronService.create', async () => {
      const id: string = UUID;

      await cronProducerService.addCron({
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cronService.create).toHaveBeenCalledWith({
        id,
        frequency: 10,
        message: 'Cron creation test',
      });
    });
  });

  describe('updateCron', () => {
    it('should call cronService.getById', async () => {
      const id: string = UUID;

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronProducerService.updateCron({
        id,
        frequency: 20,
      });

      expect(cronService.getById).toHaveBeenCalledWith(id);
    });

    it('should call queue.removeRepeatableByKey', async () => {
      const id: string = UUID;

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      const cronFullId = id + ':::' + 10000;

      await cronProducerService.updateCron({
        id,
        frequency: 20,
      });

      expect(queue.removeRepeatableByKey).toHaveBeenCalledWith(cronFullId);
    });

    it('should call queue.add', async () => {
      const id: string = UUID;

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronProducerService.updateCron({
        id,
        frequency: 20,
      });

      expect(queue.add).toHaveBeenCalledWith(
        id,
        {
          message: 'Cron creation test',
        },
        {
          repeat: {
            every: 20 * 1000,
            limit: 3,
          },
        },
      );
    });

    it('should call cronService.update', async () => {
      const id: string = UUID;

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await cronProducerService.updateCron({
        id,
        frequency: 20,
      });

      expect(cronService.update).toHaveBeenCalledWith({
        id,
        frequency: 20,
      });
    });
  });
});
