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
6. **Design tokens** — brand **fonts are now resolved** via the dev2 merge (DIN Next bundled, wired in `assets/base.css`; see §11, incl. the `@font-face` caveat). Still open: should brand **colours** be mapped into Kalles **theme colour schemes** (preferred, reusable) or only applied within `custom_yaman.css` scopes?
7. **Per-instance reuse** — do you want a `custom_class` / `section_unique_class` text setting added to each new section now (for multi-instance scoping), or only where a section is actually reused?
8. **Header / announcement / footer** — confirm these are restyled at the end (not rebuilt as body sections).

## 10. Implementation log

### Section 1 — Hero (`slideshow-n`) — DONE
- **New block `blocks/_slide-item-n.liquid`** (the shared `_slide-item` was left untouched). Reason: the original block is overlap-only (theme `hdt-media-overlap-content`) and uses nested child blocks; it can't cleanly produce the mobile black-panel-above-image stack. The new block uses direct settings + purpose-built markup (`.hdt-yaman-hero__*`).
- **`sections/slideshow-n.liquid`** rewritten as "YAMAN Hero Slideshow": reuses the Kalles `<hdt-slideshow>` slider/dots/arrows mechanics, points at `_slide-item-n`, trimmed hero-focused schema, clean name + 3-slide preset. Later updated to the 4 Kalles height modes (`image_height` / `image_height_mb` = adapt_image_first / adapt_image / full / fixed, with `fixed_height` / `fixed_height_mb` + `overlay_opacity`) and pill-style pagination dots (scoped `--pag-*` overrides).
- **CSS** added to `assets/custom_yaman.css`, all scoped under `.hdt-slideshow-n`: mobile-first stacked panel (`#070707`) + image; desktop image background with overlaid left content + dark gradient overlay; cream CTA (`#f5ebdd`); bar-separated meta line; optional mobile heading override + last-line accent.
- **`templates/index.json`**: added `yaman_hero` as the first entry in `order` (above all default sections); defaults untouched.
- Block settings exposed: desktop image, mobile image, heading, mobile-heading override, subheading (richtext), button label/link/new-tab, meta line, accent-last-line toggle, accent colour, panel colour.
- **Manual steps in Shopify:** upload/select per-slide desktop + mobile images; set the CTA `button_link` (currently empty → renders as a disabled link until set).

### Section 2 — Trust icons / badges (`shipping-n`) — DONE
- **New section `sections/shipping-n.liquid`**, built custom (not a literal duplicate): the original `shipping.liquid` uses `<hdt-scrollsnap>` + a column grid and the heavy `_shipping` block (icon themes + nested heading/text). This design needed a simple icon-image + label + link strip, so the new file uses **section-local `badge` blocks** + a **CSS scroll-snap track** (no JS). Original `shipping.liquid` untouched.
- **CSS** added to `assets/custom_yaman.css`, scoped under `.hdt-yaman-trust-badges-section`: full-bleed warm bg, centered max-width container, horizontal no-wrap scroll on desktop + mobile (few items grow to fill the row; many keep a min-width and scroll). Per-instance values via inline `--tb-*` vars from settings.
- **`templates/index.json`**: added `yaman_trust_badges` directly after `yaman_hero` (before the old defaults), with 6 badge blocks in the desktop order.
- ⚠️ **Schema name limit:** the section `name` was initially `YAMAN Trust Icons / Badges` (26 chars) and Shopify rejected it — `Invalid schema: name is too long (max 25 characters)`. Renamed to **`YAMAN Trust Badges`** (18). **Rule going forward: every schema `name` must be ≤ 25 characters** (also recorded in the `kalles-figma-to-shopify-section-workflow` skill).
- 🔧 **Slider fix (follow-up):** the first version used CSS-only `overflow-x:auto` + `scroll-snap`, which didn't behave as a real slider on the storefront (desktop flex-grow left nothing to scroll; no arrows/affordance). Replaced with a scoped JS carousel **`assets/shipping-n.js`** (transform track + prev/next arrows + pointer drag + optional autoplay/loop), loaded via `<script defer>` at the end of `shipping-n.liquid`. The CSS scroll-snap rules were removed; the viewport keeps a **native-scroll fallback** until JS adds `.is-tb-ready`. Items-per-view is derived from a min item width (responsive, not hardcoded). New short settings: **Autoplay**, **Autoplay speed**, **Loop** (default off → backward compatible). JS is scoped to `.hdt-yaman-trust-badges-section`, supports multiple instances, and re-inits on `shopify:section:load`.

