"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentDiscoveryModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const content_discovery_controller_1 = require("./content-discovery.controller");
const content_discovery_service_1 = require("./content-discovery.service");
let ContentDiscoveryModule = class ContentDiscoveryModule {
};
exports.ContentDiscoveryModule = ContentDiscoveryModule;
exports.ContentDiscoveryModule = ContentDiscoveryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'content-discovery',
            }),
        ],
        controllers: [content_discovery_controller_1.ContentDiscoveryController],
        providers: [content_discovery_service_1.ContentDiscoveryService],
        exports: [content_discovery_service_1.ContentDiscoveryService],
    })
], ContentDiscoveryModule);
//# sourceMappingURL=content-discovery.module.js.map