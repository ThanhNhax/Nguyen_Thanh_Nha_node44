import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    // đọc file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
