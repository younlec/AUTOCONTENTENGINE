"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramAdapter = void 0;
const common_1 = require("@nestjs/common");
class InstagramAdapter {
    constructor() {
        this.logger = new common_1.Logger(InstagramAdapter.name);
    }
    async publish(_content, _accessToken, _metadata) {
        this.logger.log('Publishing to Instagram (mock)');
        return {
            success: true,
            platformPostId: `ig_${Date.now()}`,
            url: `https://instagram.com/p/mock_${Date.now()}`,
        };
    }
}
exports.InstagramAdapter = InstagramAdapter;
//# sourceMappingURL=instagram-adapter.js.map