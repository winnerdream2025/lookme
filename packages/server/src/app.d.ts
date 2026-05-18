import { Router, type Express } from "express";
interface CreateAppOptions {
    serviceName: string;
    routes: {
        path: string;
        router: Router;
    }[];
}
export declare function createApp(options: CreateAppOptions): Express;
export {};
//# sourceMappingURL=app.d.ts.map