# Landing Page Customization Guide

This landing page is assembled from pre-built Tailark components. Here's how to customize it.

## 📁 Structure

```
app/(marketing)/
├── layout.tsx          # Wraps pages with Header + Footer
└── page.tsx            # Landing page (all sections assembled here)
```

## 🎨 Sections (in order)

1. **Hero** - Main headline and CTA
2. **Logo Cloud** - Partner/tool logos
3. **Features** - Feature showcase with tabs
4. **Integrations** - Integration diagram
5. **Stats** - Key metrics with chart
6. **Testimonials** - Customer quotes
7. **Pricing** - Clerk PricingTable component
8. **FAQs** - Accordion with questions
9. **CTA** - Final call-to-action

## ✏️ How to Customize

### Change Section Content

Most Tailark components have **hardcoded content**. To customize:

1. Open the component file in `src/components/`
2. Find the text/content you want to change
3. Edit directly in the component file

**Example - Hero Section:**
```tsx
// File: src/components/hero-section-1.tsx
<h1>Your Headline Here</h1>
<p>Your subheadline here</p>
```

### Change Section Order

Edit `app/(marketing)/page.tsx`:

```tsx
// Move sections around by reordering the JSX
<HeroSection />
<Features />      // Swap these
<LogoCloud />     // two sections
<Stats />
```

### Add/Remove Sections

In `app/(marketing)/page.tsx`:

```tsx
// Comment out to hide:
{/* <LogoCloud /> */}

// Add new section:
<section className="py-16 md:py-24">
  <YourNewComponent />
</section>
```

### Change Spacing

Adjust padding on section wrappers:

```tsx
// Smaller spacing
<section className="py-8 md:py-12">

// Larger spacing  
<section className="py-24 md:py-32">
```

### Change Backgrounds

Alternate between white and muted:

```tsx
// White background
<section className="py-16 md:py-24">

// Muted background
<section className="bg-muted/30 py-16 md:py-24">
```

## 🔧 Component Files

| Component | File | Customizable |
|-----------|------|-------------|
| Hero | `src/components/hero-section-1.tsx` | Edit file directly |
| Logo Cloud | `src/components/logo-cloud-2.tsx` | Edit logo arrays |
| Features | `src/components/features-3.tsx` | Edit file directly |
| Integrations | `src/components/integrations-1.tsx` | Edit file directly |
| Stats | `src/components/stats-2.tsx` | Edit file directly |
| Testimonials | `src/components/testimonials-3.tsx` | Edit file directly |
| FAQs | `src/components/faqs-2.tsx` | Edit faqItems array |
| CTA | `src/components/call-to-action-1.tsx` | Edit file directly |
| Header | `src/components/header.tsx` | Edit menuItems array |
| Footer | `src/components/footer-1.tsx` | Edit links object |

## 🎯 Quick Customization Tasks

### Update FAQs

Edit `src/components/faqs-2.tsx`:

```tsx
const faqItems = [
  {
    id: "item-1",
    question: "Your question?",
    answer: "Your answer here.",
  },
  // Add more...
];
```

### Update Header Links

Edit `src/components/header.tsx`:

```tsx
const menuItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  // Add more...
];
```

### Update Footer

Edit `src/components/footer-1.tsx`:

```tsx
const links = {
  product: [
    { label: "Features", href: "#features" },
    // Add more...
  ],
  // Update other sections...
};
```

## 📱 Responsive Design

All components are responsive by default:
- Mobile: base styles
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

## 🚀 Deploy

After customizing:

```bash
# Test locally
pnpm dev

# Build for production
pnpm build

# Deploy to Vercel
git push
```

## 💡 Tips

- Keep section padding consistent (py-16 or py-24)
- Alternate backgrounds for visual separation
- Test on mobile after changes
- Use max-w-7xl for container width
- Keep Vercel's minimal aesthetic

## 📝 Need More Control?

If you need props-based customization, create wrapper components in `app/(marketing)/_components/` that pass props to the Tailark components.
