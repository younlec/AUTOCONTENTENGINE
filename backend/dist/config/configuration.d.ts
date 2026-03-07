declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        secret: string;
        expiration: string;
    };
    openai: {
        apiKey: string | undefined;
    };
    anthropic: {
        apiKey: string | undefined;
    };
    meta: {
        appId: string | undefined;
        appSecret: string | undefined;
    };
    twitter: {
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    youtube: {
        apiKey: string | undefined;
    };
    heygen: {
        apiKey: string | undefined;
    };
};
export default _default;
