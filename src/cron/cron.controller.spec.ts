import { Test, TestingModule } from '@nestjs/testing';
import { CronController } from './cron.controller';
import { CronProducerService } from './cron.producer.service';
import { CronService } from './cron.service';

const UUID = '046fc812-6764-4850-8657-4b30f4802544';

describe('Cron controller', () => {
  let cronController: CronController;
  let cronService: CronService;
  let cronProducerService: CronProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronController],
      providers: [
        {
          provide: CronService,
          useValue: {
            getAll: jest.fn(),
          },
        },
        {
          provide: CronProducerService,
          useValue: {
            addCron: jest.fn(),
            updateCron: jest.fn(),
          },
        },
      ],
    }).compile();

    cronController = module.get<CronController>(CronController);
    cronService = module.get<CronService>(CronService);
    cronProducerService = module.get<CronProducerService>(CronProducerService);
  });

  it('cron controller should be defined', () => {
    expect(cronController).toBeDefined();
  });

  it('cron producer service should be defined', () => {
    expect(cronProducerService).toBeDefined();
  });

  it('cron service should be defined', () => {
    expect(cronService).toBeDefined();
  });

  describe('GET /cron', () => {
    it('should call cronService.getAll', async () => {
      await cronController.getCrons();

      expect(cronService.getAll).toBeCalled();
    });
  });

  describe('POST /cron', () => {
    it('should call cronProducerService.addCron', async () => {
      await cronController.addCron({
        frequency: 10,
        message: 'Cron test email',
      });

      expect(cronProducerService.addCron).toBeCalledWith({
        frequency: 10,
        message: 'Cron test email',
      });
    });
  });

  describe('PATCH /cron', () => {
    it('should call cronProducerService.updateCron', async () => {
      await cronController.updateCron({
        id: UUID,
        frequency: 10,
      });

      expect(cronProducerService.updateCron).toBeCalledWith({
        id: UUID,
        frequency: 10,
      });
    });
  });
});
