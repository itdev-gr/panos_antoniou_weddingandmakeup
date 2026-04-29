# Services Page Content Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply four client-requested content additions to the Bridal Beauty services page (`/services/bridal-beauty`), and optionally add an accompanying image to each list section, while preserving the minimal, luxury aesthetic.

**Architecture:** All changes target `src/pages/services/bridal-beauty.astro` and the data source `src/data/services.ts`. We extend the existing data shapes with optional fields (`includes`, `priceNote`, `description`), then render those fields conditionally in the existing list templates. No new components are introduced — we keep edits inside the established pattern (`{array.map(...)}` rows with `border-b border-gold/20`). The optional image task adds one small, centered image above each section heading using existing Tailwind utilities; no new asset processing.

**Tech Stack:** Astro 5 (static output), Tailwind CSS 3, TypeScript (loose). No test infrastructure exists for this page — verification is a manual browser check via `npm run dev` plus `npm run build` for syntax/type validation.

**Notes for the engineer:**
- This is a static marketing site. Treat the dev server + browser as the test harness. There is no Vitest / Playwright wired up for the Services page.
- Astro uses `class` (not `className`) and `{expression}` interpolation in templates.
- The existing visual language: `font-serif italic` for headings, eyebrow `text-[10px] tracking-ultra-wide uppercase text-gold`, gold dividers (`bg-gold` or `border-gold/20`), narrow content (`max-w-narrow mx-auto`), generous vertical rhythm (`py-20 lg:py-28`). Don't deviate.
- Keep existing `data-reveal` attributes on new wrapping elements that should fade in. Stagger via `style={...transition-delay...}` matches the existing pattern.

---

## File Structure

**Files modified:**
- `src/data/services.ts` — widen `signatureServices` items with optional `includes: string[]` and `priceNote: string`; widen `eventServices` items with optional `description: string`. Keep all existing entries; only add fields.
- `src/pages/services/bridal-beauty.astro` — render the new fields conditionally in three sections (Signature Services, Bridesmaids & Guests, Event Make-up and Hair); optionally add a section image per task 6.

**Files created:** None.

---

## Task 0: Setup — verify clean state and start dev server

**Files:** none (environment setup only)

- [ ] **Step 1: Verify a clean working tree**

Run: `git status`
Expected: `nothing to commit, working tree clean` (or only the plan file untracked).
If dirty: stop and ask the user before proceeding.

- [ ] **Step 2: Install dependencies if needed**

Run: `npm install`
Expected: completes without errors. If `node_modules` already populated, this is a no-op.

- [ ] **Step 3: Start the dev server in the background**

Run: `npm run dev` (leave running for the rest of the plan)
Expected: Astro reports a local URL, typically `http://localhost:4321/`.
Open `http://localhost:4321/services/bridal-beauty` in a browser to establish a baseline. Take a mental snapshot of the four sections you'll be editing: Signature Services, Bridesmaids & Guests, Event Make-up and Hair. The Luxury Packages section is **not** changed.

- [ ] **Step 4: Confirm the production build is currently green**

