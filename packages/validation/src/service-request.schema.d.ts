import { z } from "zod";
export declare const createServiceRequestSchema: z.ZodObject<{
    projectName: z.ZodString;
    platformName: z.ZodString;
    platformUrl: z.ZodOptional<z.ZodString>;
    requestedAction: z.ZodEnum<["reviews", "followers", "installs", "comments", "other"]>;
    quantity: z.ZodOptional<z.ZodString>;
    deadline: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    genderPref: z.ZodOptional<z.ZodEnum<["MALE", "FEMALE", "ANY"]>>;
    budgetRange: z.ZodOptional<z.ZodString>;
    contactMethod: z.ZodEnum<["email", "telegram"]>;
    contactHandle: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    projectName: string;
    platformName: string;
    requestedAction: "reviews" | "followers" | "installs" | "comments" | "other";
    contactMethod: "email" | "telegram";
    quantity?: string | undefined;
    platformUrl?: string | undefined;
    deadline?: string | undefined;
    region?: string | undefined;
    genderPref?: "MALE" | "FEMALE" | "ANY" | undefined;
    budgetRange?: string | undefined;
    contactHandle?: string | undefined;
    notes?: string | undefined;
    source?: string | undefined;
}, {
    projectName: string;
    platformName: string;
    requestedAction: "reviews" | "followers" | "installs" | "comments" | "other";
    contactMethod: "email" | "telegram";
    quantity?: string | undefined;
    platformUrl?: string | undefined;
    deadline?: string | undefined;
    region?: string | undefined;
    genderPref?: "MALE" | "FEMALE" | "ANY" | undefined;
    budgetRange?: string | undefined;
    contactHandle?: string | undefined;
    notes?: string | undefined;
    source?: string | undefined;
}>;
export declare const updateServiceRequestSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["NEW", "TRIAGED", "PROPOSED", "WON", "CLOSED"]>>;
    internalNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "NEW" | "TRIAGED" | "PROPOSED" | "WON" | "CLOSED" | undefined;
    internalNotes?: string | undefined;
}, {
    status?: "NEW" | "TRIAGED" | "PROPOSED" | "WON" | "CLOSED" | undefined;
    internalNotes?: string | undefined;
}>;
export declare const listServiceRequestsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodEnum<["NEW", "TRIAGED", "PROPOSED", "WON", "CLOSED"]>>;
    mine: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status?: "NEW" | "TRIAGED" | "PROPOSED" | "WON" | "CLOSED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    mine?: boolean | undefined;
}, {
    status?: "NEW" | "TRIAGED" | "PROPOSED" | "WON" | "CLOSED" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    mine?: boolean | undefined;
}>;
export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;
export type UpdateServiceRequestInput = z.infer<typeof updateServiceRequestSchema>;
export type ListServiceRequestsInput = z.infer<typeof listServiceRequestsSchema>;
//# sourceMappingURL=service-request.schema.d.ts.map