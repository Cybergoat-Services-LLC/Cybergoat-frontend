import nodemailer from 'nodemailer';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Free-text submitted through public forms ends up interpolated into email
// HTML - without escaping, a name like `<a href="...">Confirm Payment</a>`
// renders as a real clickable element in the recipient's inbox.
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_SENDER_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.error('Mailer not configured: GMAIL_SENDER_EMAIL/GMAIL_APP_PASSWORD missing');
    return false;
  }

  try {
    await t.sendMail({
      from: `CyberGOAT Notifications <${process.env.GMAIL_SENDER_EMAIL}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return true;
  } catch (err) {
    console.error('Failed to send notification email:', err);
    return false;
  }
}
