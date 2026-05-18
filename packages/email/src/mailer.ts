import nodemailer, { type Transporter } from "nodemailer";

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail(options: MailOptions): Promise<boolean> {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || "noreply@lookme.io";
  const transport = getTransporter();

  if (!transport) {
    console.log("\n📧 [EMAIL - NO SMTP] ─────────────────────────────");
    console.log(`  To:      ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Body:    ${options.text ?? "(html only)"}`);
    console.log("──────────────────────────────────────────────────\n");
    return false;
  }

  await transport.sendMail({ from, ...options });
  return true;
}
