# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Panos Antoniou wedding website from warm cream/brown to minimal white/charcoal/forest green luxury aesthetic, restructuring to 8 pages.

**Architecture:** Incremental redesign within existing Astro + Tailwind codebase. Update design system tokens first, then global components, then each page. Preserves existing SEO infrastructure, scroll-reveal animations, and build pipeline.

**Tech Stack:** Astro 5.7.10, Tailwind CSS 3.4.17, Sharp, @astrojs/sitemap

**Spec:** `docs/superpowers/specs/2026-03-26-website-redesign-design.md`

---

### Task 1: Update Design System (Tailwind Config + Global CSS)

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace color palette in tailwind.config.mjs**

Replace the entire `colors` object in `theme.extend`:

```javascript
colors: {
  'off-white':    '#FAFAF8',
  charcoal:       '#2D2D2D',
  grey:           '#555555',
  'forest-green': '#1B4332',
  'green-light':  '#245A3F',
  gold:           '#B8976A',
  'gold-light':   '#D4B88C',
  'near-black':   '#1A1A1A',
},
```

Remove old colors: cream, sand, sand-dark, gold-muted, accent, accent-light, brown, brown-dark.

- [ ] **Step 2: Update font weight in Google Fonts link**

In `src/layouts/BaseLayout.astro`, update the Google Fonts URL to include weight 300 for Cormorant Garamond:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Update global.css base styles**

Replace the body rule in `@layer base`:

```css
body {
  @apply bg-white text-grey font-sans antialiased;
}
```

- [ ] **Step 4: Verify dev server starts without errors**

