import { Test, TestingModule } from '@nestjs/testing';
import { MailgunService } from './mailgun.service';

describe('Mailgun Service', () => {
  let mailgunService: MailgunService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailgunService],
    }).compile();

    mailgunService = module.get<MailgunService>(MailgunService);
  });

  it('mailgun service should be defined', () => {
    expect(mailgunService).toBeDefined();
  });

  it('MAILGUN_APIKEY should be defined', () => {
    expect(process.env.MAILGUN_APIKEY).toBeDefined();
  });

  it('MAILGUN_DOMAIN should be defined', () => {
    expect(process.env.MAILGUN_DOMAIN).toBeDefined();
  });

  it('MAILGUN_SENDER should be defined', () => {
    expect(process.env.MAILGUN_SENDER).toBeDefined();
  });
  it('MAILGUN_RECEIVER should be defined', () => {
    expect(process.env.MAILGUN_RECEIVER).toBeDefined();
  });

  describe('send Email', () => {
    it('should call mailgun.messages.create', async () => {
      const res = await mailgunService.sendEmail({
        message: 'Hello World!',
      });

      expect(res.status).toBe(200);
    });
  });
});
