"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentDiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_discovery_service_1 = require("./content-discovery.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let ContentDiscoveryController = class ContentDiscoveryController {
    constructor(contentDiscoveryService) {
        this.contentDiscoveryService = contentDiscoveryService;
    }
    fetchTrendingTopics() {
        return this.contentDiscoveryService.fetchTrendingTopics();
    }
    getTopics(page, limit) {
        return this.contentDiscoveryService.getTopics(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
    }
};
exports.ContentDiscoveryController = ContentDiscoveryController;
__decorate([
    (0, common_1.Post)('fetch'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch trending topics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentDiscoveryController.prototype, "fetchTrendingTopics", null);
__decorate([
    (0, common_1.Get)('topics'),
    (0, swagger_1.ApiOperation)({ summary: 'List discovered topics' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ContentDiscoveryController.prototype, "getTopics", null);
exports.ContentDiscoveryController = ContentDiscoveryController = __decorate([
    (0, swagger_1.ApiTags)('content-discovery'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('content-discovery'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [content_discovery_service_1.ContentDiscoveryService])
], ContentDiscoveryController);
//# sourceMappingURL=content-discovery.controller.js.map