import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail, welcomeEmail, planChangedEmail } from "@/lib/emails";

const limiter = rateLimit({ interval: 60_000, limit: 10 });

type EmailTemplate = "welcome" | "plan-changed";

interface WelcomePayload {
  template: "welcome";
  name: string;
}

interface PlanChangedPayload {
  template: "plan-changed";
  name: string;
  previousPlan: string;
  newPlan: string;
}

type EmailPayload = WelcomePayload | PlanChangedPayload;

function isValidPayload(body: unknown): body is EmailPayload {
  if (typeof body !== "object" || body === null) return false;

  const payload = body as Record<string, unknown>;

  if (payload.template === "welcome") {
    return typeof payload.name === "string" && payload.name.length > 0;
  }

  if (payload.template === "plan-changed") {
    return (
      typeof payload.name === "string" &&
      payload.name.length > 0 &&
      typeof payload.previousPlan === "string" &&
      payload.previousPlan.length > 0 &&
      typeof payload.newPlan === "string" &&
      payload.newPlan.length > 0
    );
  }

  return false;
}

function buildEmail(payload: EmailPayload): { subject: string; html: string } {
  switch (payload.template) {
    case "welcome":
      return welcomeEmail({ name: payload.name });
    case "plan-changed":
      return planChangedEmail({
        name: payload.name,
        previousPlan: payload.previousPlan,
        newPlan: payload.newPlan,
      });
  }
}

const SUPPORTED_TEMPLATES: EmailTemplate[] = ["welcome", "plan-changed"];

/**
 * POST /api/email
 *
 * Sends a transactional email to the authenticated user via Resend.
 * Protected by Clerk auth and rate-limited to 10 requests per minute per IP.
 *
 * Required env vars:
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL (optional, defaults to onboarding@resend.dev)
 *
 * Request body:
 * - { template: "welcome", name: string }
 * - { template: "plan-changed", name: string, previousPlan: string, newPlan: string }
 */
export async function POST(req: Request): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success: allowed, remaining, reset } = limiter.check(ip);

  const rateLimitHeaders = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(reset),
  };

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: rateLimitHeaders },
    );
  }

  const user = await currentUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json(
      { error: "No email address found for user" },
      { status: 400, headers: rateLimitHeaders },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body",
        supported_templates: SUPPORTED_TEMPLATES,
      },
      { status: 400, headers: rateLimitHeaders },
    );
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      {
        error: "Invalid payload. Provide a valid template and its required fields.",
        supported_templates: SUPPORTED_TEMPLATES,
      },
      { status: 400, headers: rateLimitHeaders },
    );
  }

  const { subject, html } = buildEmail(body);
  const result = await sendEmail({
    to: user.primaryEmailAddress.emailAddress,
    subject,
    html,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: "Failed to send email", details: result.error },
      { status: 502, headers: rateLimitHeaders },
    );
  }

  return NextResponse.json(
    { status: "sent", id: result.id },
    { status: 200, headers: rateLimitHeaders },
  );
}