### Section 11 — FAQ (`accordion-n`) — MANUAL DUPLICATE READY
> **Correction (supersedes the earlier "Design 3 inside original `accordion.liquid`" note).** The previous plan to add an `accordion_des` **Design 3** option directly inside the original Kalles `sections/accordion.liquid` is **cancelled**. We are back to the standard **duplicate-first** workflow: original Kalles sections stay untouched, and all FAQ work happens in a duplicated/custom file.

- **Base/original (do NOT modify):** `sections/accordion.liquid` — the stock Kalles Accordion. Leave its markup, schema, settings, and presets exactly as Kalles ships them.
- **Custom duplicate (the only file to build the FAQ in):** `sections/accordion-n.liquid` — manually created as a duplicate/custom copy of `accordion.liquid`. **All YAMAN FAQ implementation must target this file**, not the original.
- **No Design 3 on the original.** Do not add new design options (e.g. `accordion_des: 3`) or any YAMAN-specific class/CSS hooks to `sections/accordion.liquid`. Any earlier "Design 3 / `hdt-yaman-faq-section` injected into the original" approach is void.
- **Target design (unchanged), per Figma — desktop `2226:1035`, mobile `2226:2141`:**
  - Heading: **"Clarity before commitment."**
  - Desktop FAQ container **max-width ~776px**, centered; **mobile width 100%** with the screenshot's side padding.
  - **7 FAQ items**, all **collapsed by default**; the plus icon flips to a **minus/open** state when expanded.
  - Clean minimal list (dark-navy text, thin separators between items).
- **Scoping:** style the duplicate under a single custom parent class in `assets/custom_yaman.css` (e.g. `.hdt-yaman-faq-section` / `.hdt-yaman-faq`), so nothing leaks into the original accordion or other sections.
- **Status:** documentation only — `sections/accordion-n.liquid` exists as a manual duplicate and is **ready for implementation**; the FAQ section itself is **not yet implemented/verified in code**. (`templates/index.json` already references `accordion-n` for the `yaman_faq` slot.)
- **Next step:** implement the FAQ inside `sections/accordion-n.liquid` + scoped CSS in `custom_yaman.css`, then verify on the storefront.

> **Project rule — custom YAMAN sections are always duplicate-first (reaffirmed):**
> - For any custom YAMAN homepage section, **always create a duplicated/new section file**; never customize an original Kalles section in place.
> - **Do not add new design options or YAMAN markup/CSS hooks to original Kalles sections** unless the user explicitly approves that exact exception in writing.
> - Default duplicate naming uses the **`-n`** suffix (e.g. `accordion-n.liquid`, `slideshow-n.liquid`, `shipping-n.liquid`) or a `yaman-*` name when building from scratch.
> - The original Kalles file (e.g. `sections/accordion.liquid`) must remain byte-for-byte untouched.

### About Us page — About Video Hero (`banner-video-n`) — DONE (not yet wired into a template)
> First **About Us page** section (separate page from the homepage). About-page custom CSS lives in its **own** file `assets/custom_yaman_about.css` (loaded per-section from the section file), kept separate from the homepage's `assets/custom_yaman.css`.

