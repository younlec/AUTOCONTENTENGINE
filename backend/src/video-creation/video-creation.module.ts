import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VideoCreationController } from './video-creation.controller';
import { VideoCreationService } from './video-creation.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-creation',
    }),
  ],
  controllers: [VideoCreationController],
  providers: [VideoCreationService],
  exports: [VideoCreationService],
})
export class VideoCreationModule {}
