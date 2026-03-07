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
var AiGenerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGenerationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let AiGenerationService = AiGenerationService_1 = class AiGenerationService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(AiGenerationService_1.name);
    }
    async generateContent(userId, dto) {
        let topic = null;
        if (dto.topicId) {
            topic = await this.prisma.topic.findUnique({
                where: { id: dto.topicId },
            });
        }
        const prompt = dto.prompt || topic?.title || 'Generate engaging social media content';
        let generatedContent;
        if (dto.provider === 'openai') {
            generatedContent = await this.generateWithOpenAI(prompt, dto.type);
        }
        else {
            generatedContent = await this.generateWithAnthropic(prompt, dto.type);
        }
        const content = await this.prisma.content.create({
            data: {
                userId,
                topicId: dto.topicId,
                type: dto.type,
                title: this.generateSeoTitle(prompt),
                body: generatedContent,
                platform: dto.platform,
                metadata: {
                    provider: dto.provider,
                    hashtags: this.generateHashtags(prompt),
                },
            },
        });
        return content;
    }
    async generateWithOpenAI(prompt, type) {
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey || apiKey === 'sk-placeholder') {
            this.logger.warn('OpenAI API key not configured, returning mock content');
            return this.getMockContent(prompt, type);
        }
        try {
            const OpenAI = (await Promise.resolve().then(() => require('openai'))).default;
            const client = new OpenAI({ apiKey });
            const response = await client.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert social media content creator. Generate ${type.toLowerCase()} content.`,
                    },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 1000,
            });
            return (response.choices[0]?.message?.content ||
                this.getMockContent(prompt, type));
        }
        catch (error) {
            this.logger.error('OpenAI generation failed', error);
            return this.getMockContent(prompt, type);
        }
    }
    async generateWithAnthropic(prompt, type) {
        const apiKey = this.configService.get('ANTHROPIC_API_KEY');
        if (!apiKey || apiKey === 'sk-ant-placeholder') {
            this.logger.warn('Anthropic API key not configured, returning mock content');
            return this.getMockContent(prompt, type);
        }
        try {
            const Anthropic = (await Promise.resolve().then(() => require('@anthropic-ai/sdk'))).default;
            const client = new Anthropic({ apiKey });
            const message = await client.messages.create({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert social media content creator. Generate ${type.toLowerCase()} content for: ${prompt}`,
                    },
                ],
            });
            const textBlock = message.content.find((block) => block.type === 'text');
            return textBlock?.text || this.getMockContent(prompt, type);
        }
        catch (error) {
            this.logger.error('Anthropic generation failed', error);
            return this.getMockContent(prompt, type);
        }
    }
    getMockContent(prompt, type) {
        const mockContents = {
            CAPTION: `🔥 ${prompt}\n\nThis is a compelling caption that drives engagement and encourages interaction. Double tap if you agree! 💡\n\n#ContentCreation #SocialMedia #Growth`,
            THREAD: `🧵 Thread: ${prompt}\n\n1/ Let me break this down for you...\n\n2/ First, the key insight is that consistency matters more than perfection.\n\n3/ Second, understanding your audience is crucial.\n\n4/ Third, data-driven decisions always win.\n\n5/ Finally, the actionable takeaway: Start small, iterate fast, and always measure results.\n\nRetweet if this was helpful! 🔄`,
            SCRIPT: `[INTRO]\nHey everyone! Today we're diving into ${prompt}.\n\n[HOOK]\nDid you know that 90% of creators miss this one critical step?\n\n[MAIN CONTENT]\nLet me walk you through the exact process...\n\nStep 1: Research your topic thoroughly\nStep 2: Outline your key points\nStep 3: Create a compelling narrative\n\n[CTA]\nIf you found this valuable, smash that like button and subscribe for more content like this!`,
            SHORT: `[0:00] Hook: You won't believe what happens when...\n[0:03] ${prompt}\n[0:15] The surprising result\n[0:25] CTA: Follow for more tips!\n\nDuration: 30 seconds\nFormat: Vertical 9:16`,
            REEL: `[Scene 1 - 0:00] Eye-catching visual hook\n[Scene 2 - 0:05] ${prompt} - main content\n[Scene 3 - 0:20] Transformation or result\n[Scene 4 - 0:25] CTA overlay\n\nMusic: Trending audio\nDuration: 30 seconds\nFormat: Vertical 9:16`,
        };
        return mockContents[type];
    }
    generateCaption(prompt) {
        return `🔥 ${prompt}\n\nEngaging caption with call-to-action. #ContentCreation`;
    }
    generateThread(prompt) {
        return `🧵 Thread: ${prompt}\n\n1/ Key insight...\n2/ Deep dive...\n3/ Conclusion...`;
    }
    generateScript(prompt) {
        return `[INTRO] ${prompt}\n[BODY] Main content...\n[CTA] Subscribe!`;
    }
    generateHashtags(prompt) {
        const words = prompt.split(' ').slice(0, 5);
        return [
            '#ContentCreation',
            '#SocialMedia',
            '#Growth',
            ...words
                .filter((w) => w.length > 3)
                .map((w) => `#${w.replace(/[^a-zA-Z]/g, '')}`),
        ];
    }
    generateSeoTitle(prompt) {
        const title = prompt.length > 60 ? prompt.substring(0, 57) + '...' : prompt;
        return title.charAt(0).toUpperCase() + title.slice(1);
    }
};
exports.AiGenerationService = AiGenerationService;
exports.AiGenerationService = AiGenerationService = AiGenerationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AiGenerationService);
//# sourceMappingURL=ai-generation.service.js.map