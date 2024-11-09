import { Module } from '@nestjs/common';
import { MailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class EmailModule {}
