import { Test, TestingModule } from '@nestjs/testing';
// import mockMailgun from 'mailgun.js';
// import * as formData from 'form-data';
import { MailgunService } from './mailgun.service';
// import Options from 'mailgun.js/interfaces/Options';

// jest.mock('mailgun.js', () => {
//   class mockMailgun {
//     constructor(private formData: FormData) {}
//     client(options: Options) {
//       return {
//         messages: jest.fn().mockReturnThis(),
//         send: jest.fn(),
//       };
//     }
//   }

//   return jest.fn(() => mockMailgun);
// });

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
