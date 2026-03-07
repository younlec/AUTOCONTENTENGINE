"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeAdapter = void 0;
const common_1 = require("@nestjs/common");
class YoutubeAdapter {
    constructor() {
        this.logger = new common_1.Logger(YoutubeAdapter.name);
    }
    async publish(_content, _accessToken, _metadata) {
        this.logger.log('Publishing to YouTube (mock)');
        return {
            success: true,
            platformPostId: `yt_${Date.now()}`,
            url: `https://youtube.com/watch?v=mock_${Date.now()}`,
        };
    }
}
exports.YoutubeAdapter = YoutubeAdapter;
//# sourceMappingURL=youtube-adapter.js.map