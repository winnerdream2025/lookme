import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["worker", "client"]>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    termsAccepted: z.ZodOptional<z.ZodBoolean>;
    gender: z.ZodOptional<z.ZodEnum<["MALE", "FEMALE"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: "worker" | "client";
    firstName?: string | undefined;
    lastName?: string | undefined;
    termsAccepted?: boolean | undefined;
    gender?: "MALE" | "FEMALE" | undefined;
}, {
    email: string;
    password: string;
    role: "worker" | "client";
    firstName?: string | undefined;
    lastName?: string | undefined;
    termsAccepted?: boolean | undefined;
    gender?: "MALE" | "FEMALE" | undefined;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
//# sourceMappingURL=auth.schema.d.ts.map