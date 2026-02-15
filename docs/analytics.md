# Analytics

Shipr uses [PostHog](https://posthog.com) for product analytics, routed through a Next.js reverse proxy to avoid ad-blockers.

## Setup

Three components handle analytics in the root layout (`src/app/layout.tsx`):

| Component         | File                                  | Purpose                                          |
| ----------------- | ------------------------------------- | ------------------------------------------------ |
| `PostHogProvider` | `src/components/posthog-provider.tsx` | Initializes the PostHog client and wraps the app |
| `PostHogPageview` | `src/components/posthog-pageview.tsx` | Captures `$pageview` on route changes            |
| `PostHogIdentify` | `src/components/posthog-identify.tsx` | Links Clerk user identity to PostHog person      |

## Environment Variables

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Reverse Proxy

PostHog requests are proxied through Next.js rewrites in `next.config.ts` to bypass ad-blockers:

- `/ingest/static/*` to `https://us-assets.i.posthog.com/static/*`
- `/ingest/*` to `https://us.i.posthog.com/*`

## Tracked Events

| Event                    | Location               | Description                                 |
| ------------------------ | ---------------------- | ------------------------------------------- |
| `$pageview`              | `posthog-pageview.tsx` | Every route change                          |
| `cta_clicked`            | Hero, CTA sections     | User clicked a call-to-action button        |
| `pricing_plan_clicked`   | Pricing section        | User selected a pricing plan                |
| `upgrade_button_clicked` | Dashboard              | User clicked upgrade                        |
| `faq_expanded`           | FAQ section            | User opened a FAQ item                      |
| `navigation_clicked`     | Header                 | Nav link clicked (includes device type)     |
| `mobile_menu_toggled`    | Header                 | Mobile menu opened/closed                   |
| `theme_toggled`          | Theme toggle           | Theme changed (includes previous/new theme) |

## User Identification

`PostHogIdentify` runs on auth state changes. When a user signs in, it calls `posthog.identify()` with:

- `email`, `name`, `first_name`, `last_name`
- `username`, `created_at`, `plan`

On sign-out, it calls `posthog.reset()` to clear the person profile.

## Adding New Events

Capture events anywhere with:

```ts
import posthog from "posthog-js";

posthog.capture("event_name", { key: "value" });
```

Keep event names in `snake_case`. Include relevant context as properties.
