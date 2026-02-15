import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends a transactional email via Resend.
 *
 * Requires `RESEND_API_KEY` env var. Optionally set `RESEND_FROM_EMAIL`
 * to override the default sender address.
 *
 * @param options.to - Recipient email address.
 * @param options.subject - Email subject line.
 * @param options.html - HTML body (use templates from this directory).
 * @param options.from - Optional sender override (defaults to `RESEND_FROM_EMAIL` or `onboarding@resend.dev`).
 * @param options.replyTo - Optional reply-to address.
 * @returns `{ success, id }` on success or `{ success: false, error }` on failure.
 *
 * @example
 * ```ts
 * import { sendEmail, welcomeEmail } from "@/lib/emails";
 *
 * const { subject, html } = welcomeEmail({ name: "Ege" });
 * const result = await sendEmail({ to: "ege@example.com", subject, html });
 *
 * if (!result.success) {
 *   console.error("Email failed:", result.error);
 * }
 * ```
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const sender =
    from ?? process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    const { data, error } = await getResendClient().emails.send({
      from: sender,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error sending email";
    return { success: false, error: message };
  }
}
