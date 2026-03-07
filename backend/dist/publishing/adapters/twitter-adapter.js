"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterAdapter = void 0;
const common_1 = require("@nestjs/common");
class TwitterAdapter {
    constructor() {
        this.logger = new common_1.Logger(TwitterAdapter.name);
    }
    async publish(_content, _accessToken, _metadata) {
        this.logger.log('Publishing to Twitter (mock)');
        return {
            success: true,
            platformPostId: `tw_${Date.now()}`,
            url: `https://twitter.com/i/status/mock_${Date.now()}`,
        };
    }
}
exports.TwitterAdapter = TwitterAdapter;
//# sourceMappingURL=twitter-adapter.js.map