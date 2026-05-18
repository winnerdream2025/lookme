import "dotenv/config";
export declare const config: {
    readonly env: string;
    readonly isDev: boolean;
    readonly isProd: boolean;
    readonly db: {
        readonly url: string;
    };
    readonly redis: {
        readonly url: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly refreshSecret: string;
        readonly accessExpiry: string;
        readonly refreshExpiry: string;
    };
    readonly stripe: {
        readonly secretKey: string;
        readonly webhookSecret: string;
    };
    readonly platform: {
        readonly feePercent: number;
        readonly minDeposit: number;
        readonly minWithdrawal: number;
    };
    readonly ports: {
        readonly gateway: number;
        readonly auth: number;
        readonly catalog: number;
        readonly order: number;
        readonly task: number;
        readonly wallet: number;
    };
    readonly cors: {
        readonly origins: string[];
    };
};
export type Config = typeof config;
//# sourceMappingURL=index.d.ts.map