Run: `npm run dev`
Expected: No Tailwind compilation errors, site loads (will look broken — that's expected).

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: update design system — new color palette and base styles"
```

---

### Task 2: Update Button Component

**Files:**
- Modify: `src/components/ui/Button.astro`

- [ ] **Step 1: Replace button variants with new color scheme**

Replace the `variantClasses` object:

```javascript
const variantClasses = {
  primary: 'bg-forest-green text-white hover:bg-green-light border border-forest-green hover:border-green-light',
  secondary: 'bg-white text-charcoal hover:bg-off-white border border-white',
  outline: 'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-white',
  'outline-light': 'bg-transparent text-white border border-white/40 hover:bg-white hover:text-charcoal',
  gold: 'bg-transparent text-gold border border-gold hover:bg-gold hover:text-white',
};
```

Update the `Props` interface to include `'gold'` variant:

```typescript
variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'gold';
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Button.astro
git commit -m "feat: update button variants for new color scheme"
```

---

### Task 3: Update SectionHeading Component

**Files:**
- Modify: `src/components/ui/SectionHeading.astro`

- [ ] **Step 1: Update SectionHeading colors**

Read the current file first. Update all color references:
- Replace `text-accent`/`text-brown` heading colors → `text-charcoal`
- Replace `text-accent-light`/`text-brown/60` body colors → `text-grey`
- Replace `text-cream` (light variant) → `text-white`
- Replace any `gold-muted` references → `gold`
- Replace eyebrow color to `text-gold`

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/SectionHeading.astro
git commit -m "feat: update SectionHeading colors"
```

---

### Task 4: Update Header Component

**Files:**
- Modify: `src/components/global/Header.astro`

- [ ] **Step 1: Update navigation links**

Replace the `navLinks` array:

```javascript
const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "The Bridal Lounge", href: "/bridal-lounge" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
];
```

- [ ] **Step 2: Update header colors for new palette**

Non-transparent state: Replace `bg-cream/95` → `bg-white/95`, `text-brown/70` → `text-charcoal/70`, `text-brown` → `text-charcoal`.

CTA button non-transparent: Replace `border-accent text-accent hover:bg-accent hover:text-cream` → `border-forest-green text-forest-green hover:bg-forest-green hover:text-white`.

Transparent state stays as-is (white text on dark hero).

- [ ] **Step 3: Update mobile drawer colors**

Replace in mobile nav panel:
- `bg-cream` → `bg-white`
- `text-brown` → `text-charcoal`
- `text-brown/80` → `text-charcoal/80`
- `border-sand` → `border-gray-100`
- `bg-accent text-cream` → `bg-forest-green text-white`
- `hover:bg-brown` → `hover:bg-green-light`
- `text-accent-light` → `text-grey`
- `hover:text-accent` → `hover:text-forest-green`

- [ ] **Step 4: Update scroll behavior script**

Update the scroll script class toggles to use new color tokens:
- `bg-cream/95` → `bg-white/95`
- `text-brown/70` → `text-charcoal/70`
- `text-cream/80` → keep as-is (transparent state)
- `border-accent` / `text-accent` / `hover:bg-accent` / `hover:text-cream` → `border-forest-green` / `text-forest-green` / `hover:bg-forest-green` / `hover:text-white`
- `bg-brown` → `bg-charcoal` (hamburger lines)
- `bg-cream` → keep as-is (transparent state hamburger)

- [ ] **Step 5: Verify header renders on dev server**

Run: `npm run dev`
Check: Header shows correctly on homepage (transparent) and inner pages (solid white).

- [ ] **Step 6: Commit**

```bash
git add src/components/global/Header.astro
git commit -m "feat: update header nav links and colors"
```

---

### Task 5: Update Footer Component

**Files:**
- Modify: `src/components/global/Footer.astro`

- [ ] **Step 1: Update footer service links and nav links**

Replace `navLinks`:

```javascript
const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "The Bridal Lounge", href: "/bridal-lounge" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
```

Replace `serviceLinks`:

```javascript
const serviceLinks = [
  { label: "Bridal Makeup & Hair", href: "/services/bridal-beauty" },
  { label: "Wedding Planning", href: "/services/wedding-planning" },
  { label: "The Bridal Lounge", href: "/bridal-lounge" },
];
```

- [ ] **Step 2: Update footer color classes**

Replace throughout the footer:
- `bg-brown-dark` → `bg-near-black`
- `text-cream/70` → `text-white/70`
- `text-cream/50` → `text-white/50`
- `text-cream/40` → `text-white/40`
- `text-cream/25` → `text-white/25`
- `text-cream/20` → `text-white/20`
- `text-cream` → `text-white`
- `text-gold-muted/70` → `text-gold/70`
- `text-gold-muted/50` → `text-gold/50`
- `text-gold-muted/40` → `text-gold/40`
- `text-gold-muted` → `text-gold`
- `bg-gold-muted/30` → `bg-gold/30`
- `bg-gold-muted/40` → `bg-gold/40`
- `border-gold-muted/40` → `border-gold/40`
- `border-cream/` → `border-white/`
- `hover:text-cream` → `hover:text-white`
- Logo: update inverted filter classes to work on near-black background

- [ ] **Step 3: Update tagline text**

Change the tagline:
```html
<p class="text-lg md:text-xl font-serif italic text-white/40 max-w-md mx-auto leading-relaxed">
  Crafting timeless elegance and bespoke<br class="hidden sm:block" /> wedding experiences since 1998
</p>
```

- [ ] **Step 4: Add office phone to contact column**

After the WhatsApp list item, add:

```html
<li>
  <a href="tel:+302286022940" class="text-sm text-white/50 hover:text-white transition-colors duration-300 flex items-start gap-2.5 group">
    <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold/50 group-hover:text-gold transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21h13.5M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
    <span>+30 22860 22940</span>
  </a>
</li>
```

- [ ] **Step 5: Update locations to remove unused ones**

Replace the locations import. Instead of importing from services.ts, hardcode the relevant locations:

```javascript
const locations = ["Santorini", "Mykonos", "Athens", "Greece", "Worldwide"];
```

Remove the import line: `import { locations } from '../../data/services';`

- [ ] **Step 6: Commit**

```bash
git add src/components/global/Footer.astro
git commit -m "feat: update footer links, colors, and contact info"
```

---

### Task 6: Update Data Files

**Files:**
- Modify: `src/data/services.ts`
- Modify: `src/data/portfolio.ts`

- [ ] **Step 1: Rewrite services.ts**

Replace entire file with new two-pillar service structure plus pricing data:

```typescript
export const services = [
  {
    title: "Bridal Makeup & Hair",
    slug: "/services/bridal-beauty",
    description: "High-end beauty services signed by Panos Antoniou Wedding Makeup and Hair.",
    image: "/images/services/bridal-makeup.jpg",
    price: "Starting from €450",
  },
  {
    title: "Wedding Planning & Coordination",
    slug: "/services/wedding-planning",
    description: "From concept to execution, we design your wedding with precision and style.",
    image: "/images/services/bridesmaids.jpg",
    price: "Starting from €1,200",
  },
];

export const signatureServices = [
  { name: "Full Bridal Beauty (Makeup & Hair)", price: "€450" },
  { name: "Individual Bridal Service (Makeup or Hair)", price: "€230" },
  { name: "Bridal Trial (Makeup & Hair)", price: "€100" },
  { name: "Pre or Next-Day Styling", price: "€250" },
];

export const luxuryPackages = [
  {
    name: "The Intimate Bride",
    price: "€800",
    includes: "Bridal Makeup & Hair + 2 additional persons + Venue Touch-ups",
  },
  {
    name: "The Bridal Morning",
    price: "€940",
    includes: "Bridal Makeup & Hair + 3 additional persons + Venue Touch-ups",
  },
  {
    name: "The Bridal Party",
    price: "€1,080",
    includes: "Bridal Makeup & Hair + 4 additional persons + 1hr Group Venue Touch-ups",
  },
];

export const planningServices = {
  fullPlanning: [
    { name: "Intimate Weddings (up to 30 guests)", price: "€1,200" },
    { name: "Grand Celebrations (up to 100 guests)", price: "€3,500" },
  ],
  elopements: [
    { name: "Essential Elopement Package", price: "€1,200" },
    { name: "Premium Elopement Experience", price: "€1,800" },
    { name: "Luxury Elopement (with full styling & photography)", price: "€2,800" },
  ],
  proposals: [
    { name: "Proposal Essential", price: "€500" },
    { name: "Luxury Proposal Design", price: "€1,200" },
  ],
};

export const studioServices = [
  { name: "Private Bridal Preparation", price: "€450" },
  { name: "Bridal Boudoir Studio Use (2 hours)", price: "€300" },
  { name: "Professional Makeup Lessons", price: "€150" },
];

export const locations = [
  "Santorini",
  "Mykonos",
  "Athens",
  "Greece",
  "Worldwide",
];
```

- [ ] **Step 2: Update portfolio.ts alt text for SEO**

Update each item's `alt` field to include SEO keywords. For example:
- `"Luxury bridal makeup Santorini by Panos Antoniou"` instead of generic descriptions.

Keep the same images and structure, just improve alt text.

- [ ] **Step 3: Commit**

```bash
git add src/data/services.ts src/data/portfolio.ts
git commit -m "feat: restructure data files for two-pillar services"
```

---

### Task 7: Update BaseLayout (SEO + JSON-LD)

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Update JSON-LD schema**

Update the LocalBusiness schema to include the Bridal Lounge address:

```javascript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Panos Antoniou - Weddings Makeup & Hair",
  "description": description,
  "telephone": "+30-695-562-8019",
  "email": "events@weddingsmakeupandhair.com",
  "url": "https://weddingsmakeupandhair.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Pyrgos Village",
    "addressRegion": "Santorini",
    "addressCountry": "GR"
  },
  "areaServed": ["Santorini", "Mykonos", "Athens", "Greece", "Worldwide"],
  "priceRange": "$$$$"
}
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: update JSON-LD schema with Pyrgos address"
```

---

### Task 8: Build Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/home/Hero.astro`
- Create: `src/components/home/Visionary.astro`
- Create: `src/components/home/BridalLoungeTeaser.astro`
- Create: `src/components/home/ServicesQuickView.astro`
- Create: `src/components/home/InstagramFeed.astro`
- Modify: `src/components/home/CTABanner.astro`

- [ ] **Step 1: Rewrite Hero.astro**

Full-viewport hero with the new copy:

```astro
---
---
<section class="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
  <img
    src="/images/hero/hero-bridal.jpg"
    alt="Luxury bridal makeup and hair Santorini Panos Antoniou"
    class="absolute inset-0 w-full h-full object-cover"
  />
  <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60"></div>

  <div class="relative z-10 px-6 max-w-3xl" data-reveal>
    <p class="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/60 mb-6">
      Santorini · Greece · Worldwide
    </p>
    <h1 class="font-serif text-display-xl font-light tracking-wide mb-5">
      Panos Antoniou
    </h1>
    <p class="font-serif text-xl md:text-2xl font-light italic text-white/85 mb-3">
      The Mastery of Bridal Beauty & Wedding Design
    </p>
    <p class="text-sm font-light text-white/60 max-w-lg mx-auto leading-relaxed mb-10">
      Crafting timeless elegance and bespoke wedding experiences in Santorini and beyond.
    </p>
    <a
      href="/contact"
      class="inline-flex items-center justify-center px-9 py-4 bg-forest-green text-white text-xs font-sans font-medium tracking-[0.12em] uppercase hover:bg-green-light transition-all duration-300"
    >
      Start Planning Your Wedding
    </a>
  </div>

  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-sans tracking-[0.15em] uppercase text-white/30 animate-bounce-slow">
    Scroll ↓
  </div>
</section>
```

- [ ] **Step 2: Create Visionary.astro**

Two-column section with portrait and brand story:

```astro
---
---
<section class="bg-white py-24 lg:py-32 px-6 lg:px-12">
  <div class="container-content">
    <p class="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold text-center mb-3">
      The Visionary Behind the Brand
    </p>
    <div class="flex items-center justify-center gap-3 mb-12">
      <div class="w-10 h-px bg-gold"></div>
      <div class="w-1 h-1 rounded-full bg-gold"></div>
      <div class="w-10 h-px bg-gold"></div>
    </div>

    <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-center" data-reveal>
      <img
        src="/images/about/panos-portrait.jpg"
        alt="Panos Antoniou bridal makeup artist Santorini"
        class="w-full h-auto object-cover rounded-sm"
      />
      <div>
        <p class="text-base font-light text-grey leading-relaxed mb-5">
          With 26 years of leadership in the beauty industry, Panos Antoniou is the artist trusted by international brides for refined, elegant, and timeless results.
        </p>
        <p class="text-base font-light text-grey leading-relaxed mb-5">
          Panos Antoniou Wedding Makeup and Hair offers more than just a look. Through years of working closely with hundreds of couples, our deep understanding of the wedding journey led to the natural evolution of our services: <a href="/services/wedding-planning" class="text-forest-green hover:underline">Bespoke Wedding Planning</a>.
        </p>
        <p class="text-sm text-grey/70 leading-relaxed">
          Today, together with our specialized team, we offer a complete experience where bridal beauty meets seamless coordination, ensuring every detail of your Santorini wedding is exactly as you envisioned.
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create BridalLoungeTeaser.astro**

Dark split-panel section:

```astro
---
---
<section class="bg-off-white py-16 lg:py-24 px-6 lg:px-12">
  <div class="container-content">
    <p class="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold text-center mb-3">
      Introducing — 2026
    </p>
    <h2 class="font-serif text-display text-charcoal text-center mb-4">
      The Bridal Lounge & Makeup Studio
    </h2>
    <div class="flex items-center justify-center gap-3 mb-12">
      <div class="w-10 h-px bg-gold"></div>
      <div class="w-1 h-1 rounded-full bg-gold"></div>
      <div class="w-10 h-px bg-gold"></div>
    </div>

    <div class="grid md:grid-cols-2 gap-0 rounded-sm overflow-hidden" data-reveal>
      <img
        src="/images/services/training.jpg"
        alt="Bridal Lounge Santorini Panos Antoniou"
        class="w-full h-full object-cover min-h-[280px]"
      />
      <div class="bg-charcoal p-10 lg:p-14 flex flex-col justify-center">
        <p class="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold mb-4">
          Pyrgos Village, Santorini
        </p>
        <h3 class="font-serif text-2xl text-white mb-4">
          A New Era in Bridal Preparation
        </h3>
        <p class="text-sm text-white/60 leading-relaxed mb-8">
          A dedicated, high-end sanctuary designed exclusively for private bridal preparation and elite editorial photoshooting sessions.
        </p>
        <a
          href="/bridal-lounge"
          class="self-start inline-flex items-center justify-center px-7 py-3 text-xs font-sans font-medium tracking-[0.1em] uppercase text-gold border border-gold hover:bg-gold hover:text-white transition-all duration-300"
        >
          Explore the Lounge
        </a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create ServicesQuickView.astro**

Three service cards:

```astro
---
import { services } from '../../data/services';
---
<section class="bg-white py-24 lg:py-32 px-6 lg:px-12">
  <div class="container-content">
    <p class="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold text-center mb-3">
      Our Services
    </p>
    <h2 class="font-serif text-display text-charcoal text-center mb-4">
      A Complete Wedding Experience
    </h2>
    <div class="flex items-center justify-center gap-3 mb-14">
      <div class="w-10 h-px bg-gold"></div>
      <div class="w-1 h-1 rounded-full bg-gold"></div>
      <div class="w-10 h-px bg-gold"></div>
    </div>

    <div class="grid md:grid-cols-3 gap-8" data-reveal>
      {services.map((service) => (
        <a href={service.slug} class="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div class="aspect-[4/3] overflow-hidden">
            <img
              src={service.image}
              alt={`${service.title} Santorini Panos Antoniou`}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="p-6">
            <h3 class="font-serif text-lg text-charcoal mb-2">{service.title}</h3>
            <p class="text-sm text-grey/70 leading-relaxed mb-4">{service.description}</p>
            <p class="text-sm text-forest-green font-medium">{service.price}</p>
            <span class="text-[10px] font-sans font-medium tracking-[0.1em] uppercase text-forest-green mt-3 inline-block">
              View Details →
            </span>
          </div>
        </a>
      ))}

      <!-- Combined Experience card -->
      <a href="/contact" class="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="aspect-[4/3] overflow-hidden">
          <img
            src="/images/services/photo-shoot.jpg"
            alt="Combined bridal experience Santorini"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div class="p-6">
          <h3 class="font-serif text-lg text-charcoal mb-2">The Combined Experience</h3>
          <p class="text-sm text-grey/70 leading-relaxed mb-4">The ultimate fusion of beauty and organization for a flawless, stress-free result.</p>
          <p class="text-sm text-forest-green font-medium">Bespoke Pricing</p>
          <span class="text-[10px] font-sans font-medium tracking-[0.1em] uppercase text-forest-green mt-3 inline-block">
            Get in Touch →
          </span>
        </div>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Create InstagramFeed.astro**

Instagram embed section:

```astro
---
---
<section class="bg-off-white py-24 lg:py-32 px-6 lg:px-12">
  <div class="container-content text-center">
    <p class="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold mb-3">
      @weddingsmakeupandhair
    </p>
    <h2 class="font-serif text-display text-charcoal mb-4">
      Follow Our Journey
    </h2>
    <div class="flex items-center justify-center gap-3 mb-8">
      <div class="w-10 h-px bg-gold"></div>
      <div class="w-1 h-1 rounded-full bg-gold"></div>
      <div class="w-10 h-px bg-gold"></div>
    </div>
    <p class="text-sm font-light text-grey leading-relaxed max-w-lg mx-auto mb-10">
      See our latest work and behind-the-scenes moments on Instagram.
    </p>

    <!-- Instagram Embed Widget -->
    <div class="max-w-xl mx-auto">
      <blockquote
        class="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/weddingsmakeupandhair/"
        data-instgrm-version="14"
        style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0 auto; max-width:540px; min-width:326px; padding:0; width:calc(100% - 2px);"
      ></blockquote>
      <script async src="//www.instagram.com/embed.js"></script>
    </div>

    <a
      href="https://instagram.com/weddingsmakeupandhair"
      target="_blank"
      rel="noopener"
      class="inline-flex items-center gap-2 mt-8 text-xs font-sans font-medium tracking-[0.1em] uppercase text-forest-green hover:text-green-light transition-colors duration-300"
    >
      Follow Us on Instagram →
    </a>
  </div>
</section>
```

- [ ] **Step 6: Update CTABanner.astro**

Rewrite with new colors and content:

```astro
---
interface Props {
  label?: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
}
const { label = "Ready to Begin?", title, description, buttonText, buttonHref } = Astro.props;
---
<section class="bg-near-black py-24 lg:py-32 px-6 lg:px-12">
  <div class="container-content text-center" data-reveal>
    <p class="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold mb-4">
      {label}
    </p>
    <h2 class="font-serif text-display-lg text-white mb-4">
      {title}
    </h2>
    <div class="flex items-center justify-center gap-3 mb-6">
      <div class="w-10 h-px bg-gold"></div>
      <div class="w-1 h-1 rounded-full bg-gold"></div>
      <div class="w-10 h-px bg-gold"></div>
    </div>
    {description && (
      <p class="text-sm font-light text-white/60 max-w-lg mx-auto leading-relaxed mb-8">
        {description}
      </p>
    )}
    <a
      href={buttonHref}
      class="inline-flex items-center justify-center px-9 py-4 bg-forest-green text-white text-xs font-sans font-medium tracking-[0.12em] uppercase hover:bg-green-light transition-all duration-300"
    >
      {buttonText}
    </a>
  </div>
</section>
```

- [ ] **Step 7: Rewrite index.astro (Homepage)**

Replace entire page content with new sections:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Hero from '../components/home/Hero.astro';
import Visionary from '../components/home/Visionary.astro';
import BridalLoungeTeaser from '../components/home/BridalLoungeTeaser.astro';
import ServicesQuickView from '../components/home/ServicesQuickView.astro';
import InstagramFeed from '../components/home/InstagramFeed.astro';
import CTABanner from '../components/home/CTABanner.astro';
---

<PageLayout
  title="Panos Antoniou Weddings Makeup and Hair | Luxury Event Planning Santorini"
  description="Experience luxury bridal beauty and bespoke wedding planning in Santorini. Panos Antoniou Weddings combines 26 years of expertise for a flawless wedding day."
  headerTransparent={true}
>
  <Hero />
  <Visionary />
  <BridalLoungeTeaser />
  <ServicesQuickView />
  <InstagramFeed />
  <CTABanner
    title="Start Planning Your Wedding in Santorini"
    description="Share your vision with us and let's create something exceptional together. It would be our honor to be part of your story."
    buttonText="Contact Us"
    buttonHref="/contact"
  />
</PageLayout>
```

- [ ] **Step 8: Verify homepage renders correctly**

Run: `npm run dev`
Check: All 6 sections render with correct colors, text, and layout. Test mobile responsiveness.

- [ ] **Step 9: Commit**

```bash
git add src/components/home/ src/pages/index.astro
git commit -m "feat: rebuild homepage with new design"
```

---

### Task 9: Build About Page

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Rewrite about.astro**

Complete rewrite with hero, portrait+bio two-column, career timeline, and CTA. Key sections:

**Hero:** Dark gradient, title "The Art of Bridal Perfection", quote.

**Bio section:** Two-column grid — portrait left, text from brief right (26 years, Athens 2004 Olympics, MAC Pro Artist, founded 2016, Bridal Lounge 2026).

**Timeline:** Four milestones using a minimal dots-and-lines layout with gold accents:
- 2004: Athens Olympic Games — Pro Artist
- 2006: MAC Cosmetics — Pro Team Member
- 2016: Founded Panos Antoniou Weddings Makeup and Hair
- 2026: The Bridal Lounge & Makeup Studio — Santorini

**CTA:** "Discover Our Services" button → `/services`.

Use color tokens: `bg-white`, `bg-off-white`, `text-charcoal`, `text-grey`, `text-gold`, `bg-near-black`, `text-forest-green`.

All text content from the spec's Page 2 section.

SEO title: `Panos Antoniou Weddings Makeup and Hair | Luxury Event Planning Santorini`
Meta description: `Meet Panos Antoniou, the visionary behind Santorini's premier bridal beauty and wedding planning brand. 26 years of artistry dedicated to your special day.`

- [ ] **Step 2: Verify and commit**

```bash
git add src/pages/about.astro
git commit -m "feat: redesign about page"
```

---

### Task 10: Build Bridal Beauty Page

**Files:**
- Create: `src/pages/services/bridal-beauty.astro`

- [ ] **Step 1: Create bridal-beauty.astro**

New page at `/services/bridal-beauty` with all sections from spec Page 3:

**Hero:** Dark gradient, H1 "The Best Bridal Makeup and Hair in Santorini".

**Philosophy section:** Centered text on white. 26 years, brand names (Chanel, Armani, Shiseido, MAC, K-Beauty). Gold divider.

**Signature Services:** Clean pricing rows/cards with gold accents. Four services with "Starting from" prices. Note about included services (skin prep, massage, lashes, veil styling).

**Luxury Packages:** Three side-by-side cards using `luxuryPackages` from services.ts. Each shows name, price, and included services.

**Booking Terms & Travel:** Two-column grid with icon highlights:
- Location: Bridal Lounge in Pyrgos Village or travel to your location
- Retainer: 30% Santorini / 50% outside (non-refundable)
- Travel fees: €150-€450 Greece, €300-€1100 international

**CTA:** "Book the Best Weddings Makeup and Hair Experience" → `/contact`

Import data from `src/data/services.ts` (`signatureServices`, `luxuryPackages`).

SEO title: `The Best Bridal Makeup and Hair in Santorini | Panos Antoniou Weddings`
Meta description: `High-end bridal makeup and hair services in Santorini. Explore our luxury beauty packages and visit our exclusive Bridal Lounge in Pyrgos. Book your trial.`

- [ ] **Step 2: Verify and commit**

```bash
git add src/pages/services/bridal-beauty.astro
git commit -m "feat: add bridal beauty services page"
```

---

### Task 11: Build Wedding Planning Page

**Files:**
- Create: `src/pages/services/wedding-planning.astro`

- [ ] **Step 1: Create wedding-planning.astro**

New page at `/services/wedding-planning` with all sections from spec Page 4:

**Hero:** Forest green gradient (`bg-gradient-to-br from-forest-green to-green-light`), H1 "Luxury Wedding Planner & Proposal Designer in Santorini".

**Philosophy:** Centered text. "We don't just organize events; we design memories." with full philosophy text from brief.

**Planning Services:** Three category sections, each with pricing tiers. Import `planningServices` from services.ts.
- Full Wedding Planning (2 tiers)
- Santorini Elopements (3 tiers)
- Proposals & Vow Renewals (2 tiers)

Each category gets a heading, description, and pricing rows.

**The Panos Antoniou Advantage:** Three-column grid with:
- Local Santorini Experts (map pin icon)
- Aesthetic Synchronization (palette icon)
- Stress-Free Coordination (check-circle icon)

Use simple SVG icons. Each: icon + title + description text from brief.

**CTA:** "Start Planning Your Santorini Story" → `/contact`

SEO title: `Luxury Wedding Planner & Proposal Designer in Santorini | Panos Antoniou Weddings`
Meta description: `Bespoke wedding planning, elopements, and luxury proposals in Santorini. We design seamless, high-aesthetic events tailored to your unique story.`

- [ ] **Step 2: Verify and commit**

```bash
git add src/pages/services/wedding-planning.astro
git commit -m "feat: add wedding planning services page"
```

---

### Task 12: Build Bridal Lounge Page

**Files:**
- Create: `src/pages/bridal-lounge.astro`

- [ ] **Step 1: Create bridal-lounge.astro**

New page at `/bridal-lounge` with sections from spec Page 5. This is the most atmospheric page.

**Hero:** Charcoal gradient (`bg-gradient-to-b from-charcoal via-neutral-800 to-near-black`), H1 "The First Exclusive Bridal Lounge in Santorini". Dramatic, editorial feel.

**The Concept:** Centered text on white. Private sanctuary, 2026, luxury/privacy/serenity. Gold divider.

**The Space: Volcanic Soul:** Full-width section with dark background. Description of the aesthetic: volcanic ash palette, deep greys, charcoal blacks, driftwood accents, white & gold details, professional lighting. Use an existing service image with dark overlay.

**Bridal Boudoir & Editorial Sessions:** Dark split-panel (similar to homepage teaser). Text about curated studio for "Getting Ready" editorial photoshoots and Bridal Boudoir.

**Studio Services:** Import `studioServices` from services.ts. Clean pricing cards on white/off-white background.

**CTA:** "Book Your Bridal Lounge Experience" → `/contact`

SEO title: `The First Exclusive Bridal Lounge in Santorini | Panos Antoniou Weddings`
Meta description: `Step into the first exclusive Bridal Lounge in Santorini. A private sanctuary for bridal preparation, editorial sessions, and luxury boudoir photography.`

- [ ] **Step 2: Verify and commit**

```bash
git add src/pages/bridal-lounge.astro
git commit -m "feat: add bridal lounge page"
```

---

### Task 13: Redesign Services Hub Page

**Files:**
- Modify: `src/pages/services/index.astro`

- [ ] **Step 1: Rewrite services/index.astro**

Simple hub page with two large cards linking to bridal-beauty and wedding-planning:

**Hero:** Dark gradient, H2 "Our Services", subtitle "Two pillars of your perfect wedding experience."

**Two cards:** Side-by-side on desktop, stacked on mobile. Each card:
- Full-width image (existing service images)
- Title, brief description, price range
- "Learn More →" link

Card 1: Bridal Makeup & Hair → `/services/bridal-beauty`
Card 2: Wedding Planning & Design → `/services/wedding-planning`

**Combined Experience teaser:** Small section below cards encouraging the combined package, linking to `/contact`.

Use new color tokens throughout.

- [ ] **Step 2: Verify and commit**

```bash
git add src/pages/services/index.astro
git commit -m "feat: redesign services hub page"
```

---

### Task 14: Redesign Contact Page

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Rewrite contact.astro**

Complete rewrite with smart form from spec Page 6:

**Hero:** Forest green gradient, H1 "Book Your Santorini Wedding Experience".

**Two-column layout:** Form left (wider), contact details right.

**Form fields:**
- Full Name (text input)
- Email Address (required, email input)
- WhatsApp / Mobile Number (required, tel input)
- Event Date (date input)
- Event Location (text input)
- Service Selection (select dropdown with optgroups):
  - Makeup and Hair: Bridal / Photoshooting / Basic
  - Wedding Planning & Design: Full Planning / Elopement / Proposal
  - The Combined Experience: Custom Package
- Your Vision (textarea)
- Submit button (forest green)

Required fields marked with asterisk. Client-side validation. On submit: show styled success message (no backend).

**Contact sidebar:**
- Email: events@weddingsmakeupandhair.com
- WhatsApp / Mobile: +30 695 562 8019
- Office: +30 22860 22940
- Location: Pyrgos Village, Santorini, Greece

Form submission handler (client-side JS):
```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Hide form, show success message
  formEl.style.display = 'none';
  successEl.style.display = 'block';
});
```

Success message: styled div thanking the user, suggesting WhatsApp for faster response.

SEO title: `Book Your Santorini Wedding Experience | Panos Antoniou Weddings`
Meta description: `Ready to start planning your Santorini wedding? Contact Panos Antoniou Weddings for bridal beauty and event design. Secure your date for 2026/2027.`

- [ ] **Step 2: Verify form renders and validation works**

Check: Required field validation, dropdown sub-options, success message on submit.

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: redesign contact page with smart form"
```

---

### Task 15: Restyle Portfolio Page

**Files:**
- Modify: `src/pages/portfolio.astro`

- [ ] **Step 1: Update portfolio.astro colors**

Keep the existing structure (hero, masonry gallery, lightbox). Update colors throughout:

- Hero background: dark gradient (charcoal/near-black)
- `bg-cream` → `bg-white`
- `text-brown` → `text-charcoal`
- `text-accent` → `text-forest-green`
- `text-cream` → `text-white` (in dark sections)
- `bg-sand` / `bg-sand-dark` → `bg-off-white`
- `text-gold-muted` → `text-gold`
- `border-sand` → `border-gray-100`
- `bg-accent` → `bg-forest-green`
- `hover:bg-brown` → `hover:bg-green-light`

Update SEO title/description. Add CTA at bottom → `/contact`.

SEO title: `Bridal Makeup & Wedding Portfolio | Panos Antoniou Weddings Santorini`
Meta description: `Browse our portfolio of luxury bridal makeup, hair styling, and wedding design in Santorini. See the artistry of Panos Antoniou Weddings.`

- [ ] **Step 2: Commit**

```bash
git add src/pages/portfolio.astro
git commit -m "feat: restyle portfolio page"
```

---

### Task 16: Restyle Blog Pages

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/layouts/BlogLayout.astro`

- [ ] **Step 1: Update blog/index.astro colors**

Same color replacement pattern as portfolio:
- All old color tokens → new tokens
- Update SEO title and description

SEO title: `Wedding Planning & Bridal Beauty Blog | Panos Antoniou Weddings Santorini`
Meta description: `Wedding tips, bridal beauty insights, and Santorini inspiration from Panos Antoniou Weddings. Plan your dream wedding with expert guidance.`

- [ ] **Step 2: Update BlogLayout.astro colors**

Read the file first, then update all color references to match new palette.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro src/layouts/BlogLayout.astro
git commit -m "feat: restyle blog pages"
```

---

### Task 17: Delete Old Pages & Cleanup

**Files:**
- Delete: `src/pages/bridal-makeup-hair-styling.astro`
- Delete: `src/pages/photo-shooting-makeup-hair.astro`
- Delete: `src/pages/training-classes.astro`
- Delete: `src/pages/wedding-planner.astro`
- Delete: `src/components/services/ServicePage.astro` (no longer used)
- Delete: `src/components/home/ServiceHighlights.astro` (replaced by ServicesQuickView)
- Delete: `src/components/home/PortfolioShowcase.astro` (removed from homepage)
- Delete: `src/components/home/TestimonialCarousel.astro` (removed from homepage)
- Delete: `src/components/home/AboutTeaser.astro` (removed from homepage)

- [ ] **Step 1: Delete old page files**

```bash
rm src/pages/bridal-makeup-hair-styling.astro
rm src/pages/photo-shooting-makeup-hair.astro
rm src/pages/training-classes.astro
rm src/pages/wedding-planner.astro
```

- [ ] **Step 2: Delete unused components**

```bash
rm src/components/services/ServicePage.astro
rm src/components/home/ServiceHighlights.astro
rm src/components/home/PortfolioShowcase.astro
rm src/components/home/TestimonialCarousel.astro
rm src/components/home/AboutTeaser.astro
```

- [ ] **Step 3: Verify no import errors**

Run: `npm run build`
Expected: Clean build with no missing import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old pages and unused components"
```

---

### Task 18: Final Build Verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 2: Preview production build**

Run: `npm run preview`
Check all 8 pages:
- `/` — Homepage (hero, visionary, lounge teaser, services, instagram, CTA)
- `/about` — About (hero, bio, timeline, CTA)
- `/services` — Hub (two cards)
- `/services/bridal-beauty` — Bridal Beauty (all pricing sections)
- `/services/wedding-planning` — Wedding Planning (all tiers)
- `/bridal-lounge` — Bridal Lounge (atmospheric, services)
- `/contact` — Contact (smart form, validation, success message)
- `/portfolio` — Portfolio (masonry, lightbox)
- `/blog` — Blog (article cards)

- [ ] **Step 3: Check mobile responsiveness**

Test each page at 375px width. Verify:
- Header hamburger menu works
- All grids stack to single column
- Images scale properly
- Text is readable
- WhatsApp button visible

- [ ] **Step 4: Check SEO elements**

Verify in page source:
- Title tags match spec
- Meta descriptions present
- JSON-LD schema includes Pyrgos address
- Image alt texts are descriptive
- Internal links between services pages work

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: final adjustments from build verification"
```
