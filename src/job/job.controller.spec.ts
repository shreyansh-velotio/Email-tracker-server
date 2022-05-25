import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from './job.service';

const UUID = '046fc812-6764-4850-8657-4b30f4802544';

describe('Job controller', () => {
  let jobController: JobController;
  let jobService: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: {
            getJobHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    jobController = module.get<JobController>(JobController);
    jobService = module.get<JobService>(JobService);
  });

  it('job controller should be defined', () => {
    expect(jobController).toBeDefined();
  });

  it('job producer service should be defined', () => {
    expect(jobService).toBeDefined();
  });

  describe('GET /cron-job/history', () => {
    it('should call jobService.getJobHistory', async () => {
      await jobController.getJobs(UUID);

      expect(jobService.getJobHistory).toBeCalledWith(UUID);
    });
  });
});
