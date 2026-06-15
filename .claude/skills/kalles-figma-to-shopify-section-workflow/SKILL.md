---
name: kalles-figma-to-shopify-section-workflow
description: Section-by-section workflow for converting a Figma design into Shopify Kalles (v5.x by The4) theme code in THIS repository. Use this whenever working on this Kalles theme — auditing/planning a Figma-to-Shopify conversion, implementing a duplicated or new homepage/section, or fixing a section after the user tests with `shopify theme dev`. Always prefer this skill when the task involves Kalles sections/blocks/snippets, Figma node links, hero/slideshow work, scoped custom CSS, or preserving the Shopify theme customizer data — even if the user doesn't name it explicitly.
---

# Kalles Figma → Shopify section-by-section workflow

A project-local workflow skill for converting a Figma design into this **Shopify Kalles v5.x (by The4)** theme, one section at a time, without breaking the original theme or the merchant's saved customizer data.

This skill is **self-contained** — it does not depend on any other markdown file in the repo. If a project plan or `CLAUDE.md` exists, you may read it for context, but never rely on it being present.

Pick the matching **mode** (below) based on what the user is doing, then follow its checklist. When in doubt about scope, do less, not more: touch only the one section the task is about.

---

## Core project rules (apply in every mode)

- The theme is **Shopify Kalles v5.x by The4** — a large Online Store 2.0 theme: Liquid + vanilla-JS custom elements + plain CSS, **no build step / bundler**. Files upload as-is.
- The job is **Figma design → Shopify/Kalles code**, worked **section by section**, never the whole page at once.
- **Prefer duplicating** the closest existing Kalles section, then customizing the copy. Build a **new section from scratch only when no suitable Kalles section exists**.
- **Never edit original Kalles sections** directly unless the user explicitly approves it for a specific file.
- **Never edit original Kalles CSS/JS** directly. **Never** edit `*.min.css` / `*.min.js` (they are prebuilt vendor output).
- Put all brand/project custom CSS in a **single project custom CSS file**, e.g. `assets/custom_yaman.css` (or another brand-specific file if the project changes). Load it **globally** via `layout/theme.liquid`, after the theme's own CSS so scoped overrides win.
- Every duplicated/new section gets a **unique parent scope class** (e.g. `hdt-<name>-n` or `hdt-yaman-<name>`). **All of that section's CSS must be nested under that class** so it can't leak into other Kalles sections or other instances. If a section can appear more than once, expose a `custom_class` / `section_unique_class` text setting and scope by that.
- **Do not hardcode final Figma images.** Expose `image_picker` schema settings; the merchant uploads/selects images in the theme editor.
- Keep **content dynamic** through section/block **schema settings**: text, buttons/links, images, products, collections — all editable, no hardcoded copy beyond temporary placeholder defaults. Keep storefront strings in `locales/` where practical.
- **Do not remove old/default homepage sections** until the new homepage is fully built. New sections are usually inserted **above** the old defaults in `templates/index.json`.
- **Header / footer / announcement bar** are usually handled later — only touch them if the user specifically asks.
- Follow Kalles coding style and the `hdt-` class prefix when adding theme-level classes/elements.

---

## Required inputs before working on a section

Before implementing or fixing a section, make sure you have (ask for whatever is missing):

- **Section name.**
- **Desktop Figma node link** (section-specific).
- **Mobile Figma node link** (section-specific).
- **Cropped desktop screenshot.**
- **Cropped mobile screenshot.**
- **Target section file** (the duplicated/new file to edit).
- **Duplicated vs from-scratch** — which approach, and if duplicated, **which original Kalles section** it came from.
- **Original Kalles section file** (if duplicated) for reference only — read it, don't edit it.
- **Custom CSS file path** for this project.
- **Whether `templates/index.json` should be updated** in this task.
- **Dynamic product/collection requirements** (real collections/products vs manual marketing cards).
- **Exact behavior notes** (animations, sliders, responsive differences, RTL, etc.).
- **Current frontend screenshots** — required if this is a follow-up/fix task.

If a few inputs are missing but the task is clear, proceed with sensible defaults and state the assumptions; don't block on non-essential details.

---

## Source-of-truth priority

1. **Section-specific Figma desktop/mobile nodes** = primary source of truth. Use the Figma MCP to read exact structure, spacing, colors, and tokens.
2. **Cropped section screenshots** = visual confirmation.
3. **Full homepage Figma links** = general context only.
4. **Full-page screenshots** = general context only.
5. **Do not re-analyze or implement unrelated sections** during a single-section task.

If the Figma nodes and a screenshot disagree, prefer the node values but flag the discrepancy.

---

## Mode 1 — Audit / Setup / Project planning

Use when the user is **starting a new Kalles + Figma project** (or asks for an audit/plan).

Do:
- Inspect the theme structure (`sections/`, `blocks/`, `snippets/`, `assets/`, `config/`, `locales/`).
- Inspect `layout/theme.liquid` (how global CSS is loaded, body/html classes, section groups).
- Inspect `templates/index.json` (the live homepage section order — note which template variant is actually assigned).
- Inspect existing Kalles sections relevant to the design (so you can recommend duplicate-vs-new).
- Inspect `CLAUDE.md` if it exists, for repo conventions.
- Use the **Figma MCP** if Figma links are provided (read metadata/top-level frames to break the page into sections; large metadata dumps may need to be parsed out-of-band rather than read inline).
- Create or update a **project plan markdown** only if useful.
- Create the **project custom CSS file** if missing, with a header comment explaining it's the single custom-CSS home and that styles must be scoped per section.
- **Load the custom CSS file in `layout/theme.liquid`** if not already loaded (after the theme CSS).
- **Do not implement homepage sections yet** unless the user explicitly asks.

