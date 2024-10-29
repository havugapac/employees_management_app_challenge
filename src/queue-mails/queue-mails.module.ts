import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { QueueMailsService } from './queue-mails.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
  ],
  providers: [QueueMailsService, EmailsService],
  exports: [QueueMailsService, BullModule],
})
export class QueuemailsModule {}
