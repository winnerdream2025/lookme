const BASE_STYLE = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;padding:40px 16px;`;
const CARD_STYLE = `background:#fff;border-radius:12px;padding:32px;max-width:520px;margin:0 auto;`;
const BRAND = `<div style="font-size:20px;font-weight:700;color:#0a0a0a;margin-bottom:24px;">LookMe</div>`;
const FOOTER = `<div style="text-align:center;font-size:12px;color:#aaa;margin-top:24px;">© ${new Date().getFullYear()} LookMe · All rights reserved</div>`;

function btn(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:16px 0;">${label}</a>`;
}

export function passwordResetEmail(resetLink: string) {
  const html = `<div style="${BASE_STYLE}"><div style="${CARD_STYLE}">${BRAND}
    <h2 style="font-size:20px;font-weight:700;color:#0a0a0a;margin:0 0 8px;">Reset your password</h2>
    <p style="font-size:14px;color:#555;margin:0 0 24px;">We received a request to reset the password for your LookMe account. Click the button below to choose a new password. This link expires in 1 hour.</p>
    ${btn("Reset Password", resetLink)}
    <p style="font-size:12px;color:#999;margin-top:16px;">If you didn't request this, you can safely ignore this email.</p>
    ${FOOTER}
  </div></div>`;
  const text = `Reset your LookMe password\n\nClick here: ${resetLink}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`;
  return { subject: "Reset your LookMe password", html, text };
}

export function orderConfirmationEmail(opts: {
  guestName?: string;
  service: string;
  platform: string;
  quantity: number;
  totalPrice: number;
  trackingToken: string;
  baseUrl: string;
}) {
  const dashboardLink = `${opts.baseUrl}/register?token=${opts.trackingToken}`;
  const trackLink = `${opts.baseUrl}/track/${opts.trackingToken}`;
  const name = opts.guestName || "there";
  const html = `<div style="${BASE_STYLE}"><div style="${CARD_STYLE}">${BRAND}
    <h2 style="font-size:20px;font-weight:700;color:#0a0a0a;margin:0 0 8px;">Order confirmed! 🎉</h2>
    <p style="font-size:14px;color:#555;margin:0 0 24px;">Hi ${name}, your order is being processed.</p>
    <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#999;">ORDER SUMMARY</p>
      <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#0a0a0a;">${opts.platform} — ${opts.service}</p>
      <p style="margin:0;font-size:14px;color:#555;">${opts.quantity} units · $${opts.totalPrice.toFixed(2)}</p>
    </div>
    <p style="font-size:14px;color:#555;margin:0 0 8px;">Create a free account to track your order in your personal dashboard:</p>
    ${btn("View My Dashboard", dashboardLink)}
    <p style="font-size:13px;color:#aaa;margin-top:8px;">Or <a href="${trackLink}" style="color:#555;">track without an account</a></p>
    ${FOOTER}
  </div></div>`;
  const text = `Your LookMe order is confirmed!\n\n${opts.platform} — ${opts.service}\n${opts.quantity} units · $${opts.totalPrice.toFixed(2)}\n\nTrack your order: ${trackLink}\nCreate account to manage all orders: ${dashboardLink}`;
  return { subject: `Your order is confirmed — ${opts.platform} ${opts.service}`, html, text };
}

export function contactNotificationEmail(opts: {
  fromEmail: string;
  fromName?: string;
  orderId?: string;
  message: string;
  adminEmail: string;
}) {
  const html = `<div style="${BASE_STYLE}"><div style="${CARD_STYLE}">${BRAND}
    <h2 style="font-size:20px;font-weight:700;color:#0a0a0a;margin:0 0 8px;">New contact message</h2>
    <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:13px;color:#999;">FROM</p>
      <p style="margin:0;font-size:14px;color:#0a0a0a;">${opts.fromName || "Unknown"} &lt;${opts.fromEmail}&gt;</p>
      ${opts.orderId ? `<p style="margin:4px 0 0;font-size:13px;color:#777;">Order ID: ${opts.orderId.slice(0, 8).toUpperCase()}</p>` : ""}
    </div>
    <div style="background:#f8f8f8;border-radius:8px;padding:16px;">
      <p style="margin:0 0 4px;font-size:13px;color:#999;">MESSAGE</p>
      <p style="margin:0;font-size:14px;color:#0a0a0a;white-space:pre-wrap;">${opts.message}</p>
    </div>
    ${FOOTER}
  </div></div>`;
  const text = `New contact from ${opts.fromEmail}:\n\n${opts.message}`;
  return { subject: `Contact from ${opts.fromEmail}`, html, text, to: opts.adminEmail };
}
