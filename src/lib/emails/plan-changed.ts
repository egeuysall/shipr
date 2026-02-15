import { SITE_CONFIG } from "@/lib/constants";

export interface PlanChangedEmailProps {
  name: string;
  previousPlan: string;
  newPlan: string;
}

/**
 * Generates an HTML email notifying the user their plan has changed.
 *
 * @param name - The user's display name.
 * @param previousPlan - The plan they were on (e.g. "free").
 * @param newPlan - The plan they switched to (e.g. "pro").
 * @returns Raw HTML string ready to send via any email provider.
 */
export function planChangedEmail({
  name,
  previousPlan,
  newPlan,
}: PlanChangedEmailProps): string {
  const isUpgrade =
    newPlan.toLowerCase() === "pro" && previousPlan.toLowerCase() === "free";

  const heading = isUpgrade ? "Welcome to Pro!" : "Your plan has been updated";

  const message = isUpgrade
    ? "You now have access to all Pro features including higher usage limits, priority support, and early access to new features."
    : `Your plan has been changed from <strong>${previousPlan}</strong> to <strong>${newPlan}</strong>. Your access has been updated immediately.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plan Updated - ${SITE_CONFIG.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">${heading}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
                Hi ${name},
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
                ${message}
              </p>
              <!-- Plan change summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:12px 16px;background-color:#f9fafb;font-size:13px;color:#6b7280;text-align:center;width:50%;">
                    Previous<br />
                    <strong style="font-size:15px;color:#111827;text-transform:capitalize;">${previousPlan}</strong>
                  </td>
                  <td style="padding:12px 4px;background-color:#f9fafb;font-size:16px;color:#9ca3af;text-align:center;width:auto;">
                    &rarr;
                  </td>
                  <td style="padding:12px 16px;background-color:#f9fafb;font-size:13px;color:#6b7280;text-align:center;width:50%;">
                    Current<br />
                    <strong style="font-size:15px;color:#111827;text-transform:capitalize;">${newPlan}</strong>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
                <tr>
                  <td align="center">
                    <a href="${SITE_CONFIG.url}/dashboard" style="display:inline-block;padding:10px 24px;background-color:#111827;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                ${SITE_CONFIG.name} · <a href="${SITE_CONFIG.url}" style="color:#9ca3af;">${SITE_CONFIG.url.replace("https://", "")}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
