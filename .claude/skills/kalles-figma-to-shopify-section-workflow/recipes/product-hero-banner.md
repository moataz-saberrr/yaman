# Recipe — Product Hero / Overlay Banner slider

A reusable pattern for a **full-bleed hero/banner** where the merchant uploads a *composed*
background image (product + empty space) and copy is **overlaid on the empty area**. Supports
multiple slides on the Kalles `<hdt-slideshow>` slider, a **static (schema-driven) star rating**,
and a row of **badge/tab chips** — with **no custom JS** and **no edits to original theme files**.

Use it for product-page heroes, campaign banners, or any "image with text on the empty side"
section. It is generic — swap copy, colors, and breakpoints per project.

---

## When to use / architecture decision

- The design is one composed image per breakpoint (product baked in) + text on the empty area.
- Desktop places copy on one side (e.g. right); mobile stacks copy at the top over the image.
- You need a slider but must not add a slider library.

**Decision:** duplicate-and-extend the theme's existing slideshow/banner section (e.g. a
`*-banner` or `slideshow` section) rather than editing it. The Kalles slideshow custom element
is registered globally, so a new section can reuse its DOM contract for free.

Do **not** build a custom carousel. Do **not** edit the original slideshow/banner section or any
shared badge block — copy the *idea*, not the file.

---

## Kalles `<hdt-slideshow>` DOM contract (must preserve exactly)

```liquid
<hdt-slideshow id="Uniq-{{ section.id }}" class="… hdt-slider hdt-relative hdt-slideshow hdt-slides-1"
  config='{"loop": {{ loop }}, "navUI": {{ show_arrows }}, "dotUI": {{ show_dots }},
           "autoPlay": {{ autoplay_ms }}, "pauseOnHover": true,
           "autoHeight": {{ auto_height }}, "slidesToScroll": 1 }'>
  <div class="… hdt-slider__viewport hdt-relative">
    <div class="hdt-slider__container">
      {%- for block in section.blocks -%}
        <div class="hdt-slider__slide …" {{ block.shopify_attributes }}> … </div>
      {%- endfor -%}
    </div>
  </div>
  {%- if show_arrows -%}<div class="… hdt-navigation …"> prev/next buttons
      (class hdt-slider__button--prev / --next, aria-controls="<slideshow id>") </div>{%- endif -%}
  {%- if show_dots -%}<div hdt-slider-dots aria-controls="<slideshow id>" class="… hdt-slider__dots hdt-pagination …"></div>{%- endif -%}
</hdt-slideshow>
```

- Each `.hdt-slider__slide` must be a **direct child** of `.hdt-slider__container`. If you use a
  local block, its rendered wrapper *is* the slide div. If you use a theme block file, keep
  `"tag": null` so no extra wrapper is inserted.
- `config` booleans come straight from Liquid (`{{ true }}` → `true`). `autoPlay` is in **ms**.
- Only show arrows/dots when `section.blocks.size > 1`, so a single slide renders cleanly.
- `autoHeight`: `false` for fixed-height mode; `true` for "adapt to image" mode.

---

## Blocks vs settings — the nesting limitation

