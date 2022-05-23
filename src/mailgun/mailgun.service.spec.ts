import { Test, TestingModule } from '@nestjs/testing';
import Mailgun from 'mailgun.js';
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
});
