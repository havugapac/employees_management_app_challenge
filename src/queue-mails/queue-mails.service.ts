import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailsService } from 'src/emails/emails.service';

@Processor('mailQueue')
@Injectable()
export class QueueMailsService extends WorkerHost {
  constructor(private readonly emailsService: EmailsService) {
    super();
  }

  async process(job: Job) {
    return this.handleSendEmail(job);
  }

  private async handleSendEmail(job: Job) {
    const { email, subject, from, context, template } = job.data;
    await this.emailsService.sendMail(email, subject, from, context, template);
  }
}
