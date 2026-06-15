# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This is a **Shopify theme**: "Kalles" v5.4.2 by The4 ([docs](https://support.the4.co/collections/kalles-5)). It is a large, feature-rich commercial Online Store 2.0 theme written in Liquid, with vanilla-JS custom elements and plain CSS — **there is no build step, package.json, or bundler**. Files are uploaded as-is to Shopify. The `assets/*.min.js` / `*.min.css` files are pre-minified vendored/built outputs; edit the un-minified source where one exists (e.g. `custom.js`, `events.js`, `utilities.js`) rather than the `.min` files.

## Developing & deploying

There is no local build/lint/test tooling checked in. Theme development uses the Shopify CLI against the live/dev store:

```bash
shopify theme dev      # local preview with hot reload
shopify theme pull     # pull theme files from a store
shopify theme push     # push local files to a store (use --unpublished for a draft)
shopify theme check    # Theme Check linter (the standard Liquid/theme linter)
```

Note: this repo currently has a single branch, `master`, with no configured remote.

## Architecture & conventions

Standard Shopify theme layout. The big-picture structure that spans files:

- **`layout/theme.liquid`** is the root HTML shell for every page. It computes RTL/LTR direction, sets body/html classes from `settings.*`, and renders the shared head snippets (`css-variables`, `js-variables`, `scripts`, `social-meta-tags`) plus the `header-group` and footer section groups. `layout/password.liquid` is the storefront-password page.
- **`templates/*.json`** are Online Store 2.0 JSON templates that compose sections by reference. Many page types ship **numerous layout variants** as separate templates (e.g. `product.left-sidebar.json`, `product.full-width.json`, `collection.filter-sidebar.json`, `collection.infinite.json`, `blog.masonry.json`). When changing a page, identify which template variant is actually assigned in the store — editing one variant does not affect the others. `templates/customers/*` covers account pages; a few templates are `.liquid` (e.g. `gift_card`, `search.other`).
- **`sections/`** (~130 files) are the composable building blocks referenced by JSON templates and section groups.
- **`blocks/`** are theme blocks. Files prefixed with `_` (e.g. `_product-price.liquid`, `_mega_block.liquid`) are private/nested blocks used inside other sections/blocks; unprefixed ones (`button.liquid`, `heading.liquid`, `group.liquid`) are general-purpose.
- **`snippets/`** (~140 files) are reusable partials rendered with `{% render %}`. Note there are **12+ `card-product*.liquid` variants** plus `card-product-media`, `card-price`, etc. — product cards are heavily parameterized; check which snippet a section renders before editing card markup.
- **`config/settings_schema.json`** defines all theme settings (the `settings.*` object); `config/settings_data.json` holds the saved values for the current store. The first schema entry (`theme_info`) holds theme name/version.
- **`locales/`** holds translations. `*.default.json` is the storefront default (English); `*.schema.json` files back the `t:` keys used in section/settings schemas. Use `{{ '…' | t }}` for storefront strings and `t:…` keys in schema `label`/`name` fields rather than hardcoding text.

### Naming convention — the `hdt-` prefix

The theme namespaces nearly everything with **`hdt-`** (the vendor's prefix): CSS classes (`hdt-pr-img__effect-*`, `hdt-badge__shape-*`), body classes (`hdt-page-type-{{ request.page_type }}`), and many custom elements. Match this prefix when adding theme-level classes/components.

### Client-side JS

Behavior is implemented as **native Web Components / custom elements**, not a framework. Each interactive feature registers a `customElements.define(...)` (e.g. `hdt-wishlist`, `hdt-compare`, `product-recommendations`, `hdt-predictive-search`, `hdt-countdown-simple`, `hdt-masonry-layout`, `hdt-filter-sorting`). To add or change interactive behavior, find/define the relevant custom element rather than adding inline scripts. Shared utilities live in `assets/utilities.js`, `assets/events.js`, and `assets/custom.js`.

### CSS

Plain per-feature CSS files in `assets/` (e.g. `base.css`, `facets.css`, `collection-products.css`, `featured-collection-2.css`). Sections/snippets typically `{{ '…' | asset_url | stylesheet_tag }}` their own stylesheet. CSS custom properties are emitted by the `css-variables` snippet from theme settings.

## Editing guidance specific to this theme

- Prefer changing **theme settings / template JSON / section schemas** over hardcoding when the theme already exposes a setting — this theme is extremely configurable by design.
- When a feature has many variants (product cards, collection/product/blog layouts), confirm the live variant before editing so you change the file that's actually rendered.
- Keep storefront-facing text in `locales/` translation files, not inline literals.
