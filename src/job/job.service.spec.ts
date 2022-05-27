import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CronService } from '../cron/cron.service';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { JobService } from './job.service';
import { NotFoundException } from '@nestjs/common';
import { Cron } from '../cron/entities/cron.entity';

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
        cron: undefined,
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
        cron: undefined,
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
        cron: undefined,
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

    it('should throw exception if cronService.getById throws exception', async () => {
      jest.spyOn(jobRepository, 'create').mockReturnValueOnce({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: undefined,
      });

      jest.spyOn(cronService, 'getById').mockRejectedValueOnce(new Error());

      try {
        await jobService.create(
          JOB_ID,
          CRON_ID,
          process.env.MAILGUN_SENDER,
          process.env.MAILGUN_RECEIVER,
          DATE,
          true,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(jobRepository.save).not.toHaveBeenCalled();
      }
    });

    it('should throw exception if jobRepository.save throws exception', async () => {
      jest.spyOn(jobRepository, 'create').mockReturnValueOnce({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: undefined,
      });

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      jest.spyOn(jobRepository, 'save').mockRejectedValueOnce(new Error());

      try {
        await jobService.create(
          JOB_ID,
          CRON_ID,
          process.env.MAILGUN_SENDER,
          process.env.MAILGUN_RECEIVER,
          DATE,
          true,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should create a job', async () => {
      jest.spyOn(jobRepository, 'create').mockReturnValueOnce({
        id: JOB_ID,
        emailSender: process.env.MAILGUN_SENDER,
        emailReceiver: process.env.MAILGUN_RECEIVER,
        sentAt: DATE,
        isEmailSent: true,
        cron: undefined,
      });

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        frequency: 10,
        message: 'Cron creation test',
        jobs: [],
      });

      jest.spyOn(jobRepository, 'save').mockResolvedValueOnce({
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

      const job = await jobService.create(
        JOB_ID,
        CRON_ID,
        process.env.MAILGUN_SENDER,
        process.env.MAILGUN_RECEIVER,
        DATE,
        true,
      );
      expect(job).toEqual({
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
    it('should call cronService.getById', async () => {
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        message: 'Cron creation test',
        frequency: 10,
        jobs: [],
      });

      jest.spyOn(jobRepository, 'find').mockResolvedValueOnce([
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
      expect(cronService.getById).toHaveBeenCalledWith(CRON_ID);
    });

    it('should call jobRepository.find', async () => {
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        message: 'Cron creation test',
        frequency: 10,
        jobs: [],
      });

      jest.spyOn(jobRepository, 'find').mockResolvedValueOnce([
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

    it('should throw exception if cronService.getById throws exception', async () => {
      jest.spyOn(cronService, 'getById').mockRejectedValueOnce(new Error());

      try {
        await jobService.getJobHistory(CRON_ID);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(jobRepository.find).not.toHaveBeenCalled();
      }
    });

    it('should throw exception if jobRepository.find throws exception', async () => {
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        message: 'Cron creation test',
        frequency: 10,
        jobs: [],
      });

      jest.spyOn(jobRepository, 'find').mockRejectedValueOnce(new Error());

      try {
        await jobService.getJobHistory(CRON_ID);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should call throw NotFoundException when cron with id does not exist', async () => {
      jest.spyOn(cronService, 'getById').mockResolvedValueOnce(undefined);

      try {
        await jobService.getJobHistory(CRON_ID);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should get the job history', async () => {
      const cron: Cron = {
        id: '1',
        frequency: 10,
        message: 'Cron test email',
        jobs: [],
      };
      const history: Job[] = [
        {
          id: '1',
          emailSender: process.env.MAILGUN_SENDER,
          emailReceiver: process.env.MAILGUN_RECEIVER,
          sentAt: DATE,
          isEmailSent: true,
          cron,
        },
        {
          id: '2',
          emailSender: process.env.MAILGUN_SENDER,
          emailReceiver: process.env.MAILGUN_RECEIVER,
          sentAt: DATE,
          isEmailSent: true,
          cron,
        },
        {
          id: '3',
          emailSender: process.env.MAILGUN_SENDER,
          emailReceiver: process.env.MAILGUN_RECEIVER,
          sentAt: DATE,
          isEmailSent: true,
          cron,
        },
      ];

      jest.spyOn(cronService, 'getById').mockResolvedValueOnce({
        id: CRON_ID,
        message: 'Cron creation test',
        frequency: 10,
        jobs: [],
      });

      jest.spyOn(jobRepository, 'find').mockResolvedValueOnce(history);

      const jobHistory = await jobService.getJobHistory('1');

      expect(jobHistory).toEqual(history);
    });
  });
});
