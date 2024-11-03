import { Module } from '@nestjs/common';
import exp from 'constants';
import { KeyService } from './key.service';

@Module({
  providers: [KeyService],
  exports: [KeyService],
})
export class KeyModule {}
