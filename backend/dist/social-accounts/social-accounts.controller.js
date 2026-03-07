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
exports.SocialAccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const social_accounts_service_1 = require("./social-accounts.service");
const connect_account_dto_1 = require("./dto/connect-account.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let SocialAccountsController = class SocialAccountsController {
    constructor(socialAccountsService) {
        this.socialAccountsService = socialAccountsService;
    }
    connect(userId, dto) {
        return this.socialAccountsService.connect(userId, dto);
    }
    findAll(userId) {
        return this.socialAccountsService.findAllByUser(userId);
    }
    disconnect(userId, id) {
        return this.socialAccountsService.disconnect(userId, id);
    }
};
exports.SocialAccountsController = SocialAccountsController;
__decorate([
    (0, common_1.Post)('connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect a social media account' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, connect_account_dto_1.ConnectAccountDto]),
    __metadata("design:returntype", void 0)
], SocialAccountsController.prototype, "connect", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List connected accounts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SocialAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Disconnect a social media account' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SocialAccountsController.prototype, "disconnect", null);
exports.SocialAccountsController = SocialAccountsController = __decorate([
    (0, swagger_1.ApiTags)('social-accounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('social-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [social_accounts_service_1.SocialAccountsService])
], SocialAccountsController);
//# sourceMappingURL=social-accounts.controller.js.map