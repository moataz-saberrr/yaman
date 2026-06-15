# YAMAN Homepage Project Plan

Conversion of the YAMAN Figma homepage into the **Kalles v5.4.2** Shopify theme, built section by section.

> Working rules live in `CLAUDE.md` ("YAMAN homepage project — working rules"). This document is the plan + section breakdown. Nothing in the homepage design is implemented yet — this is the audit/setup baseline.

---

## 1. Project goal

Rebuild the YAMAN homepage to match the Figma design, as native Online Store 2.0 sections inside the existing Kalles theme, **without modifying any original Kalles file**. Each section is built as a duplicated or new section, fully editable from the Shopify theme editor (dynamic content via schema settings, merchant-selected images), and styled through one scoped custom stylesheet.

## 2. Source design links

- **Figma — full homepage (desktop):** https://www.figma.com/design/Trt4q5RMlZSIeYDot3aqEY/YAMAN-auto-layout-Rahma--Copy-?node-id=2226-118
  - Root frame `Home page (Moataz)` — 1440 × ~9083 px (`node-id 2226:118`).
- **Figma — full homepage (mobile):** https://www.figma.com/design/Trt4q5RMlZSIeYDot3aqEY/YAMAN-auto-layout-Rahma--Copy-?node-id=2226-1196
  - Root frame `auto layout (Moataz)` — 485 × ~10037 px (`node-id 2226:1196`). Mobile frames carry the clean section names used below.
- Reference screenshots (desktop, mobile, folder structure) provided by the store owner.

## 3. Current theme notes

- **Theme:** Kalles v5.4.2 by The4. Online Store 2.0, Liquid + vanilla-JS custom elements + plain CSS. **No build step / bundler.** `*.min.*` files are prebuilt — never edit.
- **Layout shell:** `layout/theme.liquid` renders the head via snippets (`css-variables`, `js-variables`, `scripts`, `social-meta-tags`) and composes `header-group` / `footer-group` section groups.
- **Global CSS** is loaded inside `snippets/css-variables.liquid` (`base.css`, `theme.css`, `product-card.css`, `collection-products.css`). Most sections additionally load their own stylesheet via `{{ '…' | asset_url | stylesheet_tag }}`.
- **Homepage template:** `templates/index.json`. Currently renders the **default Kalles demo sections**, in order: `slideshow` → `collections-list-manual` → `featured-collection` → `banners` → `featured-collection` → `blog-post` → `lookbook-carousel` → `shipping`. These stay until the new homepage is complete.
- **Naming:** the theme namespaces everything with the `hdt-` prefix (CSS classes, body classes, custom elements). New scope classes follow this prefix.
- **Hero / slideshow internals:** `sections/slideshow.liquid` is a single-slide-per-view `<hdt-slideshow>` carousel that renders `_slide-item` blocks (`blocks/_slide-item.liquid`). Each slide owns the image picker (`image` + optional `image_mb`), link, content position, and nested `heading` / `text` / `spacer` / `button` blocks. The hero in Figma is a 3-slide slideshow with pagination dots — a direct match.

## 4. Current constraints

1. Do **not** edit original Kalles sections / snippets / blocks / CSS / JS, and never `*.min.*`.
2. Editable: duplicated/new section & block files, new custom CSS/JS, markdown docs, and explicitly-needed setup files (`layout/theme.liquid`).
3. All custom CSS goes in **`assets/custom_yaman.css`**, scoped under a unique per-section parent class.
4. Content must be **dynamic via schema settings**; no hardcoded copy beyond temporary placeholders; storefront text in `locales/`.
5. **No Figma images** are uploaded/hardcoded by the build — sections expose image-picker settings; the owner uploads/selects images in Shopify.
6. `templates/index.json` is **not** modified until a section is actually wired in (new sections go *above* the old defaults; defaults removed only at the end).

## 5. Proposed homepage section breakdown

Top-level frames from Figma, mapped to a Shopify approach. "Duplicate" = copy the closest Kalles section then customize the copy; "New" = build from scratch (no suitable Kalles base).

