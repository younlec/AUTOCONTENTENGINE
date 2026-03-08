import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ContentDiscoveryController } from './content-discovery.controller';
import { ContentDiscoveryService } from './content-discovery.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'content-discovery' }),
    EventsModule,
  ],
  controllers: [ContentDiscoveryController],
  providers: [ContentDiscoveryService],
  exports: [ContentDiscoveryService],
})
export class ContentDiscoveryModule {}