Report:
- What you inspected.
- What files you changed (setup only).
- Proposed homepage **section breakdown** (each section → duplicate-of-which-Kalles-section vs new-from-scratch, with a proposed file name + scope class).
- Suggested **implementation order** (usually top-to-bottom).
- **First section recommendation.**
- Questions / blockers.

---

## Mode 2 — Section implementation

Use when implementing **one** section.

Do:
- Work **only** on the requested section.
- Inspect the **target** duplicated/new section file.
- Inspect the **original Kalles section** if duplicated (reference only).
- Inspect related **blocks/snippets** the section renders (Kalles has many `card-product*` variants and `_`-prefixed private blocks — confirm which one is actually rendered before changing card markup).
- **Preserve original Kalles files.** If the design needs structural changes the shared block can't support cleanly, **duplicate the block** (e.g. `_slide-item-n.liquid`) and point only the new section at it — don't edit the shared original. If editing an original seems unavoidable, **stop and explain why, and ask first.**
- Add/update **schema settings** for dynamic content (text, links, images via `image_picker`, product/collection pickers, layout toggles).
- Add/update CSS **only in the project custom CSS file**, **scoped under the section parent class**. Use clear scoped BEM-ish names (e.g. `.hdt-<name>__media`, `.hdt-<name>__content`).
- If requested, add the section to `templates/index.json` **above** the old defaults.
- **Do not reset existing customizer data** already saved in `templates/index.json` (existing block instances, images, settings).
- **Do not hardcode Figma images** — expose pickers.
- If reusing a Kalles **slider/carousel** element, keep its required DOM contract intact (see Special Kalles notes).

Report:
- What you inspected.
- What files you changed.
- Whether a duplicated block/snippet was created, and **why**.
- What **settings are now available** in the theme editor.
- How/if `templates/index.json` was updated.
- **Manual Shopify theme-editor steps** (e.g. upload images, set links).

---

## Mode 3 — Follow-up / fix after frontend testing

Use when the user has run `shopify theme dev` and sends **current frontend screenshots**.

Do:
- Compare current screenshots against the **target** screenshots / Figma nodes.
- Fix **only the requested issues** — don't refactor or touch unrelated sections.
- **Preserve current Shopify customizer data**: do not reset section blocks, uploaded images, slide counts, disabled/enabled states, or any user settings in `templates/index.json`.
- If schema setting **IDs must change**, try to keep **backward compatibility** (add new IDs alongside; let missing keys fall back to schema defaults). If the user may need to reconfigure something manually, **say so explicitly**.
- **Do not run `shopify theme check`** if the user has said it causes out-of-memory/crash issues on this large theme. Use **lightweight checks** instead: parse `templates/index.json` and embedded `{% schema %}` JSON, eyeball Liquid tag balance, confirm the slider DOM hooks still exist.

Report:
- What caused the issue.
- What you changed.
- Files changed.
- **Confirmation that customizer data was preserved.**
- Any manual steps needed.

---

## Special Kalles notes

- Kalles has **many reusable snippets/blocks** and **many product-card variants**. Always confirm what is actually rendered before editing card/markup.
- Kalles implements behavior as **native custom elements** (sliders/carousels, wishlist, compare, predictive search, etc.). When reusing one, **preserve its required DOM classes/attributes** — e.g. for the slideshow keep `<hdt-slideshow>` with its `config`/`autoheight`, and the `.hdt-slider__viewport` → `.hdt-slider__container` → `.hdt-slider__slide` structure plus `[hdt-slider-dots]`. A duplicated slide block should keep `"tag": null` so its own `.hdt-slider__slide` div is the slider's direct child (a non-null tag adds a wrapper and breaks the slider).
- When duplicating a section, **update the schema `name` and `presets`** so it's clearly labeled and insertable in the theme editor (avoid leftover/invalid `t:` keys from the original).
- **Schema `name` must be ≤ 25 characters** — Shopify hard limit; a longer value throws `Invalid schema: name is too long (max 25 characters)` and the section won't load. Keep section names short (e.g. `YAMAN Trust Badges`, not `YAMAN Trust Icons / Badges`), and keep block/preset names short too.
- **Preserve/adapt useful original settings** instead of oversimplifying: height modes, spacing (margin/padding desktop+mobile), full-width, color scheme, navigation arrows, pagination.
- For **slideshow/hero** sections, preserve the height modes when relevant:
  - `Adapt to first image`
  - `Adapt to image`
  - `Fill screen height`
  - `Fixed height`
- For `Adapt to image`, preserve **image aspect-ratio** behavior (image renders full width; height follows the image's own ratio via CSS vars — not a hardcoded pixel height).
- Kalles dots/pagination are often **CSS-variable driven** (e.g. `--pag-w/h`, `--pag-w/h-active`, `--pag-bg(-active)`, `--pag-radius`, active class `.hdt-slider__dot--selected`). To restyle dots, **override those vars scoped to the section parent class only** — never edit the global pagination rules.
- **Font-family matching can wait**: if the brand font isn't uploaded yet, inherit the theme's font and don't hardcode `font-family`; wire the real font later. (Note: `@font-face` `src` must use absolute/relative URLs that resolve in a static `.css` — Liquid `{{ … | asset_url }}` does **not** render inside a plain `.css` file.)

---

## Working style

- Keep changes minimal and reversible; match surrounding Kalles code style.
- State assumptions instead of stalling.
- Confirm before any irreversible or original-file change.
- Always end a section task with a short report covering: inspected → changed → editor settings → index.json status → manual steps.