| # | Section (Figma) | Desktop id / Mobile id | Approach | Closest Kalles base | Proposed file | Scope class |
|---|-----------------|------------------------|----------|---------------------|---------------|-------------|
| — | Announcement Bar | 2226:120 / 2226:1197 | Existing (header-group) | announcement bar | restyle later | — |
| — | Header / Nav | 2226:124 / 2226:1201 | Existing (header-group) | header | restyle later | — |
| 1 | **Hero** "LIFT. SCULPT. REDEFINE." (3 slides + dots) | 2226:142 / 2226:1222 | **Duplicate (file already created)** | `slideshow.liquid` | `sections/slideshow-n.liquid` ✅ | `hdt-slideshow-n` |
| 2 | **Trust Badges / Features** (icon + label row: SFDA Certified, ISO 13485, 345+ Patents, Clinically Tested, Free Delivery GCC, 30-Day Returns) | 2226:189 / 2226:1246 | **Duplicate** | `shipping.liquid` (icon + heading + text columns) — alt: `icon-box.liquid` | `sections/shipping-n.liquid` | `hdt-yaman-trust` |
| 3 | **Featured Product** "Best Seller — Medi Lift Plus" (image, badge, rating, feature checklist, price, Shop Now) | 2226:209 / 2226:1261 | **Duplicate** (verify fit) | `featured-product.liquid` / `featured-product-2.liquid` | `sections/featured-product-n.liquid` | `hdt-yaman-featured-product` |
| 4 | **Real Results / Clinically Proven** (before-after image cards ×4) **+ Stats row** (93% / 89% / 97% / 85%) | 2226:270 / 2226:1320 + 2226:1443 | **New** | none (before/after + counters not in theme) | `sections/yaman-real-results.liquid` | `hdt-yaman-real-results` |
| 5 | **The 4 YAMAN Sets** (4 set cards + "View all devices") | 2226:410 / 2226:1463 | **Duplicate** | `featured-collection.liquid` (or `collections-list-manual.liquid`) | `sections/featured-collection-n.liquid` | `hdt-yaman-sets` |
| 6 | **Complete Your Routine** (Skincare product carousel + "View all") | 2226:507 / 2226:1560 | **Duplicate** | `featured-collection.liquid` (carousel) | `sections/featured-collection-routine-n.liquid` | `hdt-yaman-routine` |
| 7 | **Science Behind the Glow** (dark horizontal tech-card carousel: DYHP, EMS…) | 2226:584 / 2226:1663 | **New** (reuse carousel mechanics) | carousel from `slideshow` / `featured-collection` | `sections/yaman-science.liquid` | `hdt-yaman-science` |
| 8 | **Discover Your Glow** (video cards + "Shop their routine" + 4.8 rating + review cards) | 2226:698 / 2226:1725 | **New** (or duplicate + combine) | `product-video.liquid` + `testimonial_section.liquid` / `testimonials_2.liquid` | `sections/yaman-discover.liquid` | `hdt-yaman-discover` |
| 9 | **How to Choose** (product-comparison card carousel + "Get personalized recommendation") | 2226:856 / 2226:1972 | **New** (or duplicate carousel) | `featured-collection.liquid` (carousel) | `sections/yaman-how-to-choose.liquid` | `hdt-yaman-how-to-choose` |
| 10 | **Discover Articles** (3 blog cards + "Explore all articles") | 2226:988 / 2226:2094 | **Duplicate** | `blog-post.liquid` / `blog-slider.liquid` | `sections/blog-post-n.liquid` | `hdt-yaman-articles` |
| 11 | **FAQ** "Clarity before commitment" (accordion) | 2226:1035 / 2226:2141 | **Duplicate** | `accordion.liquid` | `sections/accordion-n.liquid` | `hdt-yaman-faq` |
| 12 | **Newsletter** "Join the YAMAN Edit" (email + WhatsApp opt-in) | 2226:1082 / 2226:2187 | **Duplicate** | `newsletter.liquid` | `sections/newsletter-n.liquid` | `hdt-yaman-newsletter` |
| — | Footer | 2226:1099 / 2226:2204 | Existing (footer-group) | footer | restyle later | — |

Notes:
- Desktop combines **Real Results + Stats** into one frame; mobile splits them. Recommended: build as **one** section (`yaman-real-results`) with the stats as a repeatable block row — but it can be split into two sections if preferred.
- Header, announcement bar, and footer are **section groups**, not body sections. They are out of scope for the section-by-section homepage build and will be restyled (via `custom_yaman.css` + group settings) at the end.
- Trust-badge labels differ between the Figma layer names and the rendered comp; either way they will be schema-driven, so exact copy is decided in the editor.

## 6. Suggested implementation order

Build top-to-bottom so the page is reviewable as it grows:

1. **Hero** — `slideshow-n` (first; see §8)
2. Trust badges — `shipping-n`
3. Featured product — `featured-product-n`
4. Real results + stats — `yaman-real-results`
5. The 4 YAMAN sets — `featured-collection-n`
6. Complete your routine — `featured-collection-routine-n`
7. Science behind the glow — `yaman-science`
8. Discover your glow — `yaman-discover`
9. How to choose — `yaman-how-to-choose`
10. Discover articles — `blog-post-n`
11. FAQ — `accordion-n`
12. Newsletter — `newsletter-n`
13. **Wire-up & cleanup:** add new sections into `templates/index.json` *above* the defaults as they are completed; once all are in and QA'd, remove the old default sections; finally restyle header / announcement / footer.

Each section follows the same loop: duplicate (or create) → add scoped markup classes → add scoped CSS to `custom_yaman.css` → expose schema settings (incl. image pickers) → confirm in the editor.

## 7. Files likely involved

