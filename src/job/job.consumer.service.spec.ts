import { Test, TestingModule } from '@nestjs/testing';
import { MailgunService } from '../mailgun/mailgun.service';
import { JobConsumerService } from './job.consumer.service';
import { JobService } from './job.service';

const CRON_ID = '046fc812-6764-4850-8657-4b30f4802544';
const JOB_ID = 'repeat:3d3d35f16a53906c841e09da946fa35b:1653071610000';
const DATE = new Date();

describe('Cron-Job Consumer Service', () => {
  let jobConsumerService: JobConsumerService;
  let mailgunService: MailgunService;
  let jobService: JobService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobConsumerService,
        {
          provide: JobService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: MailgunService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    jobConsumerService = module.get<JobConsumerService>(JobConsumerService);
    jobService = module.get<JobService>(JobService);
    mailgunService = module.get<MailgunService>(MailgunService);
  });

  it('cron-job consumer service should be defined', () => {
    expect(jobConsumerService).toBeDefined();
  });

  it('job service should be defined', () => {
    expect(jobService).toBeDefined();
  });

  it('mailgun service should be defined', () => {
    expect(mailgunService).toBeDefined();
  });

  describe('readOperationJob', () => {
    it('should call mailgunService.sendEmail', async () => {
      const job = {
        id: JOB_ID,
        name: CRON_ID,
        data: {
          message: 'Hello World!',
        },
      };

      await jobConsumerService.readOperationJob(job);

      expect(mailgunService.sendEmail).toBeCalledWith({
        message: 'Hello World!',
      });
    });

    it('should call jobService.create', async () => {
      const job = {
        id: JOB_ID,
        name: CRON_ID,
        data: {
          message: 'Hello World!',
        },
      };

      await jobConsumerService.readOperationJob(job);

      expect(jobService.create).toBeCalled();
    });
  });
});
