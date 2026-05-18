export interface MailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare function sendEmail(options: MailOptions): Promise<boolean>;
//# sourceMappingURL=mailer.d.ts.map