import { Test, TestingModule } from '@nestjs/testing';
import { MailgunService } from '../mailgun/mailgun.service';
import { JobConsumerService } from './job.consumer.service';
import { JobService } from './job.service';

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

  // describe('readOperationJob', () => {
  //   it('should call mailgunService.sendEmail', async () => {
  //     const job: Job<CronJob> =

  //     await jobConsumerService.readOperationJob(job);
  //   });
  // });
});
