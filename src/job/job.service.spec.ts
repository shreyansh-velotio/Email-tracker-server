import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CronService } from '../cron/cron.service';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { JobService } from './job.service';

describe('Job Service', () => {
  let jobService: JobService;
  let cronService: CronService;
  let jobRepository: Repository<Job>;

  const JOB_REPOSITORY_TOKEN = getRepositoryToken(Job);
  const CRON_ID = '046fc812-6764-4850-8657-4b30f4802544';
  const JOB_ID = 'repeat:3d3d35f16a53906c841e09da946fa35b:1653071610000';
  const DATE = new Date();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        // mocking the cronsRepository functions
        {
          provide: JOB_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: CronService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
    cronService = module.get<CronService>(CronService);
    jobRepository = module.get<Repository<Job>>(JOB_REPOSITORY_TOKEN);
  });

  it('job service should be defined', () => {
    expect(jobService).toBeDefined();
  });

  it('cron service should be defined', () => {
    expect(cronService).toBeDefined();
  });

  it('job repository should be defined', () => {
    expect(jobRepository).toBeDefined();
  });

  describe('create', () => {
    it('should call jobRepository.create', async () => {
      jest.spyOn(jobRepository, 'create').mockReturnValueOnce({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: {
          id: CRON_ID,
          message: 'Cron creation test',
          frequency: 10,
          jobs: [],
        },
      });

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await jobService.create(
        JOB_ID,
        CRON_ID,
        process.env.MAILGUN_SENDER,
        process.env.MAILGUN_RECEIVER,
        DATE,
        true,
      );

      expect(jobRepository.create).toHaveBeenCalledWith({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
      });
    });

    it('should call cronService.getById', async () => {
      jest.spyOn(jobRepository, 'create').mockReturnValueOnce({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: {
          id: CRON_ID,
          message: 'Cron creation test',
          frequency: 10,
          jobs: [],
        },
      });

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await jobService.create(
        JOB_ID,
        CRON_ID,
        process.env.MAILGUN_SENDER,
        process.env.MAILGUN_RECEIVER,
        DATE,
        true,
      );

      expect(cronService.getById).toHaveBeenCalledWith(CRON_ID);
    });

    it('should call jobRepository.save', async () => {
      jest.spyOn(jobRepository, 'create').mockReturnValueOnce({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: {
          id: CRON_ID,
          message: 'Cron creation test',
          frequency: 10,
          jobs: [],
        },
      });

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      await jobService.create(
        JOB_ID,
        CRON_ID,
        process.env.MAILGUN_SENDER,
        process.env.MAILGUN_RECEIVER,
        DATE,
        true,
      );

      expect(jobRepository.save).toHaveBeenCalledWith({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: {
          id: CRON_ID,
          message: 'Cron creation test',
          frequency: 10,
          jobs: [],
        },
      });
    });
  });

  describe('getJobHistory', () => {
    it('should call jobRepository.find', async () => {
      jest.spyOn(jobRepository, 'find').mockResolvedValue([
        {
          id: JOB_ID,
          emailSender: process.env.MAILGUN_SENDER,
          emailReceiver: process.env.MAILGUN_RECEIVER,
          sentAt: DATE,
          isEmailSent: true,
          cron: {
            id: CRON_ID,
            message: 'Cron creation test',
            frequency: 10,
            jobs: [],
          },
        },
      ]);

      await jobService.getJobHistory(CRON_ID);

      expect(jobRepository.find).toHaveBeenCalledWith({
        where: { cron: CRON_ID },
        take: 10,
      });
    });
  });
});