Local blocks (defined inline in a section's `{% schema %}` `blocks` array) **cannot contain
nested sub-blocks**. A "slide" that needs a variable list of child items (badges, tabs, features)
therefore uses **fixed numbered settings** on the slide block instead of real child blocks:

- Provide `badge_1_*` … `badge_N_*` (N = 4–6 is plenty) directly on the slide block.
- Each badge: `text`, an optional icon (`liquid` for inline SVG **and/or** `image_picker`),
  and an optional `url` link. **Render a badge only if it has text or an icon** (hide-if-blank).
- Keep defaults as placeholder copy only — never hardcode final copy in markup.

This is the "safe practical pattern." Do **not** fake unsupported nested schema. (If a project's
Kalles version exposes theme blocks with `blocks: ["@theme"]` and you've confirmed it works for
*this* use, that's an alternative — but numbered settings are the reliable default.)

---

## Static star rating (schema-driven, no review app)

Two-layer clip technique — a grey track under a colored fill clipped by width:

```liquid
{%- assign val = block.settings.rating_value | times: 1.0 -%}
{%- assign mx  = block.settings.rating_max   | times: 1.0 -%}
{%- if mx <= 0 %}{% assign mx = 5.0 %}{% endif -%}
{%- assign pct = val | divided_by: mx | times: 100 -%}
{%- if pct > 100 %}{% assign pct = 100 %}{% endif -%}
```
```html
<span class="…__stars" style="--star-pct: {{ pct }}%;" role="img" aria-label="{{ val }} / {{ mx }}">
  <span class="…__stars-track">★★★★★ (5 identical SVGs)</span>
  <span class="…__stars-fill">★★★★★ (same 5 SVGs)</span>
</span>
```
```css
.…__stars      { position: relative; display: inline-flex; color: <track>; }
.…__stars-fill { position: absolute; inset-block-start: 0; inset-inline-start: 0;
                 overflow: hidden; white-space: nowrap;
                 width: var(--star-pct); color: <fill>; }
```
- Always render **5** stars; `pct = value/max*100`. Rating value / max / text and star color are
  all schema text/color settings. Hide the whole row when the rating toggle is off.
- Compute derived values (division) in a **separate `assign`** — never inline `| divided_by:`
  after an `| append:`, or Liquid divides the *string*.

---

## Overlay layout (desktop side / mobile top)

```
.slide (position: relative; overflow: hidden)
 ├─ .media   (absolute inset 0)      → <picture> desktop + mobile <source>, + .overlay tint
 └─ .content (absolute inset 0; display:flex; justify-content:center; pointer-events:none)
     └─ .container (max-width band; display:flex;
                    justify-content: var(--pos); align-items: var(--valign))
         └─ .content-inner (width: var(--maxw); max-width:100%; min-width:0;
                            text-align: var(--align); pointer-events:auto)
```
- `.content` is `pointer-events:none`, `.content-inner` is `pointer-events:auto` — so overlay copy
  never blocks the slider arrows, but badge links stay clickable.
- Desktop: `justify-content` = horizontal placement, `align-items` = vertical placement.
  Mobile: override to `justify-content:center` + `align-items:<top/center/bottom>`.
- Flex rows (rating, badges) don't honor `text-align`. Map the text-align setting to a flex
  `justify-content` value in Liquid (`start→flex-start, center→center, end→flex-end`) and feed it
  as a CSS var for those rows.

### Height: two modes
- **Fixed** (matches "image should cover the banner"): slide gets a per-breakpoint height var;
  image is `position:absolute; inset:0; object-fit:cover; object-position: var(--focal)`. Expose a
  **focal/`object-position`** select per breakpoint so cover-cropping never hides the product.
- **Adapt to image** (never crops): image is `width:100%; height:auto`; slide height follows the
  image; set slider `autoHeight:true`. Give the empty-state placeholder an `aspect-ratio`.

---

## Responsive (default breakpoints — handle all four)

- **Desktop 1375px+** — base rules; copy on the design's side, full heading size.
- **Small desktop 1150–1374px** — trim heading size, content width, badge gap.
- **Tablet 768–1149px** — keep the overlay but reduce font sizes / padding / content width; a
  dedicated `@media (min-width:768px) and (max-width:1149px)` sets the tablet fixed height. Do not
  skip tablet.
- **Mobile <768px** — content to the top, centered; switch to the mobile height + mobile focal;
  badges wrap and center; smallest type. No horizontal scroll; badge text may wrap.

---

## Scoping, CSS location, RTL

- One parent scope class on the section (e.g. `hdt-<name>-section`). **Every** rule nests under
  `.<page-class> .hdt-<name>-section` (e.g. `.product .hdt-product-hero-banner-section`).
- Per-instance/per-slide values ride as **inline CSS vars** on the root/slide, so multiple
  instances never collide.
- Put styles in the project's agreed CSS file (product templates → the product CSS file). If that
  file is only loaded on *suffixed* templates, also `{{ '<file>' | asset_url | stylesheet_tag }}`
  it from the section so the styles are present wherever the section is placed. Load the theme's
  `slideshow.css` from the section too (arrows/dots styling).
- Use **logical properties** (`padding-inline`, `margin-inline*`, `inset-inline-*`,
  `inset-block-*`, `border-inline-*`) and logical `text-align: start/end` for RTL readiness.

---

## Schema gotchas (will silently break the section)

- `name`, every `presets[].name`, and each block `name` must be **< 25 characters**.
- Every `range` default must sit between `min`/`max` **and** land on a `step` multiple.
- Use **text** inputs for rating value/max (allows decimals like `4.67`; avoids range-step limits).
- Keep all copy in defaults only; expose images via `image_picker` (never hardcode image URLs).

---

## Validation & QA (large theme — skip `shopify theme check`)

Lightweight checks: `JSON.parse` the `{% schema %}` block; confirm Liquid tag balance
(`for/endfor`, `if/endif`, `capture/endcapture`; `case/endcase` live inside `{%- liquid -%}`
blocks and are brace-less); confirm the slider DOM hooks still exist.

Visual QA against the design at all four widths: no horizontal scroll, no clipped text, image not
stretched, badges wrap cleanly, rating row spacing correct, and merchant/customizer data preserved.