- **Base/original (do NOT modify):** `sections/about-us.liquid` — this theme has no `banner-video.liquid`; the **About us** section *is* the Kalles banner-video hero (full-width background image + the `_button_video` block whose `<hdt-video-popup>` custom element drives the play button + video modal). Left byte-for-byte untouched.
- **New custom section:** `sections/banner-video-n.liquid` — "YAMAN About Video". Reuses the Kalles `_button_video` block **statically** (`content_for "block", type: "_button_video", id: 'about-video-btn'`) so the video popup works with **zero custom JS** (no Kalles/`.min` JS touched). Background is an image; the actual video plays in the popup (YouTube/Vimeo/Shopify-hosted, inline or popup modal — all from the block's own settings).
- **Reframed for the hero:** direct section settings for eyebrow / heading / subtitle (instead of the original's image+signature blocks), desktop + mobile image pickers, overlay (color + opacity), text color, play button (size, border color, icon color, desktop X/Y position), desktop/mobile height modes (Adapt to image / Fixed / Fill screen), desktop content alignment + vertical position, mobile alignment, content max-width, full-width toggle, color scheme, and the original margin/padding (`mg/mg_mb/pd/pd_mb` via `spacing-vars`).
- **Layout:** one DOM, two behaviors. Desktop → content is a centered max-width column, left-aligned text; play button floats over the media via X/Y %. Mobile → centered stack in DOM order eyebrow → play → heading → subtitle (play in normal flow, matching Figma). Separate desktop/mobile image pickers (mobile falls back to desktop). `object-fit: cover`.
- **CSS** added to **`assets/custom_yaman_about.css`** (new file), all scoped under `.hdt-yaman-about-video-section` → `.hdt-yaman-about-video__{media,overlay,content,eyebrow,heading,subtitle,play}`. **Not** in `custom_yaman.css`.
- **Schema names ≤ 25 chars:** section name + preset name both `YAMAN About Video` (17). Insertable from the theme editor via its preset.
- **`templates/*.json`: NOT modified.** Likely target is `templates/page.about-us.json` (insert at the top of `order`), but it holds saved customizer data and is editor-managed — **pending the owner's confirmation of which template to wire it into.**
- **Manual steps:** in the theme editor, add the "YAMAN About Video" section to the About page; upload/select desktop + mobile background images; set the play button's video source (YouTube/Vimeo URL or Shopify video) and inline-vs-popup behavior on the "Play video" block.

### About Us page — Brand Story (`image-with-text-n`) — DONE (not yet wired into a template)
- **Base/original (do NOT modify):** `sections/image_text.liquid` — the canonical Kalles "Image with text" (loads `assets/hdt-image-with-text.css`, block-based: `section-heading` + `_image-text-column`/`_image-text-col` with nested heading/text/spacer/button/countdown). Left untouched.
- **New custom section:** `sections/image-with-text-n.liquid` — "YAMAN Story". Built duplicate-derived but with **direct, dynamic settings** (eyebrow / heading / paragraph 1 / paragraph 2 / optional button) instead of the original's nested-block soup, matching the Figma Brand Story layout and the requested setting list.
- **Preserved Kalles capabilities:** the `spacing-vars` + `section_layout` (container / wrapper_container / full_width) parent/child structure, `colors_by_section` + `color_scheme` + `background_opacity`, `section_background` image + `hdt_background_parallax`, and `mg/mg_mb/pd/pd_mb`. Also kept a button (label/link/new-tab/style) so the Image-with-text button capability survives even though the preset leaves it empty.
- **New YAMAN settings:** desktop + mobile image pickers (mobile falls back to desktop), image alt, image aspect ratio (adapt/square/portrait/landscape/wide), desktop+mobile corner radius, eyebrow, heading, two richtext paragraphs, desktop image position (left/right), mobile image position (top/bottom), desktop vertical alignment, desktop+mobile text alignment, content max-width, desktop+mobile gap, and background/heading/body/eyebrow colors.
- **Layout:** CSS grid. Desktop → 2 columns (image left by default, text right), vertically centered, configurable gap; the cream **background is full-bleed** (applied to `#shopify-section-<id>` via the section's `{% style %}`) while content stays in a centered max-width container. Mobile → single column, image on top, text below (DOM order preserved), left-aligned. `object-fit: cover`, responsive `clamp()` for heading/spacing.
- **CSS** appended to **`assets/custom_yaman_about.css`** (same About-page file as the hero), all scoped under `.hdt-yaman-story-section` → `.hdt-yaman-story__{container,media,image,content,eyebrow,heading,text,paragraph,cta}`. **Not** in `custom_yaman.css`.
- **Schema names ≤ 25 chars:** section name + preset name both `YAMAN Story` (11). 43 settings. `disabled_on.groups: ["header","footer"]`. Insertable from the theme editor via its preset.
- **`templates/*.json`: NOT modified.** No template currently references `banner-video-n`, so the About template/placement isn't yet confirmed — the section is added manually from the editor (or after the About hero once that template is wired).
- **Manual steps:** in the editor, add "YAMAN Story" to the About page (below the About hero); upload/select the desktop (+ optional mobile) composed Brand Story image; optionally set a button label/link.

### About Us page — Brands / Stats (`shipping-about-n`) — DONE (not yet wired into a template)
- **Base/original (do NOT modify):** `sections/shipping.liquid` — the Kalles Shipping section (icon `_shipping` blocks + nested heading/text/spacer/HTML + `<hdt-scrollsnap>` carousel + column grid). Left untouched. The homepage trust-badges file `sections/shipping-n.liquid` was **not** touched or reused.
- **New custom section:** `sections/shipping-about-n.liquid` — "YAMAN Brands". The icon + nested-block + scrollsnap system is replaced with simple, dynamic **`stat`** blocks (value / label / optional link) and a CSS-grid panel matching the Figma Brands stats design. Classic section-local blocks (`{% for block in section.blocks %}`), so the merchant can add/remove/reorder stats from the editor.
- **Preserved Kalles capabilities:** `spacing-vars` + `section_layout` (container / wrapper_container / full_width), `colors_by_section` + `color_scheme` + `background_opacity`, `section_background` image + `hdt_background_parallax`, `mg/mg_mb/pd/pd_mb`, and the desktop/mobile column-count controls reusing the original **`col_dk` / `col_mb`** setting IDs. (The tablet `col_tb` control was dropped: a single 768px breakpoint cleanly delivers the 4-desktop / 2-mobile design and keeps the divider logic correct.)
- **New YAMAN settings:** heading, section background color, panel background color, container max-width, container horizontal padding, panel border radius, desktop+mobile item gap, show/hide dividers + divider color, value color, label color, heading color. Each `stat` block = value + label + optional link.
- **Layout:** white/light section, centered `Brands` heading, then a centered max-width cream **panel** (rounded). Desktop → 4 stats in one row; mobile → 2×2 grid. Values large gold, labels dark navy, centered. Section bg color is applied full-bleed to `#shopify-section-<id>`; the panel is the cream card.
- **Dividers:** subtle, vertically-centered short lines (`::before`, 56% height) sitting in the column gap to the **left** of each item; shown only on non-first-in-row items via `:nth-child` rules keyed off `data-cols-dk` / `data-cols-mb`, so there are **no horizontal lines** and the leftmost column never shows a stray divider — adapts cleanly to 2-col mobile and 2–6-col desktop. Toggle via "Show dividers".
- **CSS** appended to **`assets/custom_yaman_about.css`**, scoped under `.hdt-yaman-brands-section` → `.hdt-yaman-brands__{heading,panel,grid,item,value,label,link}` + `::before` divider. **Not** in `custom_yaman.css`.
- **Schema names ≤ 25 chars:** section + preset both `YAMAN Brands` (12); block name `Stat`. 32 settings, `max_blocks: 8`, `disabled_on.groups: ["header","footer"]`. Insertable from the editor via its preset.
- **`templates/*.json`: NOT modified.** Add manually from the editor (below the About Brand Story section) once the About template is confirmed.
- **Manual steps:** in the editor, add "YAMAN Brands" to the About page; the 4 default stats are pre-filled — edit/add/remove/reorder as needed; tune panel/value/label/divider colors if required.

### About Us page — Technology / Core Values (`about-tech-n`) — DONE (not yet wired into a template)
- **Base/original (do NOT modify):** `sections/about-us.liquid` — the Kalles full-width background-image + overlay banner (same base as the About Video hero). `slideshow.liquid` was deliberately **not** used: this is a single static banner, not a carousel, so the slideshow's slide/dots/`<hdt-slideshow>` machinery would be dead weight. Original untouched.
- **New custom section:** `sections/about-tech-n.liquid` — "YAMAN Tech". Mirrors the proven About-hero architecture (full-bleed media + dark overlay + height modes + left content) and swaps the play button for dynamic **`stat`** blocks (value / label) + a small note + an optional bottom hairline, matching the Figma technology banner.
- **Preserved/adapted Kalles capabilities:** full-width vs container, color scheme, background image + the 3 height modes (Adapt to image / Fixed / Fill screen) for desktop **and** mobile, overlay, content alignment + vertical position, `spacing-vars` margin/padding (`mg/mg_mb/pd/pd_mb`).
- **New YAMAN settings:** desktop + mobile background image pickers (mobile falls back to desktop), desktop/mobile image focus (object-position), overlay color + opacity, eyebrow, heading (inline richtext, uppercased via CSS), note, eyebrow/note color, heading color, stat value color, stat label color, show/hide bottom line + line color, desktop/mobile height + fixed heights, desktop content alignment + vertical position, mobile alignment, content max-width.
- **Stats:** classic section-local `stat` blocks (value + label) → add/remove/reorder in the editor (`max_blocks: 6`); 2 defaults (`380 / Patents`, `981 / Intellectual Property Rights`).
- **Layout:** full-bleed cover image + overlay; centered max-width content layer, left-aligned by default. The content column fills the banner height so the **bottom line is pinned to the bottom** (eyebrow → heading → stats → note grouped via vertical-position setting, line below). Stats are a flex row (stays on one row on mobile). `object-fit: cover`, responsive `clamp()`.
- **CSS** appended to **`assets/custom_yaman_about.css`**, scoped under `.hdt-yaman-tech-section` → `.hdt-yaman-tech__{media,img,overlay,container,content,body,eyebrow,heading,stats,stat,stat-value,stat-label,note,line}`. **Not** in `custom_yaman.css`.
- **Schema names ≤ 25 chars:** section + preset both `YAMAN Tech` (10); block `Stat` (4). 38 settings, `disabled_on.groups: ["header","footer"]`. Insertable from the editor via its preset.
- **`templates/*.json`: NOT modified.** Add manually from the editor (below the Brands section) once the About template is confirmed.
- **Manual steps:** add "YAMAN Tech" to the About page; upload/select the desktop (+ optional mobile) technology background image; edit/reorder the stat blocks; tune overlay opacity, height, image focus, and colors.

## 11. Merge log

### 2026-06-15 — merged `main` (dev2: general settings + header + brand fonts) into `dev1`
Merge commit `733f29c`; dev2 work in `7ed08c3`, `260f454`.

**Brand fonts — "DIN Next" (this is the "correct font")**
- Added to `assets/`: `DINNextLTW23-Regular.woff2` (400), `DINNextLTW23-Medium.woff2` (500), `DINNextLTArabic-Bold.woff2` (700, Arabic).
- `@font-face` + tokens added to **`assets/base.css`** (a Kalles original, edited by dev2): `--font-body-family: 'DIN Next LT'`, `--font-heading-family: 'DIN Next Arabic'`, applied to `body` and `h1–h3`.
- `layout/theme.liquid` preloads `DINNextLTArabic-Bold.woff2`.
- **Impact on our hero:** the heading is an `<h2>` → now inherits `--font-heading-family` automatically; CTA/body text inherits `--font-body-family`. `custom_yaman.css` hardcodes no font-family, so nothing to change there.
- ✅ **Resolved (2026-06-15):** the `@font-face` `src` in `base.css` originally used Liquid `{{ "…woff2" | asset_url }}`, which doesn't render inside a static `.css` (so the web fonts wouldn't load for visitors without DIN Next installed locally — why it looked fine on the dev machine). Replaced with the store's direct Shopify **Files** CDN URLs (e.g. `https://cdn.shopify.com/s/files/1/0834/2061/0802/files/DINNextLTW23-Regular.woff2?v=1781544465`), which load statically for everyone. The `theme.liquid` Arabic-bold `<link rel="preload">` was pointed at the same CDN URL so the preload is actually used.

**New custom CSS files (dev2 convention)**
- `assets/custom-general.css` (loaded globally, preload), `assets/custom-product.css` (product templates with a suffix), `assets/custom-collection.css` (collection templates, no suffix) — all wired in `layout/theme.liquid`. Currently **empty placeholders**. YAMAN homepage CSS stays in `assets/custom_yaman.css`; coordinate before mixing conventions.

**`layout/theme.liquid`**
- Added the font preload + the three custom CSS loads; `<body>` class now includes `{{ template.name }}`. Our `custom_yaman.css` load (right after `css-variables`) is preserved.

**Header / announcement bar (dev2 customization, part 1)**
- Modified `sections/header-group.json`, `sections/header-inline-blocks.liquid`, `snippets/header_group_icons.liquid`, `blocks/_menu_mobile.liquid`; added `assets/burger-menu.svg`, `assets/cart.svg`; general tweaks in `config/settings_data.json` (e.g. button font size 16→14). This is the header/announcement restyle the plan deferred to the end — now owned by dev2.
