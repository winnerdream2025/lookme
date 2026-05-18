export declare function passwordResetEmail(resetLink: string): {
    subject: string;
    html: string;
    text: string;
};
export declare function orderConfirmationEmail(opts: {
    guestName?: string;
    service: string;
    platform: string;
    quantity: number;
    totalPrice: number;
    trackingToken: string;
    baseUrl: string;
}): {
    subject: string;
    html: string;
    text: string;
};
export declare function contactNotificationEmail(opts: {
    fromEmail: string;
    fromName?: string;
    orderId?: string;
    message: string;
    adminEmail: string;
}): {
    subject: string;
    html: string;
    text: string;
    to: string;
};
//# sourceMappingURL=templates.d.ts.map