Run: `npm run build`
Expected: build completes successfully. (If it fails on `main`, stop and report — don't layer changes on a broken build.)

---

## Task 1: Extend the services data with the new optional fields

**Files:**
- Modify: `src/data/services.ts:18-23` (signatureServices)
- Modify: `src/data/services.ts:69-71` (eventServices)

- [ ] **Step 1: Add `includes` to "Full Bridal Beauty" and `priceNote` to "Pre or Next-Day Styling"**

Replace the existing `signatureServices` block (lines 18–23) with:

```ts
export const signatureServices = [
  {
    name: "Full Bridal Beauty (Makeup & Hair)",
    price: "€450",
    includes: [
      "Facial massage & skin preparation",
      "Toners, moisturizers & serums",
      "Full coverage for chest, shoulders & back",
      "Premium false lashes",
      "Veil placement assistance",
    ],
  },
  { name: "Bridal Makeup or Hair", price: "€230" },
  { name: "Bridal Trial (Makeup & Hair)", price: "€100" },
  {
    name: "Pre or Next-Day Styling",
    price: "€250",
    priceNote:
      "Price applies when booked in combination with another bridal service. Otherwise, the price is €350.",
  },
];
```

Why this shape: optional fields keep existing rendering for the two simple rows untouched. The page template will use `{service.includes && ...}` and `{service.priceNote && ...}` guards.

- [ ] **Step 2: Add `description` to the Event Make-up and Hair entry**

Replace the existing `eventServices` block (lines 69–71) with:

```ts
export const eventServices = [
  {
    name: "Event Make-up and Hair",
    price: "€150",
    description:
      "Professional makeup and hairstyling for any special occasion, tailored to your personal style.",
  },
];
```

- [ ] **Step 3: Verify the file is still valid**

Run: `npm run build`
Expected: build completes. (Astro compiles `.ts` data files as part of the build; a syntax error here will fail the build.)

- [ ] **Step 4: Commit**

```bash
git add src/data/services.ts
git commit -m "chore(services): extend service data with includes, priceNote, and description fields"
```

---

## Task 2: Render the "Includes" list under Full Bridal Beauty

**Files:**
- Modify: `src/pages/services/bridal-beauty.astro:54-66` (Signature Services list block + footer note)

**Design intent:** Show the includes inline, directly under the row (the client's preferred option). Keep it light: small caps eyebrow is overkill — use a simple bulleted list in the existing grey/serif vocabulary with a subtle gold marker. This must not visually outweigh the other rows; treat it as a discreet annotation under the parent row.

- [ ] **Step 1: Replace the Signature Services list block**

Find the existing block (lines 54–66):

```astro
      <div class="space-y-0" data-reveal>
        {signatureServices.map((service, i) => (
          <div class="flex items-center justify-between py-5 border-b border-gold/20" style={`transition-delay: ${i * 80}ms`}>
            <span class="text-base md:text-lg font-serif text-charcoal">{service.name}</span>
            <span class="text-sm font-sans font-medium text-gold ml-4 whitespace-nowrap">Starting from {service.price}</span>
          </div>
        ))}
      </div>

      <p class="mt-10 text-sm text-grey/80 text-center leading-relaxed" data-reveal>
        All bridal services include Professional Skin Preparation, Relaxing Facial Massage, Premium False Lashes, and Veil Styling.
      </p>
```

Replace with (note: the generic "All bridal services include..." paragraph at the bottom is now redundant with the explicit Includes list and is removed — confirm with the user only if they push back; otherwise proceed):

```astro
      <div class="space-y-0" data-reveal>
        {signatureServices.map((service, i) => (
          <div class="border-b border-gold/20" style={`transition-delay: ${i * 80}ms`}>
            <div class="flex items-center justify-between py-5">
              <span class="text-base md:text-lg font-serif text-charcoal">{service.name}</span>
              <span class="text-sm font-sans font-medium text-gold ml-4 whitespace-nowrap">
                Starting from {service.price}{service.priceNote ? '*' : ''}
              </span>
            </div>
            {service.includes && (
              <ul class="pb-5 -mt-1 space-y-1.5 text-sm text-grey/90 leading-relaxed">
                {service.includes.map((item) => (
                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-1 h-1 rounded-full bg-gold/60 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
```

Why these choices:
- The row wrapper became `<div class="border-b border-gold/20">` with the price row as an inner flex; this keeps the gold rule under the *whole* item (row + includes) rather than splitting them visually.
- `text-grey/90` with `text-sm` is one notch lighter and smaller than the row label, so the includes read as supporting detail.
- The bullet uses a `w-1 h-1 rounded-full bg-gold/60` dot (matches the existing gold-dot dividers used on the page) instead of a list-disc — minimal and on-brand.
- The asterisk on price is appended here in the same span so it follows the price tightly. The footnote text is rendered in Task 3.

- [ ] **Step 2: Visual check in browser**

Reload `http://localhost:4321/services/bridal-beauty`.
Expected:
- Under "Full Bridal Beauty (Makeup & Hair)" you see the 5 bullets, each preceded by a small gold dot.
- The other three rows render exactly as before.
- "Pre or Next-Day Styling" now shows `€250*` (the asterisk only — the footnote text comes in Task 3).
- The "All bridal services include…" paragraph is gone.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/bridal-beauty.astro
git commit -m "feat(services): show includes list inline under Full Bridal Beauty"
```

---

## Task 3: Add the footnote for Pre or Next-Day Styling

**Files:**
- Modify: `src/pages/services/bridal-beauty.astro` (Signature Services section — directly after the `</div>` that closes the `space-y-0` list wrapper)

**Design intent:** A single small italic line, gold-aligned with the section's existing typography, sitting where the removed "All bridal services include…" paragraph used to live. The asterisk character at the start anchors it to the price superscript above.

- [ ] **Step 1: Insert the footnote paragraph after the Signature Services list**

Immediately after the closing `</div>` of the Signature Services `space-y-0` block (the same place where the old "All bridal services include…" paragraph was), insert:

```astro
      {signatureServices.some((s) => s.priceNote) && (
        <p class="mt-8 text-xs text-grey/70 text-center leading-relaxed italic" data-reveal>
          {signatureServices.find((s) => s.priceNote)!.priceNote!.replace(/^/, '* ')}
        </p>
      )}
```

If TypeScript strictness in the Astro frontmatter complains about the non-null assertions (`!`), use this equivalent without assertions:

```astro
      {signatureServices.some((s) => s.priceNote) && (
        <p class="mt-8 text-xs text-grey/70 text-center leading-relaxed italic" data-reveal>
          {`* ${signatureServices.find((s) => s.priceNote)?.priceNote ?? ''}`}
        </p>
      )}
```

Why:
- `text-xs` + `text-grey/70` + `italic` reads clearly as a footnote without competing with the row prices.
- Driving the text from the data (rather than hardcoding) keeps content centralized in `services.ts`.
- The `.some()` guard means the paragraph disappears entirely if no row has a priceNote — future-proof.

- [ ] **Step 2: Visual check**

Reload the page.
Expected: below the Signature Services rows you see a small centered italic line:
`* Price applies when booked in combination with another bridal service. Otherwise, the price is €350.`

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/bridal-beauty.astro
git commit -m "feat(services): add footnote for Pre or Next-Day Styling combo pricing"
```

---

## Task 4: Add "Group packages available for up to 20 people" under Bridesmaids & Guests

**Files:**
- Modify: `src/pages/services/bridal-beauty.astro:90-92` (Bridesmaids & Guests footer paragraph)

**Design intent:** Append the new line to the existing italic note. Two short lines stack cleanly; we keep the existing italic tone and just split into two paragraphs so each idea gets its own breathing room.

- [ ] **Step 1: Replace the existing footer paragraph block**

Find (lines 90–92):

```astro
      <p class="mt-10 text-sm text-grey/80 text-center leading-relaxed italic" data-reveal>
        Bespoke packages and exclusive rates are available for group bookings.
      </p>
```

Replace with:

```astro
      <div class="mt-10 text-center space-y-2" data-reveal>
        <p class="text-sm text-grey/80 leading-relaxed italic">
          Bespoke packages and exclusive rates are available for group bookings.
        </p>
        <p class="text-sm text-grey/80 leading-relaxed italic">
          Group packages available for up to 20 people.
        </p>
      </div>
```

Why a wrapper `<div>` with `space-y-2`: keeps the two lines as a visually unified note while preserving the existing margin rhythm (`mt-10`).

- [ ] **Step 2: Visual check**

Reload the page.
Expected: under the Bridesmaids row you see two centered italic lines, the second being "Group packages available for up to 20 people."

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/bridal-beauty.astro
git commit -m "feat(services): add group packages availability line under Bridesmaids & Guests"
```

---

## Task 5: Render the description under Event Make-up and Hair

**Files:**
- Modify: `src/pages/services/bridal-beauty.astro:108-115` (Event services list block)

**Design intent:** The description should sit under the row, in the same lighter grey serif voice used for the includes — but as flowing prose, not a bulleted list, since it's a single descriptive sentence.

- [ ] **Step 1: Replace the Event services list block**

Find (lines 108–115):

```astro
      <div class="space-y-0" data-reveal>
        {eventServices.map((service, i) => (
          <div class="flex items-center justify-between py-5 border-b border-gold/20" style={`transition-delay: ${i * 80}ms`}>
            <span class="text-base md:text-lg font-serif text-charcoal">{service.name}</span>
            <span class="text-sm font-sans font-medium text-gold ml-4 whitespace-nowrap">Starting from {service.price}</span>
          </div>
        ))}
      </div>
```

Replace with:

```astro
      <div class="space-y-0" data-reveal>
        {eventServices.map((service, i) => (
          <div class="border-b border-gold/20" style={`transition-delay: ${i * 80}ms`}>
            <div class="flex items-center justify-between py-5">
              <span class="text-base md:text-lg font-serif text-charcoal">{service.name}</span>
              <span class="text-sm font-sans font-medium text-gold ml-4 whitespace-nowrap">Starting from {service.price}</span>
            </div>
            {service.description && (
              <p class="pb-5 -mt-1 text-sm text-grey/90 leading-relaxed">
                {service.description}
              </p>
            )}
          </div>
        ))}
      </div>
```

This mirrors the row-wrapper pattern from Task 2 so a future second event service with a description renders consistently.

- [ ] **Step 2: Visual check**

Reload the page.
Expected: under "Event Make-up and Hair €150" you see "Professional makeup and hairstyling for any special occasion, tailored to your personal style." in the lighter grey supporting style.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/bridal-beauty.astro
git commit -m "feat(services): add description under Event Make-up and Hair"
```

---

## Task 6: Optional — add an accompanying image to each of the three list sections

**Files:**
- Modify: `src/pages/services/bridal-beauty.astro` (three sections: Signature Services, Bridesmaids & Guests, Event Make-up and Hair)

**Design intent:** The client said *"if we can have corresponding photos in each column"* — soft request. We add **one small, centered, portrait-aspect image** above each section's eyebrow text. Small and centered keeps the page's minimal feel; a portrait crop pairs well with single-column lists and reads as editorial rather than catalog. We do **not** add an image to the Luxury Packages section (it's already a 3-card grid and adding three more images would crowd it).

**Image assignments** (use these exact paths — they exist in `/public/images/services/`):
- Signature Services → `/images/services/bridal-makeup.jpg`
- Bridesmaids & Guests → `/images/services/natural-blonde-bride.jpg`
- Event Make-up and Hair → `/images/services/bridal-curls-halfup.jpg`

If any of those don't visually fit when checked in the browser, swap with another image from the existing set:
`bridal-closeup.jpg`, `bridal-curls-halfup.jpg`, `bridal-makeup.jpg`, `natural-blonde-bride.jpg`, `natural-bridal.jpg`.

- [ ] **Step 1: Add image to Signature Services**

In the Signature Services section, find this block (the `<div class="text-center mb-14" data-reveal>` containing the eyebrow + heading):

```astro
      <div class="text-center mb-14" data-reveal>
        <p class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-4">
          Signature Services
        </p>
        <h2 class="text-display-sm md:text-display font-serif italic text-charcoal">
          Bridal Beauty Services
        </h2>
      </div>
```

Replace with:

```astro
      <div class="text-center mb-14" data-reveal>
        <div class="w-48 md:w-56 mx-auto mb-8 overflow-hidden">
          <img
            src="/images/services/bridal-makeup.jpg"
            alt="Bridal makeup application"
            class="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </div>
        <p class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-4">
          Signature Services
        </p>
        <h2 class="text-display-sm md:text-display font-serif italic text-charcoal">
          Bridal Beauty Services
        </h2>
      </div>
```

- [ ] **Step 2: Add image to Bridesmaids & Guests**

In the Bridesmaids & Guests section, find:

```astro
      <div class="text-center mb-14" data-reveal>
        <p class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-4">
          For Your Loved Ones
        </p>
        <h2 class="text-display-sm md:text-display font-serif italic text-charcoal">
          Bridesmaids &amp; Guests
        </h2>
      </div>
```

Replace with:

```astro
      <div class="text-center mb-14" data-reveal>
        <div class="w-48 md:w-56 mx-auto mb-8 overflow-hidden">
          <img
            src="/images/services/natural-blonde-bride.jpg"
            alt="Bridesmaid styling in soft natural light"
            class="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </div>
        <p class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-4">
          For Your Loved Ones
        </p>
        <h2 class="text-display-sm md:text-display font-serif italic text-charcoal">
          Bridesmaids &amp; Guests
        </h2>
      </div>
```

- [ ] **Step 3: Add image to Event Make-up and Hair**

In the Event Make-up and Hair section, find:

```astro
      <div class="text-center mb-14" data-reveal>
        <p class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-4">
          Beyond the Wedding
        </p>
        <h2 class="text-display-sm md:text-display font-serif italic text-charcoal">
          Event Make-up and Hair
        </h2>
      </div>
```

Replace with:

```astro
      <div class="text-center mb-14" data-reveal>
        <div class="w-48 md:w-56 mx-auto mb-8 overflow-hidden">
          <img
            src="/images/services/bridal-curls-halfup.jpg"
            alt="Half-up curls hair styling"
            class="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        </div>
        <p class="text-[10px] font-sans font-medium tracking-ultra-wide uppercase text-gold mb-4">
          Beyond the Wedding
        </p>
        <h2 class="text-display-sm md:text-display font-serif italic text-charcoal">
          Event Make-up and Hair
        </h2>
      </div>
```

- [ ] **Step 4: Visual check across viewports**

Reload the page. Then:
- Resize the browser to mobile width (~375px) and confirm the images stay centered and don't overflow.
- Confirm the images don't make the page feel "heavy" — they should sit as quiet visual anchors. If any feels too prominent, swap to a more subtle shot from the available image set.
- Confirm `data-reveal` fade-in still triggers on the section (it's on the parent `<div class="text-center mb-14" data-reveal>`, so adding the inner image div doesn't break it).

- [ ] **Step 5: Commit**

```bash
git add src/pages/services/bridal-beauty.astro
git commit -m "feat(services): add accompanying section images to bridal beauty page"
```

---

## Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build completes with no errors. Astro will type-check inline expressions as part of the build.

- [ ] **Step 2: Preview production build**

Run: `npm run preview`
Open the previewed URL → `/services/bridal-beauty`.
Expected: identical rendering to the dev server. Images load. No console errors.

- [ ] **Step 3: Cross-check the four client requests**

Walk the page top to bottom and confirm each:
1. Full Bridal Beauty row → 5 bullet items render directly underneath. ✓
2. Pre or Next-Day Styling → price shows `€250*`, footnote at section end matches the exact copy. ✓
3. Bridesmaids & Guests → "Group packages available for up to 20 people." appears as a second italic line under the existing one. ✓
4. Event Make-up and Hair → description "Professional makeup and hairstyling for any special occasion, tailored to your personal style." renders under the row. ✓
5. (Optional, if Task 6 was done) Each list section has a small portrait image above its heading. ✓

- [ ] **Step 4: Confirm nothing else regressed**

Quick scan of the rest of `/services/bridal-beauty`: hero, philosophy paragraph, Luxury Packages cards, Booking & Travel grid, CTA. None should have changed.

Also check `/services` (the index) and `/services/wedding-planning` for any unintended side effects (there shouldn't be — neither imports from the modified data fields, but `services.ts` is shared so a quick load-and-look is cheap insurance).

- [ ] **Step 5: Stop the dev server**

The plan is complete. Stop the background `npm run dev` process.

---

## Summary of commits this plan produces

1. `chore(services): extend service data with includes, priceNote, and description fields`
2. `feat(services): show includes list inline under Full Bridal Beauty`
3. `feat(services): add footnote for Pre or Next-Day Styling combo pricing`
4. `feat(services): add group packages availability line under Bridesmaids & Guests`
5. `feat(services): add description under Event Make-up and Hair`
6. `feat(services): add accompanying section images to bridal beauty page` (optional)

## Open questions for the user (decide before starting Task 2 / Task 6)

- **Task 2:** The proposed plan removes the redundant footer paragraph "All bridal services include Professional Skin Preparation, Relaxing Facial Massage, Premium False Lashes, and Veil Styling." once the per-row Includes list is in place. Confirm this is acceptable — otherwise we'd be saying the same thing twice on the page.
- **Task 6:** Confirm the soft request for "photos in each column" should land as one centered portrait image above each of the three list sections (Signature, Bridesmaids, Event), as opposed to a side-by-side image+content split or a single hero strip. The proposed approach is the lightest-touch interpretation; ask the user if they had something different in mind.
