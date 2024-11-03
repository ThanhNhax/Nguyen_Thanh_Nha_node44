import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [CloudinaryModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class ShareModule {}
