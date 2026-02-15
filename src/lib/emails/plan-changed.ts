import { SITE_CONFIG } from "@/lib/constants";

export interface PlanChangedEmailProps {
  name: string;
  previousPlan: string;
  newPlan: string;
}

/**
 * Generates an HTML email notifying the user their plan has changed.
 * Vercel-style minimal black and white design.
 *
 * @param name - The user's display name.
 * @param previousPlan - The plan they were on (e.g. "free").
 * @param newPlan - The plan they switched to (e.g. "pro").
 * @returns An object with `subject` and `html` ready to pass to any email provider.
 */
export function planChangedEmail({
  name,
  previousPlan,
  newPlan,
}: PlanChangedEmailProps): { subject: string; html: string } {
  const isUpgrade =
    newPlan.toLowerCase() === "pro" && previousPlan.toLowerCase() === "free";

  const heading = isUpgrade ? "Welcome to Pro" : "Plan Updated";

  const message = isUpgrade
    ? "You now have access to all Pro features including higher usage limits, priority support, and early access to new features."
    : `Your plan has been changed from ${previousPlan} to ${newPlan}. Your access has been updated immediately.`;

  const subject = `Plan Updated - ${SITE_CONFIG.name}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo / Brand -->
          <tr>
            <td style="padding-bottom:32px;">
              <h2 style="margin:0;font-size:18px;font-weight:600;color:#000000;letter-spacing:-0.01em;">
                ${SITE_CONFIG.name}
              </h2>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:24px;font-weight:600;color:#000000;letter-spacing:-0.02em;line-height:1.2;">
                ${heading}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#525252;">
                Hi ${name},
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#525252;">
                ${message}
              </p>
            </td>
          </tr>

          <!-- Plan Change Box -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:6px;">
                <tr>
                  <td style="padding:20px;text-align:center;border-right:1px solid #e5e5e5;">
                    <div style="font-size:12px;color:#737373;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Previous</div>
                    <div style="font-size:16px;font-weight:600;color:#000000;text-transform:capitalize;">${previousPlan}</div>
                  </td>
                  <td style="padding:20px;text-align:center;width:60px;">
                    <div style="font-size:18px;color:#a3a3a3;">→</div>
                  </td>
                  <td style="padding:20px;text-align:center;border-left:1px solid #e5e5e5;">
                    <div style="font-size:12px;color:#737373;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Current</div>
                    <div style="font-size:16px;font-weight:600;color:#000000;text-transform:capitalize;">${newPlan}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom:48px;">
              <a href="${SITE_CONFIG.url}/dashboard"
                 style="display:inline-block;padding:10px 20px;background-color:#000000;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;border:1px solid #000000;">
                Go to Dashboard
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:24px;border-top:1px solid #e5e5e5;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#a3a3a3;">
                ${SITE_CONFIG.name} · ${SITE_CONFIG.url.replace("https://", "")}
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
