import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';
import { ContentDiscoveryModule } from './content-discovery/content-discovery.module';
import { AiGenerationModule } from './ai-generation/ai-generation.module';
import { VideoCreationModule } from './video-creation/video-creation.module';
import { ContentModule } from './content/content.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { PublishingModule } from './publishing/publishing.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MonetizationModule } from './monetization/monetization.module';
import { EventsModule } from './events/events.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SocialAccountsModule,
    ContentDiscoveryModule,
    AiGenerationModule,
    VideoCreationModule,
    ContentModule,
    SchedulingModule,
    PublishingModule,
    AnalyticsModule,
    MonetizationModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
