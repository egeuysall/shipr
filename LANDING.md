You are a senior React engineer assembling a professional marketing landing page using pre-built Tailark components and shadcn/ui. Design style: Vercel (clean, minimal, modern).

PROJECT CONTEXT:

- Next.js 15 + pnpm + TypeScript
- shadcn/ui initialized
- Tailark components already installed (see below)
- Need: Assemble complete landing page using existing components + customize content

═══════════════════════════════════════════════════════════════════

INSTALLED TAILARK COMPONENTS (ALREADY IN PROJECT)
═══════════════════════════════════════════════════════════════════

✅ Hero: src/components/hero-section-1.tsx
✅ Logo Cloud: src/components/logo-cloud-2.tsx (for credibility/trust)
✅ Features: src/components/features-3.tsx
✅ Integrations: src/components/integrations-1.tsx
✅ Stats: src/components/stats-2.tsx
✅ Testimonials: src/components/testimonials-3.tsx
✅ Pricing: Use Clerk's billing component (already built)
✅ CTA: src/components/call-to-action-1.tsx
✅ FAQs: src/components/faqs-2.tsx
✅ Footer: src/components/footer-1.tsx
✅ Header: src/components/header.tsx

SVG Logos Available:

- src/components/ui/svgs/claude.tsx
- src/components/ui/svgs/clerk.tsx
- src/components/ui/svgs/figma.tsx
- src/components/ui/svgs/firebase.tsx
- src/components/ui/svgs/linear.tsx
- src/components/ui/svgs/slack.tsx
- src/components/ui/svgs/supabase.tsx
- src/components/ui/svgs/twilio.tsx
- src/components/ui/svgs/vercel.tsx
- src/components/ui/svgs/beacon.tsx
- src/components/ui/svgs/bolt.tsx
- src/components/ui/svgs/cisco.tsx
- src/components/ui/svgs/hulu.tsx
- src/components/ui/svgs/spotify.tsx

═══════════════════════════════════════════════════════════════════

YOUR TASKS
═══════════════════════════════════════════════════════════════════

1. CREATE MARKETING LAYOUT
   - File: app/(marketing)/layout.tsx
   - Import and use Header component
   - Simple layout wrapper (no sidebar)
   - Include Header at top, {children}, Footer at bottom

2. ASSEMBLE LANDING PAGE
   - File: app/(marketing)/page.tsx
   - Import all Tailark components
   - Arrange in this order:
     1. Hero (hero-section-1)
     2. Logo Cloud (logo-cloud-2) - shows trusted by X companies
     3. Features (features-3)
     4. Integrations (integrations-1)
     5. Stats (stats-2)
     6. Testimonials (testimonials-3)
     7. Pricing (use billing component from components/billing/)
     8. FAQs (faqs-2)
     9. CTA (call-to-action-1)
     10. Footer (footer-1)

3. CUSTOMIZE CONTENT FOR FOUNDRY
   - Update each component's props with Foundry-specific content:

   HERO:
   - Headline: "Ship Your Next SaaS in Days, Not Weeks"
   - Subheadline: "Production-ready starter with auth, billing, and beautiful UI. Built with Next.js, Clerk, and Convex."
   - CTA: "Get Started Free"

   LOGO CLOUD:
   - Title: "Powered by industry-leading tools"
   - Use existing SVGs: Vercel, Clerk, Supabase, Stripe, etc.

   FEATURES:
   - Title: "Everything you need to launch fast"
   - Features:
     - Authentication (Clerk) - Email, OAuth, magic links
     - Billing (Stripe) - Subscriptions, one-time payments
     - Database (Convex) - Real-time, serverless
     - UI Components (shadcn) - Beautiful, accessible
     - Analytics (PostHog, Sentry) - Track everything
     - Deployment (Vercel) - One-click deploy

   INTEGRATIONS:
   - Title: "Integrates with your favorite tools"
   - Show logos of integrated services

   STATS:
   - Metric 1: "50+ Components" - "Pre-built UI components"
   - Metric 2: "5 Days to Launch" - "From idea to production"
   - Metric 3: "100% TypeScript" - "Type-safe by default"
   - Metric 4: "Open Source" - "Free to use and modify"

   TESTIMONIALS:
   - Add 2-3 testimonials (can be placeholders with TODO comments)
   - Format: Name, Role, Company, Quote

   PRICING:
   - Use existing billing component
   - Show Free vs Pro tiers
   - Link to /dashboard for authenticated users

   FAQS:
   - Q: "What's included in Foundry?"
     A: "Complete SaaS starter with auth, billing, database, UI components, and deployment ready."
   - Q: "Do I need to know how to code?"
     A: "Yes, Foundry is for developers. You'll need knowledge of Next.js, React, and TypeScript."
   - Q: "Can I use this for commercial projects?"
     A: "Yes, Foundry is free to use for personal and commercial projects."
   - Q: "What if I need help?"
     A: "Join our Discord community or check the documentation."
   - Add 2-3 more relevant FAQs

   CTA:
   - Headline: "Ready to ship faster?"
   - Subheadline: "Start building your SaaS today"
   - CTA: "Get Started Free" → /sign-up

   FOOTER:
   - Product links: Features, Pricing, Documentation
   - Company links: About, Blog, Changelog
   - Legal links: Privacy, Terms, Cookies
   - Social links: GitHub, Twitter, Discord

