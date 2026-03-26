# Panos Antoniou Wedding Website — Full Redesign Spec

## Overview

Redesign of the Panos Antoniou Weddings website (weddingsmakeupandhair.com) from a warm cream/brown aesthetic to a minimal, luxury white/charcoal/forest green palette. The site restructures from 7 pages to 8 pages (6 core + Portfolio + Blog), reframing services around two pillars: Bridal Beauty and Wedding Planning, with a new Bridal Lounge page.

**Approach:** Incremental redesign — update the Tailwind design system first, then rework each page within the existing Astro + Tailwind CSS codebase. Preserves existing SEO infrastructure, sitemap generation, JSON-LD schema, and scroll-reveal animations.

**Tech stack:** Astro 5.7.10, Tailwind CSS 3.4.17, Sharp (image optimization), @astrojs/sitemap.

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#FFFFFF` | Primary background |
| `off-white` | `#FAFAF8` | Alternate section backgrounds |
| `charcoal` | `#2D2D2D` | Primary text, headings |
| `grey` | `#555555` | Body text |
| `forest-green` | `#1B4332` | Buttons, links, accent color |
| `green-light` | `#245A3F` | Hover states |
| `gold` | `#B8976A` | Luxury accents, dividers, labels |
| `near-black` | `#1A1A1A` | Footer, dark sections |

Replaces the current cream/sand/brown/gold-muted palette entirely.

### Typography

Fonts remain **Cormorant Garamond** (serif, display) and **Inter** (sans, body). Weight adjustments for the minimal feel:

- **Display XL** (Hero titles): Cormorant Garamond 300, 4.5rem
- **Display LG** (Page headings): Cormorant Garamond 400, 3.5rem
- **Display** (Section headings): Cormorant Garamond 400, 2.5rem
- **Body**: Inter 300, 16px, line-height 1.7
- **Labels/Nav**: Inter 500, 12px, uppercase, letter-spacing 0.12em

### Buttons

