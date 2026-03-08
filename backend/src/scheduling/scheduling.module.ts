import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { SchedulingProcessor } from './scheduling.processor';
import { PublishingModule } from '../publishing/publishing.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'post-scheduling' }),
    PublishingModule,
    EventsModule,
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService, SchedulingProcessor],
  exports: [SchedulingService],
})
export class SchedulingModule {}
