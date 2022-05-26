import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';
import * as uuid from 'uuid';
import { CreateCronDto } from './dtos/create-cron.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateCronDto } from './dtos/update-cron.dto';

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
    jest.clearAllMocks();

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
      jest.spyOn(uuid, 'v4').mockReturnValue('1');

      await cronProducerService.addCron({
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(queue.add).toHaveBeenCalledWith(
        '1',
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
      jest.spyOn(uuid, 'v4').mockReturnValue('1');

      await cronProducerService.addCron({
        frequency: 10,
        message: 'Cron creation test',
      });

      expect(cronService.create).toHaveBeenCalledWith({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
      });
    });

    it('should throw exception if queue.add throws exception', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValue('1');
      jest.spyOn(queue, 'add').mockRejectedValueOnce(new Error());

      try {
        await cronProducerService.addCron({
          frequency: 10,
          message: 'Cron creation test',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(cronService.create).not.toHaveBeenCalled();
      }
    });

    it('should throw exception if cronService.create throws exception', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('1');
      jest.spyOn(queue, 'add').mockResolvedValueOnce(undefined);
      jest.spyOn(cronService, 'create').mockRejectedValueOnce(new Error());

      try {
        await cronProducerService.addCron({
          frequency: 10,
          message: 'Cron creation test',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should add cron to the queue', async () => {
      const createCronDto: CreateCronDto = {
        frequency: 10,
        message: 'Cron creation test',
      };

      jest.spyOn(uuid, 'v4').mockReturnValueOnce('1');
      jest.spyOn(queue, 'add').mockResolvedValueOnce(undefined);
      jest.spyOn(cronService, 'create').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      const cron = await cronProducerService.addCron(createCronDto);
      expect(cron.id).toBe('1');
      expect(cron.frequency).toBe(10);
      expect(cron.message).toBe('Cron creation test');
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

    it('should throw exception if cronService.getById throws exception', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 20,
      };
      jest.spyOn(cronService, 'getById').mockRejectedValueOnce(new Error());

      try {
        await cronProducerService.updateCron(updateCronDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(queue.removeRepeatableByKey).not.toHaveBeenCalled();
        expect(queue.add).not.toHaveBeenCalled();
        expect(cronService.update).not.toHaveBeenCalled();
      }
    });

    it('should throw exception if queue.removeRepeatableByKey throws exception', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 20,
      };
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron test email',
        jobs: [],
      });
      jest
        .spyOn(queue, 'removeRepeatableByKey')
        .mockRejectedValueOnce(new Error());

      try {
        await cronProducerService.updateCron(updateCronDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(queue.add).not.toHaveBeenCalled();
        expect(cronService.update).not.toHaveBeenCalled();
      }
    });

    it('should throw exception if queue.add throws exception', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 20,
      };
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron test email',
        jobs: [],
      });
      jest
        .spyOn(queue, 'removeRepeatableByKey')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(queue, 'add').mockRejectedValueOnce(new Error());

      try {
        await cronProducerService.updateCron(updateCronDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(cronService.update).not.toHaveBeenCalled();
      }
    });

    it('should throw exception if cronService.update throws exception', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 20,
      };
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron test email',
        jobs: [],
      });
      jest
        .spyOn(queue, 'removeRepeatableByKey')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(queue, 'add').mockResolvedValueOnce(undefined);
      jest.spyOn(cronService, 'update').mockRejectedValueOnce(new Error());

      try {
        await cronProducerService.updateCron(updateCronDto);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should throw NotFoundException when cronService.getById is unable to find cron', async () => {
      const id: string = UUID;

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce(undefined);

      try {
        await cronProducerService.updateCron({
          id,
          frequency: 20,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should update the cron frequency', async () => {
      const updateCronDto: UpdateCronDto = {
        id: '1',
        frequency: 20,
      };
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: '1',
        frequency: 10,
        message: 'Cron test email',
        jobs: [],
      });
      jest
        .spyOn(queue, 'removeRepeatableByKey')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(queue, 'add').mockResolvedValueOnce(undefined);
      jest.spyOn(cronService, 'update').mockResolvedValueOnce({
        id: '1',
        frequency: 20,
        message: 'Cron test email',
        jobs: [],
      });

      const updatedCron = await cronProducerService.updateCron(updateCronDto);
      expect(updatedCron.frequency).toBe(20);
    });
  });
});