Three variants:
- **Primary**: Forest green background (#1B4332), white text. Hover: #245A3F.
- **Outline**: Transparent, charcoal border/text. Hover: charcoal fill, white text.
- **Gold**: Transparent, gold border/text. Hover: gold fill, white text.

All buttons: 12px uppercase Inter, letter-spacing 0.12em, padding 14px 32px.

### Luxury Accents

- **Gold dividers**: Thin 1px line with center dot, color #B8976A
- **Gold gradient**: linear-gradient(135deg, #B8976A, #D4B88C, #B8976A) — for subtle overlays
- **Marble texture**: linear-gradient in warm whites/greys — for decorative backgrounds
- **Section labels**: 10px uppercase, letter-spacing 0.2em, gold color

### Layout Principles

- Generous whitespace: section padding py-24 to py-32
- White/off-white alternating section backgrounds
- Mobile-first responsive design
- Full-bleed hero images with dark gradient overlays
- Scroll-reveal animations (existing IntersectionObserver pattern)
- Container max-width: 72rem

## Site Structure

### Navigation

**Desktop:** Fixed header, transparent on hero → solid white on scroll. Logo (text "Panos Antoniou") left, 5 links center-right (About, Services, The Bridal Lounge, Portfolio, Blog), green "Book Now" CTA button right.

**Services** acts as a dropdown or link to the /services hub page that links to both sub-service pages.

**Mobile:** Logo + hamburger → full-screen slide-in drawer with all links + CTA.

### Pages (8 total)

| # | Page | URL | Status |
|---|------|-----|--------|
| 1 | Homepage | `/` | Redesign |
| 2 | About Panos | `/about` | Redesign |
| 3 | Bridal Beauty & Services | `/services/bridal-beauty` | New |
| 4 | Wedding Planning & Design | `/services/wedding-planning` | New |
| 5 | The Bridal Lounge | `/bridal-lounge` | New |
| 6 | Contact & Booking | `/contact` | Redesign |
| 7 | Portfolio | `/portfolio` | Redesign |
| 8 | Blog | `/blog` | Redesign |

### URL Changes

| Old URL | New URL | Action |
|---------|---------|--------|
| `/services` | `/services` | Becomes hub page (two cards linking to bridal-beauty and wedding-planning with brief descriptions and images) |
| `/bridal-makeup-hair-styling` | `/services/bridal-beauty` | Replaced |
| `/wedding-planner` | `/services/wedding-planning` | Replaced |
| `/photo-shooting-makeup-hair` | — | Removed (content merged into bridal-beauty) |
| `/training-classes` | — | Removed (mentioned under Bridal Lounge) |
| — | `/bridal-lounge` | New page |

### Pages to Delete

- `src/pages/bridal-makeup-hair-styling.astro`
- `src/pages/photo-shooting-makeup-hair.astro`
- `src/pages/training-classes.astro`
- `src/pages/wedding-planner.astro`
- `src/pages/bridesmaids-makeup-hair.astro` (already deleted)

## Page Designs

### Page 1: Homepage (`/`)

**SEO Title:** Panos Antoniou Weddings Makeup and Hair | Luxury Event Planning Santorini
**Meta Description:** Experience luxury bridal beauty and bespoke wedding planning in Santorini. Panos Antoniou Weddings combines 26 years of expertise for a flawless wedding day.

**Sections in order:**

1. **Hero** — Full-viewport height. Existing `hero-bridal.jpg` with dark gradient overlay. Content: location label ("Santorini · Greece · Worldwide"), title "Panos Antoniou" (Display XL), subtitle "The Mastery of Bridal Beauty & Wedding Design" (italic Cormorant), tagline text, CTA button "Start Planning Your Wedding". Fade-up animation on load.

2. **The Visionary Behind the Brand** — White background. Two-column: Panos portrait (existing `panos-portrait.jpg`) left, brand story text right. Copy from brief (26 years, beauty + planning evolution). Gold section label + divider.

3. **Introducing: The Bridal Lounge** — Off-white background with dark split panel. Gold "Introducing — 2026" label. Title + description text. Split layout: image left, dark charcoal content panel right with gold button "Explore the Lounge" linking to `/bridal-lounge`.

4. **Our Services — Quick View** — White background. Three cards side-by-side:
   - Bridal Makeup & Hair (from €450) → `/services/bridal-beauty`
   - Wedding Planning & Coordination (from €1,200) → `/services/wedding-planning`
   - The Combined Experience (Bespoke Pricing) → `/contact`
   Each card: image + title + description + price + "View Details →" link. Hover lifts card.

5. **Instagram Feed** — Off-white background. Official Meta Instagram embed widget for @weddingsmakeupandhair. Styled surrounding section with gold label "@weddingsmakeupandhair", section title "Follow Our Journey".

6. **CTA Banner** — Dark (#1A1A1A) background. "Start Planning Your Wedding in Santorini" title, closing note text from brief, green CTA button to `/contact`.

7. **Footer** — Near-black. Navigation links, gold divider, contact info, copyright.

### Page 2: About Panos (`/about`)

**SEO Title:** Panos Antoniou Weddings Makeup and Hair | Luxury Event Planning Santorini
**Meta Description:** Meet Panos Antoniou, the visionary behind Santorini's premier bridal beauty and wedding planning brand. 26 years of artistry dedicated to your special day.

**Sections:**

1. **Hero** — Dark gradient background. Title "The Art of Bridal Perfection", quote "Beauty is not created; it is revealed."
2. **Portrait + Bio** — Two-column: Panos portrait left, full biography right. Content from brief (26 years, Athens 2004, MAC, founding in 2016, Bridal Lounge 2026).
3. **Career Milestones** — Minimal timeline: 2004 Olympics → MAC Pro → Founded brand 2016 → Bridal Lounge 2026. Dots-and-lines style with gold accents.
4. **CTA** — "Discover Our Services" button → `/services`.

### Page 3: Bridal Beauty & Services (`/services/bridal-beauty`)

**SEO Title:** The Best Bridal Makeup and Hair in Santorini | Panos Antoniou Weddings
**Meta Description:** High-end bridal makeup and hair services in Santorini. Explore our luxury beauty packages and visit our exclusive Bridal Lounge in Pyrgos. Book your trial.

**Sections:**

1. **Hero** — Dark gradient. Title from SEO heading.
2. **Philosophy** — Centered text block on white. 26 years experience, brand names (Chanel, Armani, Shiseido, MAC, K-Beauty). Gold divider.
3. **Signature Services** — Clean pricing cards with gold accents:
   - Full Bridal Beauty (Makeup & Hair): from €450
   - Individual Bridal Service (Makeup or Hair): from €230
   - Bridal Trial (Makeup & Hair): from €100
   - Pre or Next-Day Styling: from €250
   - Note: All bridal services include Professional Skin Preparation, Relaxing Facial Massage, Premium False Lashes, and Veil Styling.
4. **Luxury Packages** — Three styled cards side-by-side:
   - The Intimate Bride: from €800 (Bridal + 2 persons + touch-ups)
   - The Bridal Morning: from €940 (Bridal + 3 persons + touch-ups)
   - The Bridal Party: from €1,080 (Bridal + 4 persons + 1hr group touch-ups)
5. **Booking Terms & Travel** — Two-column with icon highlights. Retainer info (30%/50%), travel fees (€150-€450 Greece, €300-€1100 international), Bridal Lounge location.
6. **CTA** — "Book the Best Weddings Makeup and Hair Experience" → `/contact`.

### Page 4: Wedding Planning & Design (`/services/wedding-planning`)

**SEO Title:** Luxury Wedding Planner & Proposal Designer in Santorini | Panos Antoniou Weddings
**Meta Description:** Bespoke wedding planning, elopements, and luxury proposals in Santorini. We design seamless, high-aesthetic events tailored to your unique story.

**Sections:**

1. **Hero** — Forest green gradient. Title from SEO heading.
2. **Philosophy** — Centered text. "We don't just organize events; we design memories."
3. **Planning Services** — Three categories, each with pricing tiers:
   - **Full Wedding Planning**: Intimate (≤30 guests, from €1,200), Grand (≤100 guests, from €3,500)
   - **Santorini Elopements**: Essential (€1,200), Premium (€1,800), Luxury with styling & photography (€2,800)
   - **Proposals & Vow Renewals**: Essential (€500), Luxury Design (€1,200)
4. **The Panos Antoniou Advantage** — Three-column grid: Local Santorini Experts, Aesthetic Synchronization, Stress-Free Coordination. Icon + title + description each.
5. **CTA** — "Start Planning Your Santorini Story" → `/contact`.

### Page 5: The Bridal Lounge (`/bridal-lounge`)

**SEO Title:** The First Exclusive Bridal Lounge in Santorini | Panos Antoniou Weddings
**Meta Description:** Step into the first exclusive Bridal Lounge in Santorini. A private sanctuary for bridal preparation, editorial sessions, and luxury boudoir photography.

**Sections:**

1. **Hero** — Charcoal gradient. Title from SEO heading. Most atmospheric hero on the site.
2. **The Concept** — Centered text on white. Private sanctuary, 2026, luxury/privacy/serenity.
3. **The Space: Volcanic Soul** — Full-width image section with overlay text. Volcanic ash palette description: deep greys, charcoal, driftwood accents, white & gold details, professional lighting.
4. **Bridal Boudoir & Editorial Sessions** — Dark split-panel layout. Studio as curated space for "Getting Ready" editorial photoshoots.
5. **Studio Services** — Pricing:
   - Private Bridal Preparation: from €450
   - Bridal Boudoir Studio Use (2hrs): from €300
   - Professional Makeup Lessons: from €150
6. **CTA** — "Book Your Bridal Lounge Experience" → `/contact`.

### Page 6: Contact & Booking (`/contact`)

**SEO Title:** Book Your Santorini Wedding Experience | Panos Antoniou Weddings
**Meta Description:** Ready to start planning your Santorini wedding? Contact Panos Antoniou Weddings for bridal beauty and event design. Secure your date for 2026/2027.

**Sections:**

1. **Hero** — Forest green gradient. Title from SEO heading.
2. **Smart Contact Form** — Two-column: form left, contact details right. Form fields:
   - Full Name (text)
   - Email Address (required)
   - WhatsApp / Mobile Number (required)
   - Event Date & Location (date/text)
   - Service Selection (dropdown with sub-options):
     - Makeup and Hair → Bridal / Photoshooting / Basic
     - Wedding Planning & Design → Full Planning / Elopement / Proposal
     - The Combined Experience → Custom Package
   - Your Vision (textarea)
   - Front-end only — no backend submission service for now.
3. **Direct Contact Details** — Email, WhatsApp, Office phone, physical address (Pyrgos Village).

### Page 7: Portfolio (`/portfolio`)

**SEO Title:** Bridal Makeup & Wedding Portfolio | Panos Antoniou Weddings Santorini
**Meta Description:** Browse our portfolio of luxury bridal makeup, hair styling, and wedding design in Santorini. See the artistry of Panos Antoniou Weddings.

Restyled version of existing portfolio page. Masonry gallery with existing 9 images. New color scheme applied (white background, charcoal text, gold hover accents). Lightbox preserved. Image alt tags updated for SEO keywords. CTA at bottom → `/contact`.

### Page 8: Blog (`/blog`)

**SEO Title:** Wedding Planning & Bridal Beauty Blog | Panos Antoniou Weddings Santorini
**Meta Description:** Wedding tips, bridal beauty insights, and Santorini inspiration from Panos Antoniou Weddings. Plan your dream wedding with expert guidance.

Restyled article listing + 3 existing articles. Clean card grid: featured image + title + excerpt + read more. BlogLayout.astro restyled with new typography and colors. Gold date accents.

## Global Components

### Header
- Fixed position, transparent over hero sections, solid white (#FFFFFF) on scroll
- Logo: text "Panos Antoniou" in Cormorant Garamond, uppercase, letter-spacing 0.1em
- Links: About, Services (dropdown/hub), The Bridal Lounge, Portfolio, Blog
- CTA: "Book Now" forest green button → `/contact`
- Mobile: hamburger → full-screen slide-in drawer

### Footer
- Near-black (#1A1A1A) background
- Navigation links (all 8 pages)
- Gold divider
- Contact: email, phone, WhatsApp
- Social: Instagram, Facebook links
- Location: Pyrgos Village, Santorini
- Copyright

### WhatsApp Floating Button
- Green (#25D366) floating action button, bottom-right
- Links to WhatsApp with pre-filled message
- Visible on all pages

### Scroll Animations
- Keep existing IntersectionObserver-based reveal animations
- Fade-up on section entry
- Subtle and performant

## SEO Requirements

### Technical SEO
- **Title tags**: As specified per page above
- **Meta descriptions**: As specified per page above
- **Focus keywords**: "Wedding Makeup and Hair Santorini", "Wedding Planner Santorini"
- **Image alt text**: Descriptive, keyword-rich (e.g., "Luxury Wedding Planning Santorini Panos Antoniou")
- **Internal linking**: "Makeup" links to `/services/bridal-beauty`, "Planning" links to `/services/wedding-planning` within body text
- **JSON-LD schema**: Update existing LocalBusiness schema for Pyrgos Village location
- **Redirects**: Not handled at Astro level (static site). If hosted on Netlify/Vercel, configure redirects for old URLs (`/bridal-makeup-hair-styling` → `/services/bridal-beauty`, etc.) in platform config.
- **Sitemap**: Auto-generated via @astrojs/sitemap (already configured)
- **Canonical URLs**: One per page (already configured)
- **Open Graph + Twitter cards**: Update per page with new titles/descriptions

### Mobile Performance
- Mobile-first CSS
- Optimized images via Sharp
- Minimal JS (only scroll animations + mobile menu + lightbox)
- Target: fast load on mobile (Instagram/TikTok referral traffic)

## Assets

Using existing images only:
- `public/images/logo/panos-logo.png` — logo
- `public/images/hero/hero-bridal.jpg` — homepage hero
- `public/images/about/panos-portrait.jpg` — about page portrait
- `public/images/portfolio/` — 9 portfolio images
- `public/images/services/` — 4 service images

No stock images or placeholders.

## Data Files

Update `src/data/services.ts` to reflect the two-pillar service structure:
- Bridal Makeup & Hair → `/services/bridal-beauty`
- Wedding Planning & Design → `/services/wedding-planning`

Remove old services (Photo Shooting, Training Classes). Add pricing data, package details, and booking terms as structured data for use across pages.

Update `src/data/testimonials.ts` — keep existing testimonials, restyle presentation.

`src/data/portfolio.ts` — keep existing items, update alt text for SEO.

## Out of Scope

- Backend form submission (front-end form only for now — on submit, show a styled success message thanking the user and suggesting they reach out via WhatsApp for faster response)
- New photography or stock images
- Blog content changes (only restyling)
- Instagram API integration (using official embed widget)
- E-commerce or payment integration
