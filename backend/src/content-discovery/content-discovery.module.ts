import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ContentDiscoveryController } from './content-discovery.controller';
import { ContentDiscoveryService } from './content-discovery.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'content-discovery',
    }),
  ],
  controllers: [ContentDiscoveryController],
  providers: [ContentDiscoveryService],
  exports: [ContentDiscoveryService],
})
export class ContentDiscoveryModule {}
