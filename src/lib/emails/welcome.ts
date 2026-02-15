import { SITE_CONFIG } from "@/lib/constants";

export interface WelcomeEmailProps {
  name: string;
}

/**
 * Generates the HTML for a welcome email sent to new users.
 *
 * @param name - The user's display name.
 * @returns An object with `subject` and `html` ready to pass to any email provider.
 */
export function welcomeEmail({ name }: WelcomeEmailProps): {
  subject: string;
  html: string;
} {
  const subject = `Welcome to ${SITE_CONFIG.name}!`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#09090b;">
                Welcome to ${SITE_CONFIG.name}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
                Hey ${name},
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
                Thanks for signing up. You now have access to all the core features on the Free plan.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3f3f46;">
                Head to your dashboard to get started:
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${SITE_CONFIG.url}/dashboard"
                       style="display:inline-block;padding:10px 24px;background-color:#09090b;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#a1a1aa;text-align:center;">
                ${SITE_CONFIG.name} &middot;
                <a href="${SITE_CONFIG.url}" style="color:#a1a1aa;">${SITE_CONFIG.url}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  return { subject, html };
}
