"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bullmq_1 = require("@nestjs/bullmq");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const social_accounts_module_1 = require("./social-accounts/social-accounts.module");
const content_discovery_module_1 = require("./content-discovery/content-discovery.module");
const ai_generation_module_1 = require("./ai-generation/ai-generation.module");
const video_creation_module_1 = require("./video-creation/video-creation.module");
const content_module_1 = require("./content/content.module");
const scheduling_module_1 = require("./scheduling/scheduling.module");
const publishing_module_1 = require("./publishing/publishing.module");
const analytics_module_1 = require("./analytics/analytics.module");
const monetization_module_1 = require("./monetization/monetization.module");
const events_module_1 = require("./events/events.module");
const configuration_1 = require("./config/configuration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            bullmq_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            social_accounts_module_1.SocialAccountsModule,
            content_discovery_module_1.ContentDiscoveryModule,
            ai_generation_module_1.AiGenerationModule,
            video_creation_module_1.VideoCreationModule,
            content_module_1.ContentModule,
            scheduling_module_1.SchedulingModule,
            publishing_module_1.PublishingModule,
            analytics_module_1.AnalyticsModule,
            monetization_module_1.MonetizationModule,
            events_module_1.EventsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map