- **New / duplicated sections:** `sections/slideshow-n.liquid` (exists), `shipping-n.liquid`, `featured-product-n.liquid`, `yaman-real-results.liquid`, `featured-collection-n.liquid`, `featured-collection-routine-n.liquid`, `yaman-science.liquid`, `yaman-discover.liquid`, `yaman-how-to-choose.liquid`, `blog-post-n.liquid`, `accordion-n.liquid`, `newsletter-n.liquid`.
- **Possibly duplicated blocks:** `blocks/_slide-item-n.liquid` (only if the hero needs structural slide changes beyond CSS), and any block a new section needs that shouldn't reuse the shared Kalles block.
- **Styling:** `assets/custom_yaman.css` (single global custom file — already created & loaded).
- **Optional new JS:** `assets/custom_yaman.js` or a per-feature custom-element file *only if* a section needs new behavior (e.g. before/after comparison slider, stat count-up). Registered as a custom element, never inline; never edit Kalles JS.
- **Wiring (later):** `templates/index.json`.
- **Setup (done this task):** `layout/theme.liquid` (loads `custom_yaman.css`), `CLAUDE.md`, this file.
- **Translations:** `locales/*.default.json` for any storefront strings.

## 8. First section — `sections/slideshow-n.liquid` (hero)

- A faithful **duplicate of `slideshow.liquid`** with the scope class already added to the schema:
  `"class": "hdt-slideshow-n hdt-slideshow hdt-section section-allow-transparent"`.
- Treat **`hdt-slideshow-n`** as the single parent scope for all hero CSS (added in `custom_yaman.css`).
- It renders the shared `_slide-item` block (image picker + nested heading/text/button). Reuse it as-is; only duplicate to `_slide-item-n` if the slide markup must change structurally.
- Figma hero = 3 slides with pagination dots, left-aligned text ("LIFT. SCULPT. REDEFINE.", subcopy, "Shop Medi Lift Plus" button) over a full-width background image. This maps onto existing slideshow settings (fixed/adapt height, dots on, slide content blocks).
- **Cleanups to make when implementing (not before):** the duplicate's schema `name` is currently the literal `"t:sections.slideshow.name n"` (not a valid locale key) and it has no `presets` entry of its own / is not yet in `index.json`. Give it a clean display name (and add hero-specific schema settings/labels) during implementation.
- Images are **not** added by the build — the `image` / `image_mb` pickers are exposed for the owner to upload in the editor.

## 9. Risks / open questions (please confirm before building)

1. **Data source for product groups** — are "The 4 YAMAN Sets", "Complete Your Routine", and "How to Choose" backed by real Shopify **collections/products** (→ use `featured-collection` duplicates, fully dynamic) or are they **manual marketing cards** (→ manual block list)? This decides duplicate-vs-new for #5, #6, #9.
2. **Real Results before/after** — is the before/after an **interactive drag slider** (needs a small custom-element JS) or **static split images**? And should the **stats** (93/89/97/85) animate (count-up) and be **one section with Real Results** or a **separate** section?
3. **Reviews in "Discover Your Glow"** — hardcoded/manual blocks, or pulled from a **reviews app** (Judge.me, Loox, Shopify product reviews, etc.)? Where does the 4.8 star rating come from?
4. **"Get personalized recommendation" (How to Choose)** — does it link to a page, a quiz, or an app?
5. **Newsletter WhatsApp opt-in** — just a checkbox + text, or integrate with a specific WhatsApp/marketing service?
6. **Design tokens** — should YAMAN brand colors/fonts be mapped into Kalles **theme color schemes & typography settings** (preferred, reusable) or only applied within `custom_yaman.css` scopes?
7. **Per-instance reuse** — do you want a `custom_class` / `section_unique_class` text setting added to each new section now (for multi-instance scoping), or only where a section is actually reused?
8. **Header / announcement / footer** — confirm these are restyled at the end (not rebuilt as body sections).

## 10. Implementation log

### Section 1 — Hero (`slideshow-n`) — DONE
- **New block `blocks/_slide-item-n.liquid`** (the shared `_slide-item` was left untouched). Reason: the original block is overlap-only (theme `hdt-media-overlap-content`) and uses nested child blocks; it can't cleanly produce the mobile black-panel-above-image stack. The new block uses direct settings + purpose-built markup (`.hdt-yaman-hero__*`).
- **`sections/slideshow-n.liquid`** rewritten as "YAMAN Hero Slideshow": reuses the Kalles `<hdt-slideshow>` slider/dots/arrows mechanics, points at `_slide-item-n`, trimmed hero-focused schema (+ `hero_min_height`, `hero_image_height_mb`, `overlay_opacity`), clean name + 3-slide preset.
- **CSS** added to `assets/custom_yaman.css`, all scoped under `.hdt-slideshow-n`: mobile-first stacked panel (`#070707`) + image; desktop image background with overlaid left content + dark gradient overlay; cream CTA (`#f5ebdd`); bar-separated meta line; optional mobile heading override + last-line accent.
- **`templates/index.json`**: added `yaman_hero` as the first entry in `order` (above all default sections); defaults untouched.
- Block settings exposed: desktop image, mobile image, heading, mobile-heading override, subheading (richtext), button label/link/new-tab, meta line, accent-last-line toggle, accent colour, panel colour.
- **Manual steps in Shopify:** upload/select per-slide desktop + mobile images; set the CTA `button_link` (currently empty → renders as a disabled link until set).
