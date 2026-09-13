# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, single-page marketing website for "Universal Barbershop." Plain HTML/CSS/JS with no build step, no package manager, and no test suite — the entire site is `index.html` + `css/style.css` + `js/main.js`.

## Running / previewing

There is no dev server or build command. Either:
- Open `index.html` directly in a browser, or
- Serve it locally to avoid any `file://` quirks (e.g. relative fetches): `python -m http.server 8000` from the project root, then visit `http://localhost:8000/index.html`.

There is no linter or test runner configured for this repo.

## Architecture

Everything lives in three files plus the image assets:
- `index.html` — all markup and content, one `<section>` per part of the page (hero, philosophy, barbers, gallery, services, testimonials, location, contact), each with a stable `id` used by the nav anchors.
- `css/style.css` — design tokens (colors, fonts, spacing) as CSS custom properties on `:root`, then per-section styles, then a responsive block at the bottom (breakpoints at 980px and 600px) and a `prefers-reduced-motion` override.
- `js/main.js` — a single IIFE handling: preloader timing, sticky header on scroll, scroll-progress bar, mobile nav toggle, scroll-reveal animations, the gallery lightbox, and the (client-side-only, no backend) contact form.

### Scroll-reveal pattern
Any element meant to animate in on scroll gets `class="reveal" data-reveal` (optionally `data-delay="1"`–`"5"` for staggering). `js/main.js` wires an `IntersectionObserver` that adds `.is-visible` the first time each element enters the viewport; `css/style.css` defines the actual opacity/transform transition on `.reveal`/`.reveal.is-visible`. Adding a new animated element just means adding those attributes — no JS changes needed.

### Image assets and their semantic roles
Images live under `src/photos/` and are referenced by relative path from `index.html`:
- `main_photo.avif` — the founder/lead barber; used in both the hero background and as the lead card in the "Meet the Barbers" section.
- `barber-1.avif`, `barber-2.avif`, `barber-3.avif` — the rest of the barber team grid.
- `portfolio-1.jpg` … `portfolio-6.jpg` — the gallery grid, in that numeric order; the gallery lightbox (`#lightbox` in HTML, wired in `js/main.js`) indexes into `.gallery__item` in DOM order, so reordering the gallery means reordering these elements together.

### Location section
The "Location & Hours" section intentionally does **not** use a Google Maps `<iframe>` embed. It uses a custom CSS/SVG-free "map visual" (`.map-visual` in `css/style.css`) — a grid pattern, pulsing pin, and coordinate label — wrapped in a link that opens Google Maps in a new tab. This is because the site is also published as a Claude Artifact, and the Artifact viewer's content security policy blocks embedded iframes from external sites; a live Maps embed renders blank there. If the site is ever split into a "local-only" and "artifact" variant, this is the section that would diverge.

## Deployment

This site has also been published as a Claude Artifact (multi-file: `index.html` plus `css/style.css`, `js/main.js`, and the `src/photos/*` images as supporting files). When editing files that are part of that publish, keep in mind the Artifact CSP constraints noted above (no external iframes; external scripts/styles only from the allowlisted CDNs).
