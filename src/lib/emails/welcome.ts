import { SITE_CONFIG } from "@/lib/constants";
import { escapeHtml, normalizeEmailToken } from "./escape";

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
  const subject = `Welcome to ${SITE_CONFIG.name}`;
  const safeSubject = escapeHtml(subject);
  const safeName = escapeHtml(normalizeEmailToken(name));
  const safeSiteName = escapeHtml(SITE_CONFIG.name);
  const safeSiteUrl = escapeHtml(SITE_CONFIG.url);
  const safeSiteHost = escapeHtml(SITE_CONFIG.url.replace("https://", ""));

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo / Brand -->
          <tr>
            <td style="padding-bottom:32px;">
              <h2 style="margin:0;font-size:20px;font-weight:600;color:#000000;letter-spacing:-0.01em;">
                ${safeSiteName}
              </h2>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:32px;">
              <div style="height:1px;background-color:#000000;"></div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td>
              <h1 style="margin:0 0 16px 0;font-size:28px;font-weight:600;color:#000000;letter-spacing:-0.02em;line-height:1.2;">
                Welcome
              </h1>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#000000;">
                Hi ${safeName},
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#525252;">
                Thanks for joining ${safeSiteName}. Your account is ready and you have access to all Free plan features.
              </p>
              <p style="margin:0 0 32px 0;font-size:16px;line-height:1.6;color:#525252;">
                Get started by exploring your dashboard.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom:32px;">
              <a href="${safeSiteUrl}/dashboard"
                 style="display:inline-block;padding:12px 24px;background-color:#000000;color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;border-radius:6px;letter-spacing:-0.01em;">
                Go to Dashboard →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:24px;">
              <div style="height:1px;background-color:#e5e5e5;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#737373;">
                ${safeSiteName}<br/>
                <a href="${safeSiteUrl}" style="color:#737373;text-decoration:none;">${safeSiteHost}</a>
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
