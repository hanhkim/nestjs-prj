import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('send-mail')
export class EmailConsumerProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const accountData = job.data;

    if (!accountData.email) {
      throw new BadRequestException('Need email register');
    }

    const result = await this.mailerService.sendMail({
      to: accountData.email,
      subject: 'Welcome to money note',
      template: './welcome',
      context: {
        email: accountData.email,
      },
    });

    console.log('result: send mail success hehehehe :>> ', result);
  }
}
