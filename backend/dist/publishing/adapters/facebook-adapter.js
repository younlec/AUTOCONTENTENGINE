"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookAdapter = void 0;
const common_1 = require("@nestjs/common");
class FacebookAdapter {
    constructor() {
        this.logger = new common_1.Logger(FacebookAdapter.name);
    }
    async publish(_content, _accessToken, _metadata) {
        this.logger.log('Publishing to Facebook (mock)');
        return {
            success: true,
            platformPostId: `fb_${Date.now()}`,
            url: `https://facebook.com/posts/mock_${Date.now()}`,
        };
    }
}
exports.FacebookAdapter = FacebookAdapter;
//# sourceMappingURL=facebook-adapter.js.map