4. ADD PROPER SPACING
   - Each section should have proper padding (py-16 or py-24)
   - Consistent max-width container
   - Proper background colors (alternate between white and muted)

5. MAKE IT RESPONSIVE
   - All components should work on mobile, tablet, desktop
   - Test each section's responsiveness
   - Ensure proper text scaling

6. CREATE EXAMPLE CUSTOMIZATION GUIDE
   - File: app/(marketing)/README.md
   - Document how to customize each section
   - List all props for each component
   - Show example of changing content
   - Make it easy for future you to customize in 30 min

═══════════════════════════════════════════════════════════════════

OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════════

app/(marketing)/
├── layout.tsx (with Header + Footer wrapper)
├── page.tsx (assembled landing page)
├── README.md (customization guide)
└── \_components/ (if you need custom wrappers)

All Tailark components stay in src/components/ (don't move them)

═══════════════════════════════════════════════════════════════════

TESTING CHECKLIST
═══════════════════════════════════════════════════════════════════

✅ Landing page loads at / route
✅ All sections render in correct order
✅ Hero CTA links to /sign-up
✅ Logo cloud shows company logos
✅ Features display with proper icons
✅ Integrations section shows logos
✅ Stats display correctly
✅ Testimonials render properly
✅ Pricing shows Free/Pro tiers
✅ FAQs accordion works
✅ Bottom CTA links to /sign-up
✅ Footer links work
✅ Fully responsive (mobile, tablet, desktop)
✅ Proper spacing between sections
✅ Vercel-style aesthetic maintained
✅ All images/logos render
✅ No console errors

═══════════════════════════════════════════════════════════════════

DESIGN GUIDELINES
═══════════════════════════════════════════════════════════════════

SPACING:

- Sections: py-16 md:py-24
- Container: max-w-7xl mx-auto px-6
- Between elements: space-y-8 or space-y-12

BACKGROUNDS:

- Alternate sections: white → bg-muted/30 → white
- Or keep all white for cleaner look

TYPOGRAPHY:

- Section headings: text-3xl md:text-4xl font-bold
- Subheadings: text-lg md:text-xl text-muted-foreground
- Body text: text-base leading-relaxed

COLORS:

- Use default shadcn theme
- Primary for CTAs
- Muted backgrounds
- Subtle borders

═══════════════════════════════════════════════════════════════════

CRITICAL NOTES
═══════════════════════════════════════════════════════════════════

- DON'T modify the Tailark component files themselves
- DO pass props to customize them
- Use TypeScript for all files
- Add TODO comments for placeholder content (testimonials, etc.)
- Make sure Header component is imported correctly
- Ensure all logo SVGs are imported properly
- Test the page at / route (not /marketing)
- All CTAs should link to /sign-up or /dashboard
- Pricing section should use your existing billing component

═══════════════════════════════════════════════════════════════════

ADDITIONAL TASKS
═══════════════════════════════════════════════════════════════════

If any Tailark component has hardcoded content:

1. Check the component file
2. Identify what should be props
3. Either:
   a) Modify component to accept props (if simple)
   b) Create wrapper component that passes props
   c) Document in README that content needs manual editing

Ensure smooth scrolling:

- Add scroll-smooth to html element
- Add proper anchor links if needed
- Test scroll behavior

═══════════════════════════════════════════════════════════════════

Build the landing page by assembling existing components.
Focus on content customization and proper layout.
Make it look professional and conversion-optimized.
Document everything for easy future customization.
