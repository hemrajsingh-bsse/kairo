# Kairo — Product Landing Page

A conversion-focused landing page for **Kairo**, a fictional smart-calendar app. It is built with
semantic **HTML5**, modern **CSS3** (custom properties, Grid, Flexbox, `clamp()`) and small,
dependency-free **JavaScript** components.

**Live demo:** `https://<your-site>.netlify.app` *(see [Deployment](#deployment))*

## Features

| Requirement | Where |
| --- | --- |
| Hero with headline, subtext and **dual CTA** buttons | `index.html` → `.hero` |
| **Feature grid** with icons | `.feature-grid` (6 cards, inline SVG sprite icons) |
| **Pricing cards** with a **monthly / annual switch** | `.pricing-grid`, `js/components/pricing.js` |
| **FAQ accordion** with smooth toggle and ARIA | `.accordion`, `js/components/accordion.js` |
| **Sticky, responsive navigation** | `.site-header`, `js/components/nav.js` |
| Pricing stacks to **one column on mobile** | `css/sections.css` (≤ 899px) |

Extras: product mockup drawn in HTML/CSS, a "How it works" section, a final CTA band, scroll-reveal
animations, active-section highlighting in the nav, and full `prefers-reduced-motion` support.

## Run it

No build step and no dependencies. Open `index.html` directly in a browser, or serve the folder
(VS Code **Live Server**, `npx serve .`, or `python -m http.server`). The scripts are classic
`defer` scripts, so the page also works from `file://`.

## Project structure

```
kairo/
├── index.html
├── css/
│   ├── tokens.css        Design tokens: color, type scale, spacing, radius, shadow, motion
│   ├── base.css          Reset, element defaults, .container, utilities, reveal + reduced motion
│   ├── components.css    Buttons, nav, cards, billing toggle, price card, accordion, mockup…
│   └── sections.css      Page layout (hero, features, pricing, FAQ, CTA, footer) + breakpoints
├── js/components/
│   ├── nav.js            Sticky state, mobile menu, active link
│   ├── pricing.js        Monthly / annual price switch
│   ├── accordion.js      Accessible FAQ accordion
│   └── reveal.js         Scroll-in animations
└── README.md
```

## Typography scale

Two typefaces from Google Fonts:

- **Bricolage Grotesque** (display): headings, prices, step numbers. Characterful at large sizes.
- **Inter** (body): paragraphs, UI labels, buttons. Very legible at small sizes.

The scale is a **Major Third (×1.25)** built on a 16px base. The larger steps are **fluid** with
`clamp()`, growing smoothly between a 375px phone and a 1280px desktop, so no breakpoint jumps.

| Token | Size (mobile → desktop) | Used for |
| --- | --- | --- |
| `--text-xs` | 12.8px | Eyebrows, badges, labels |
| `--text-sm` | 14px | Nav links, meta text, footnotes |
| `--text-base` | 16px | Body copy |
| `--text-md` | 18px | Lead paragraphs, FAQ questions |
| `--text-lg` | 20px | Card and plan titles |
| `--text-xl` | 22 → 25px | Step titles |
| `--text-2xl` | 28 → 39px | Step numbers |
| `--text-3xl` | 32 → 49px | Section titles, CTA title |
| `--text-4xl` | 40 → 76px | Hero headline |

| Token | Value | Purpose |
| --- | --- | --- |
| `--leading-tight` | 1.05 | Display headlines |
| `--leading-snug` | 1.25 | Headings, FAQ questions |
| `--leading-normal` | 1.6 | Body text |
| `--tracking-tight` | −0.035em | Large headings |
| `--tracking-wide` | 0.12em | Uppercase eyebrows |

Headings use `text-wrap: balance` and paragraphs `text-wrap: pretty` to avoid orphans.

## Color system

A warm, editorial palette. Brand colors are tuned so every text pairing meets **WCAG AA**.

| Role | Token | Hex | Notes |
| --- | --- | --- | --- |
| Background | `--color-bg` | `#FBF8F3` | Warm cream page background |
| Surface | `--color-surface` | `#FFFFFF` | Cards, alternating sections |
| Surface alt | `--color-surface-alt` | `#F4EFE6` | Toggle track, subtle fills |
| Line | `--color-line` | `#E8E1D4` | Borders and dividers |
| Ink | `--color-ink` | `#15130F` | Headings, footer background |
| Ink soft | `--color-ink-soft` | `#3B372F` | Body text |
| Muted | `--color-muted` | `#6E675B` | Secondary text (5.3 : 1 on cream) |
| **Primary** | `--color-primary` | `#CC3F18` | Coral buttons and links (4.9 : 1 with white) |
| Primary bright | `--color-primary-bright` | `#FF6B3D` | Decoration only, never text |
| Primary soft | `--color-primary-soft` | `#FFE7DD` | Icon tiles, meeting blocks |
| **Forest** | `--color-forest` | `#0F3B36` | Featured plan, CTA band, badges |
| **Butter** | `--color-butter` | `#FFC94D` | Accent CTA, headline underline |
| Tints | `--color-*-soft` | — | Feature icon backgrounds |
| Focus | `--color-focus` | `#2457D6` | 3px focus ring on every control |

**Usage rule:** one coral primary action per view, forest for "trusted / recommended" moments, butter
only as an accent on dark surfaces.

## Spacing & layout rhythm

Spacing follows a **4px base with an 8px rhythm**: `--space-1` (4px) through `--space-9` (96px).
Components only use these tokens, which keeps gaps consistent everywhere.

- Section padding: `--section-space`, fluid from 64px to 120px.
- Section heading → content: `--space-8` (64px).
- Card padding: `--space-6` (32px), reduced to `--space-5` (24px) on phones.
- Grid gaps: `--space-5` (24px).
- Container: `min(1180px, 100% − 2 × gutter)` with a fluid 20–32px gutter.

Radii: 8 / 14 / 20 / 28px plus pill. Shadows: three elevation levels (`sm`, `md`, `lg`).

## Component architecture

CSS follows **ITCSS-style layering** (tokens → base → components → sections) and **BEM** naming
(`.price-card__name`, `.btn--primary`). Components never hard-code colors or sizes; they read tokens,
so a rebrand only touches `tokens.css`.

JavaScript components are **progressive enhancements**. Each one is an isolated function that finds
its root via a `data-*` hook, so styling classes and behavior never depend on each other. If a script
fails or is disabled, the content stays usable.

| Component | Markup hook | Behavior | Accessibility |
| --- | --- | --- | --- |
| **Sticky nav** | `[data-header]`, `[data-nav-toggle]`, `[data-nav-menu]`, `[data-nav-link]` | `.is-scrolled` after 8px; mobile menu sheet; active link via `IntersectionObserver` | `aria-expanded`, `aria-controls`, dynamic `aria-label`, Esc closes and returns focus, `aria-current="location"` |
| **Billing switch** | `[data-pricing]`, `input[name=billing]`, `[data-price]`, `[data-note]` | Swaps `data-monthly` / `data-annual` values; animated price flip; sliding thumb in pure CSS | Native radio group inside `<fieldset>`/`<legend>` (arrow keys work), polite live region announces the change |
| **Accordion** | `[data-accordion]`, `[data-accordion-trigger]` | Toggles `.is-open`; height animates via `grid-template-rows: 0fr → 1fr` (no JS measuring); optional `data-single` | WAI-ARIA Accordion pattern: `<button>` in a heading, `aria-expanded`, `aria-controls`, `role="region"` + `aria-labelledby`, `inert` on closed panels, ↑ ↓ Home End navigation |
| **Reveal** | `[data-reveal]` | Fades in on scroll with sibling stagger, then removes itself | Disabled for `prefers-reduced-motion`; content is only hidden after the script runs |

Pure-CSS components: `.btn`, `.feature-card`, `.step`, `.price-card`, `.contact-card`, `.mockup`,
`.float-card`, `.announcement`.

## Responsive behavior

| Breakpoint | Changes |
| --- | --- |
| ≤ 1024px | Feature grid 3 → 2 columns |
| ≤ 899px | Nav collapses into a menu sheet; **pricing stacks into one column**; steps and FAQ go single column |
| ≤ 760px | Mockup hides its sidebar and floating cards |
| ≤ 640px | Feature grid 1 column; hero and CTA buttons go full width |

Every interactive element has at least a 44 × 44px touch target.

## Accessibility checklist

- Skip link, landmarks (`header`, `nav`, `main`, `footer`), one `h1`, logical heading order.
- Visible `:focus-visible` ring on all controls.
- Accordion and nav follow WAI-ARIA patterns; pricing uses native radios.
- Color contrast meets WCAG AA for all text.
- Decorative SVGs are `aria-hidden`; the mockup has a single descriptive `role="img"` label.
- `prefers-reduced-motion` turns off reveal, floating and pulse animations.

## Deployment

**Netlify Drop (fastest, free):** go to <https://app.netlify.com/drop> and drag the `kairo` folder
onto the page. You get a live URL in seconds; rename it under *Site configuration*.

**GitHub Pages (free):**

1. Push the folder to a new GitHub repository.
2. *Settings → Pages → Deploy from a branch → `main` / root → Save*.
3. The site is live at `https://<username>.github.io/<repo>/` within a minute.

**Vercel:** import the repository with no build command; the output directory is the project root.

## License

MIT. Kairo is a fictional product made for this project.
