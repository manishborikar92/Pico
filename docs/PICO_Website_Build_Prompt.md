# AI IDE Build Prompt — Project PICO Website
### For: Antigravity + Claude Opus 4.6

---

## Your Mission

You are tasked with building the complete, production-ready website for **Project PICO** — an AI desktop companion robot. A comprehensive planning blueprint has been provided to you (the `PICO_Website_Blueprint.md` file). Your primary job is to read that document thoroughly and treat it as the single source of truth for every decision you make: architecture, design system, component structure, animations, color palette, typography, layout, and content.

Do not improvise where the blueprint is explicit. Where the blueprint leaves room for judgment, apply professional best practices and stay consistent with the established design language.

---

## Step 0 — Before Writing a Single Line of Code

Read the entire `PICO_Website_Blueprint.md` document from top to bottom before doing anything else. Then do the following:

1. Identify every component listed in **Section 7: Component Library**
2. Note every color token defined in **Section 4: Design System**
3. Understand the full page structure from **Section 5 and Section 6**
4. Internalize the animation philosophy from **Section 8**
5. Confirm you understand the project file structure from **Section 10**

Only begin implementation after you have fully absorbed the blueprint.

---

## Step 1 — Project Initialization

Set up the Next.js project with the exact configuration specified in the blueprint.

```bash
# Project is already initialized with:
# npx create-next-app@latest web --js --tailwind --eslint --app --src-dir --import-alias="@/*"
cd web
```

Install every dependency listed in **Blueprint Section 2: Technology Stack**. Do not skip any. Do not substitute alternatives.

```bash
# Core animation
npm install framer-motion gsap @studio-freight/lenis

# UI primitives
npm install @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-dialog

# Utilities
npm install clsx tailwind-merge react-icons

# Documentation
npm install next-mdx-remote react-syntax-highlighter
```

---

## Step 2 — Tailwind Configuration

Tailwind CSS v4 is used in this project. All custom design tokens from **Blueprint Section 4** must be defined in `src/app/globals.css` using the `@theme` directive. This config must include:

- All base colors (Cream Base through Ink Muted) as named theme tokens
- All nine rainbow accent colors as named theme tokens
- All gradient definitions
- The full custom font-size type scale (display-xl through caption)
- The custom breakpoints including the `xs: 475px` addition
- The custom border-radius tokens (sharp, standard, large, pill)
- The custom box-shadow tokens (sm through xl, plus the three glow variants)
- Custom font-family entries for `display` (DM Sans), `body` (Inter), and `mono` (JetBrains Mono)
- Custom spacing to enforce the 8px base grid

Every color, shadow, radius, and font defined in the blueprint must be exposed as Tailwind theme variables in `src/app/globals.css`.

---

## Step 3 — Global Styles & Fonts

In `src/app/globals.css` (combined with your Tailwind v4 `@theme` configuration):

- Import DM Sans, Inter, and JetBrains Mono from Google Fonts using `@import` or configure via `next/font/google` in the root layout
- Set the `html` background to `#FDFBF4` (Cream Base)
- Set the default `body` font to Inter
- Define CSS custom properties for all color tokens (so they can be accessed in non-Tailwind contexts if needed)
- Implement the `prefers-reduced-motion` media query that sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` for all animated elements — this is a non-negotiable accessibility requirement
- Set smooth scroll behavior on `html` (will be overridden by Lenis, but serves as a fallback)

---

## Step 4 — Root Layout & Providers

In `src/app/layout.js`, implement the root layout:

- Load all three Google Fonts with `next/font/google` using `display: 'swap'`
- Initialize **Lenis** smooth scroll in a client-side provider component using `useEffect`. Connect Lenis to the RAF loop. Expose the Lenis instance via a React context so child components can access it.
- Wrap the app with an `AnimatePresence` from Framer Motion to enable page transitions
- Set all SEO metadata as defined in **Blueprint Section 12**
- Render `<NavBar />` above the page content
- Render `<Footer />` below

---

## Step 5 — Build the `PicoFace` Component First

This is the most important component on the entire site. Build it before anything else. Do not move on until it works correctly and feels genuinely alive.

**File:** `src/components/pico/PicoFace.js`

The component renders a dark rounded rectangle (the "robot face") containing two eye shapes side by side. It accepts the following props:

```javascript
PicoFace.propTypes = {
  expression: PropTypes.oneOf([
    'idle', 'happy', 'curious', 'sleepy', 
    'listening', 'confused', 'loved', 'surprised', 'booting'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  interactive: PropTypes.bool,     // enables mouse-tracking
  autoAnimate: PropTypes.bool,     // enables random idle behaviors
}
```

**Eye Expressions — SVG Path Definitions:**

Each expression is a set of two SVG paths (left eye, right eye). Implement each one:

| Expression | Left Eye Shape | Right Eye Shape |
|---|---|---|
| `idle` | Large filled circle with small pupil | Mirror of left |
| `happy` | Upward arc (like `^`) filled | Mirror of left |
| `curious` | Large circle | Small circle (asymmetric) |
| `sleepy` | Half-closed ellipse (top half cut off) | Mirror of left |
| `listening` | Circle with swirl/spiral inside | Mirror of left |
| `confused` | Normal circle with raised inner brow line | Small squint |
| `loved` | Heart shape | Heart shape |
| `surprised` | Very large circle, fully open | Mirror of left |
| `booting` | Horizontal line (off state) | Mirror of left |

**Boot-up Animation Sequence** (implement exactly as specified in **Blueprint Section 8**):
1. Both eyes start as `booting` (horizontal lines, dim)
2. At 300ms: Left eye scans on (vertical wipe from top, 200ms, brightens)
3. At 500ms: Right eye scans on (same)
4. At 800ms: Single blink (50ms close, 80ms open)
5. At 1000ms: Transition to `idle` expression, begin normal idle behaviors

**Idle Behaviors** (use `setInterval` with randomized delays inside `useEffect`):
- Blink: Every 3000–6000ms (random). Close for 80ms, open. Occasionally double-blink.
- Look left/right: Every 15–30 seconds. Pupils move left (-8px) over 200ms, hold 300ms, return.
- Sleepy drift: Very rarely (every 45–90s), expression shifts to `sleepy` for 1 second then snaps back.

**Mouse Tracking** (when `interactive={true}`):
- Listen to `mousemove` on the document
- Calculate cursor position relative to the face card center
- Map cursor offset to pupil displacement (maximum ±8px)
- Apply displacement via a CSS transform with `spring` easing from Framer Motion (stiffness: 100, damping: 30)

**Expression Transitions:**
All expression changes must go through a half-blink transition: eyes animate to 40% closed (100ms), expression changes, eyes animate back open (100ms). This is non-negotiable — it makes expressions feel organic.

**`EyeExpression.js`** sub-component:
Extract each individual eye into its own component that accepts `shape`, `pupilOffset`, `isBlinking`, and `brightness` props. `PicoFace` composes two `EyeExpression` components.

---

## Step 6 — Build All Shared UI Components

Build these before building any page sections. They are the Lego blocks everything else is assembled from.

**`src/components/ui/Button.js`**
Variants: `primary` (periwinkle fill), `secondary` (outlined, periwinkle border), `ghost` (no border, text only). Sizes: `sm`, `md`, `lg`. All variants have the hover scale and shadow elevation behavior from **Blueprint Section 8: Hover States**. Implement using `clsx` and `tailwind-merge` for clean class composition.

**`src/components/ui/Badge.js`**
Variants: `default` (filled), `outline`, `rainbow` (gradient border). Used for feature IDs and category labels. The `rainbow` variant uses the `Rainbow Shimmer` gradient as a border using the `background-clip` trick.

**`src/components/ui/Card.js`**
Base card with cream white background, standard border radius, shadow-md. Accepts an `accentColor` prop that adds a 3px top border in that color. Hover elevation behavior is the default.

**`src/components/ui/CodeBlock.js`**
Uses `react-syntax-highlighter` with a custom theme that matches the warm palette. Light background (`#F5F0E8`), warm-tinted token colors. Shows a header bar with the language label and optional filename. If `highlight` prop is provided, highlighted lines get a soft yellow background strip.

**`src/components/shared/SectionHeader.js`**
Every home page section starts with this. Renders a centered block containing: a small `Badge` with rainbow variant (category label), a large heading, and an optional subtitle paragraph. Animates in on scroll with the default entrance pattern.

**`src/components/shared/RainbowBadge.js`**
A pill badge with the rainbow shimmer gradient as its border. Used for feature IDs like `AI-1`, `V-3`, etc. The interior background is the cream white, and the text is the ink color. Uses the `padding` + `background-clip` border technique in CSS.

**`src/components/shared/AnimatedCounter.js`**
A number that counts up from 0 to its target value when it enters the viewport. Uses Framer Motion's `useInView` to trigger. Props: `value` (number), `suffix` (string, e.g., "MHz", "%", "hrs"), `duration` (seconds, default 1.5).

**`src/components/shared/FeatureCard.js`**
Card displaying a single feature. Shows: ID badge (RainbowBadge), icon (color-matched to category), title, description. On hover: slight rotation (1deg), shadow elevation, ID badge color brightens.

**`src/components/shared/ComponentCard.js`**
Hardware component card. Shows: component name, accent-colored top border, spec list (2–3 bullet points), price range. Clean, minimal.

**`src/components/shared/StepCard.js`**
For the 3-phase methodology. Large card with: big step number (display-lg, accent color), title, description paragraph, and a content slot for a code block or checklist.

---

## Step 7 — Build the Navigation Bar

**`src/components/layout/NavBar.js`**

This is a fixed-position bar at the top of the viewport.

**Scroll Behavior:** Use a `useEffect` + `scroll` event listener (or Lenis scroll event) to detect when the page has scrolled more than 40px. Below 40px: `background: transparent`. Above 40px: `background: rgba(253, 251, 244, 0.85)` with `backdrop-filter: blur(12px)` and a subtle bottom border.

**Content:**
- Left: PICO logo — a tiny `PicoFace` component at `size="sm"` with `autoAnimate={true}` and `interactive={false}`, displayed inline next to the "Pico" wordmark in DM Sans bold
- Center (desktop only): Anchor links — "What is Pico", "Features", "How It Works", "Hardware", "Docs"
- Right: "Start Building" button (primary variant, sm size) that links to `/docs/development-plan`

**Mobile:** Below `md` breakpoint, hide center links and replace with a hamburger icon button. On click, render a full-screen overlay drawer (use Radix Dialog) with the nav links in a large vertical list, plus the CTA button at the bottom.

---

## Step 8 — Build Each Home Page Section

Build sections in the order they appear on the page. Each section component lives in `src/components/home/`. Every section must:
- Have its own `id` attribute matching the anchor link in the nav
- Use the `SectionHeader` component for its title block (except the Hero)
- Animate its children in on scroll using Framer Motion `useInView` with the stagger pattern defined in **Blueprint Section 8**

**`HeroSection.js`**

Full-viewport-height (`min-h-screen`). Cream background with a subtle radial gradient bloom centered behind the face card (soft warm glow at ~20% opacity, ~600px diameter). Flex column layout, centered.

Layout order (top to bottom, centered):
1. The `PicoFace` component at `size="xl"`, `interactive={true}`, `autoAnimate={true}` — this runs the full boot-up sequence on load
2. A headline block: "Meet Pico." animates up on load (after boot-up completes, ~1200ms delay). Subtitle fades in 500ms after headline.
3. Two CTA buttons side by side
4. The scroll indicator (bouncing chevron, fades out after first scroll event)

The headline "Meet Pico." should use the `display-xl` type size. The period is styled in the periwinkle accent color. The subtitle uses `body-lg` with `Ink Light` color.

**`WhatIsPicoSection.js`**

Two-column layout (stacks on mobile). 

Left column: The pull-quote in `heading-lg` italic. Below it, three horizontal "capability cards" (Sees / Hears / Feels) each with a colored icon, short headline, and one-sentence description.

Right column: The expression showcase carousel. An auto-playing (3-second interval) carousel cycling through 6–8 PICO expressions. Each slide shows a `PicoFace` at `size="lg"` with the current expression, the state name as a monospace label, and the trigger description. Navigation dots below use the rainbow palette (each dot a different accent color). Include prev/next arrow buttons. The carousel must be pausable on hover.

**`PersonalitySection.js`**

Full-width section with `#F5F0E8` background.

Render the emotion engine as a responsive card grid (3 columns desktop, 2 tablet, 1 mobile). Each card corresponds to a row from the Personality Engine table in the features document (P-1 through P-15). 

Each card contains: a colored icon representing the trigger type (hardware triggers in orange, face triggers in sky blue, voice triggers in teal, sensor triggers in pink), a mini `PicoFace` at `size="sm"` showing the visual reaction, the trigger label, and the audio reaction label. On hover the mini face changes to the corresponding expression with the half-blink transition.

**`FeaturesSection.js`**

Use Radix `Tabs` component with six tabs as defined in the blueprint. The active tab indicator is a 2px bottom border in the tab's accent color (not a pill/fill).

Each tab panel renders a `FeatureCard` grid. The last card in each tab spans the full width (2-column span on desktop) as a "spotlight" card with a gradient background.

**`HowItWorksSection.js`**

Three `StepCard` components in a horizontal row on desktop, vertical stack on mobile.

Between the cards (desktop only), render an SVG arrow connecting them — a dashed curved arrow with an arrowhead. The arrow uses the rainbow shimmer gradient as its stroke color.

Below the cards, render a visual timeline bar: a horizontal line with three milestone marker dots and labels beneath them ("Week 1–4", "Week 5–7", "Week 8–9"). The line fills from left to right as the user scrolls through the section (use GSAP ScrollTrigger for this effect).

Below the timeline, the centered pull-quote in `heading-md` italic, `Ink Light` color, with large decorative quotation marks in a rainbow gradient.

**`HardwareSection.js`**

Two-column layout. Left: stacked `ComponentCard` components for all 7 components listed in the blueprint. Right: a stylized flat-design SVG illustration of the robot's components with labeled callout lines (like a product diagram). If a full illustration is too complex, substitute with a clean component spec table with color-coded rows.

Below the two columns, the cost breakdown: a styled bordered table. The total row has a rainbow gradient left border (4px) to draw the eye. Show all three cost tiers with the total bolded.

**`TechStackSection.js`**

Two rows of technology tiles as defined in the blueprint. Each tile: a simple icon or abbreviated wordmark, the technology name, a one-line description, and a color-coded background using the appropriate rainbow accent at ~10% opacity.

**`GetStartedSection.js`**

Full-width section with `#1C1917` (Ink) background — the only dark section on the page. All text is white or light cream.

Center the headline and subtitle. Below, two cards side by side:
1. "Phase 1 Setup" card — periwinkle gradient background, lists the 4-step Python environment checklist, CTA button "Open Development Guide →"
2. "Browse All Docs" card — outlined (white border, transparent background), shows a mini sitemap of the docs section, CTA button "Go to Documentation →"

Below the cards, three link pills for GitHub, community, and issue submission — white outlined pills with ghost hover effect.

---

## Step 9 — Build the Footer

**`src/components/layout/Footer.js`**

Three-column layout on desktop, stacked on mobile. Cream background (`#F5F0E8`). Top border: 1px solid warm gray mid.

Column 1: PICO logo + one-sentence tagline + "Built with ❤️ by [name]"
Column 2: Quick links (Home, Features, How It Works, Hardware)
Column 3: Documentation links (Overview, Dev Guide, Hardware Guide, FAQ)

Below the columns, a full-width bottom strip: copyright notice on the left, tech stack credits on the right ("Built with Next.js, Tailwind CSS, Framer Motion").

---

## Step 10 — Build the Documentation Section

**`src/app/docs/layout.js`**

This is a separate layout from the home page. It uses a three-panel structure:

```
[Fixed Left Sidebar 240px] | [Scrollable Content max-720px] | [Fixed Right TOC 220px]
```

A thin rainbow gradient line runs across the very top of the viewport (4px height, full width) to visually signal "you are in the docs section."

**`src/components/docs/DocsSidebar.js`**

Fixed position sidebar. Renders the full navigation tree with collapsible sections using Radix Accordion. The active page has a periwinkle left border accent on its menu item. Icons precede each section group.

**`src/components/docs/DocsTableOfContents.js`**

Auto-generated from the headings (h2, h3) of the current MDX page. Uses `IntersectionObserver` to highlight the heading currently in the viewport. Clicking a heading scrolls to it.

**`src/components/docs/DocsCallout.js`**

Styled callout boxes. Accepts a `type` prop: `'tip'`, `'warning'`, `'danger'`, `'note'`. Each type has a distinct background color (as defined in the blueprint) and a corresponding icon.

**MDX Content Files**

Convert all provided project documentation files into MDX format in the `content/` directory. The files are:
- `overview.mdx` (from Project_Description.md)
- `development-plan.mdx` (from Development_Plan.md)
- `project-structure.mdx` (from Project_Structure.md)
- `hardware.mdx` (from Hardware.md)
- `technology-stack.mdx` (from Technology_Stack.md)
- `sound-bank-guide.mdx` (from Sound_Bank_Guide.md)
- `windows-guide.mdx` (from Windows_Development_Guide.md)
- `faq.mdx` (from FAQ_Development_Environment.md)

Each MDX file must have a frontmatter block:

```yaml
---
title: "Page Title"
description: "One-sentence description for SEO"
order: 1
section: "Getting Started"
---
```

**`src/lib/mdx.js`**

Utility functions:
- `getAllDocs()` — reads all MDX files from `content/`, returns sorted array of metadata
- `getDocBySlug(slug)` — returns the full MDX content and frontmatter for a specific slug
- `getDocNavigation()` — returns the sidebar tree structure grouped by `section`

**`src/app/docs/[slug]/page.js`**

Dynamic page that:
1. Calls `getDocBySlug(params.slug)` to get content
2. Renders MDX with `next-mdx-remote` using the custom component mapping
3. Generates static params via `generateStaticParams()` using `getAllDocs()`
4. Sets page-level metadata from the frontmatter

---

## Step 11 — Build the About Page

**`src/app/about/page.js`**

Clean editorial layout, max-width 720px, centered. Sections:
1. Hero: large heading "About Project PICO" with a short paragraph
2. The Project Origin: 2–3 paragraphs about the motivation and methodology
3. Open Source: license information, contribution guidelines link
4. The Tech Philosophy: the software-first development ethos
5. Get Involved: GitHub link button and community links

Style consistently with the home page but with no complex animations — just clean typography and soft entrance animations.

---

## Step 12 — Implement Page Transitions

In the root layout, wrap the page content with Framer Motion's `AnimatePresence`. Create a `PageTransition` wrapper component that applies:

```javascript
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }
}
```

Apply this to the `{children}` in the root layout. The background during transition should remain the cream base color so there is no flash of white or black.

---

## Step 13 — Responsive Polish Pass

After all components are built, do a dedicated responsive pass across all breakpoints. Test at:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (small desktop)
- 1440px (standard desktop)
- 1920px (large desktop)

Specific things to verify:
- Hero face scales correctly and remains the focal point at all sizes
- Navigation correctly switches to mobile hamburger menu below `md`
- All feature grids reflow correctly
- Documentation sidebar becomes a drawer on mobile
- No horizontal overflow at any breakpoint
- Touch targets are minimum 44×44px on mobile
- Smooth scroll behavior is disabled on touch devices (Lenis handles this automatically, verify it)

---

## Step 14 — Accessibility Audit

Before considering the build complete, verify:

- Every interactive element is reachable and activatable via keyboard only
- Visible focus rings are present on all focusable elements (use a custom ring style that matches the brand — periwinkle, 2px offset)
- The `PicoFace` component has an `aria-label` that reads: `"PICO robot face showing [expression] expression"` (dynamically updated)
- All images have descriptive `alt` attributes
- Color is never the only means of conveying information (icon + color always used together)
- The docs sidebar has correct ARIA roles for navigation landmark
- Page `<title>` elements are unique and descriptive per page
- Run Lighthouse accessibility audit and resolve any issues scoring below 95

---

## Step 15 — Performance Optimization

After the site is functionally complete:

1. **Dynamic imports:** Any heavy component not needed on initial page load should use `next/dynamic` with `{ loading: () => <Skeleton /> }`. Specifically: the Personality section, Features tabs, and Documentation pages.

2. **Bundle analysis:** Run `ANALYZE=true npm run build` (after installing `@next/bundle-analyzer`) and investigate any unexpectedly large chunks.

3. **GSAP tree shaking:** Only import the GSAP plugins you actually use, not the full library.

4. **Framer Motion tree shaking:** Import only from `framer-motion` directly (e.g., `import { motion } from 'framer-motion'`) — do not import from sub-paths unless necessary.

5. **Image optimization:** All images must use `next/image`. No `<img>` tags.

6. **Font subsetting:** Use the `subsets: ['latin']` option in `next/font/google` to load only the Latin character subset.

7. **Lighthouse check:** Run Lighthouse and target 90+ Performance, 95+ Accessibility, 100 Best Practices, 100 SEO.

---

## Quality Standards — Non-Negotiable

These standards apply to every file you create:

**Code Quality:**
- No `any` typed props — all component props must be fully documented with PropTypes
- No inline styles except for dynamic values that cannot be expressed with Tailwind (e.g., computed pixel offsets for the eye animation)
- No magic numbers — all animation durations, delays, and offsets should be named constants at the top of the file
- Every component file starts with a brief JSDoc comment explaining what it does and what props it accepts
- All `useEffect` hooks have complete dependency arrays and cleanup functions where applicable

**Design Fidelity:**
- Every color used must come from the design system tokens in `src/app/globals.css` — no hardcoded hex values in className strings or js
- Typography must strictly follow the type scale — no arbitrary `text-[22px]` values
- Spacing must be multiples of 8px — use the standard Tailwind spacing scale (which is 4px based, so use every-other value: 2, 4, 6, 8, 10, 12... which maps to 8px, 16px, 24px, 32px, 40px, 48px...)
- The rainbow accent colors must be used sparingly. If you notice any section starting to feel "too colorful," reduce — one accent color per component is usually the maximum

**Animation Standards:**
- All animations must be controlled by the `prefers-reduced-motion` CSS media query. The Lenis smooth scroll must be disabled when `prefers-reduced-motion: reduce` is set.
- No animation should block user interaction — all entrance animations should play behind the existing content, not push it around
- The `PicoFace` boot-up animation plays once per page load. It does not replay on navigation between pages.

**File Organization:**
- Follow the directory structure in **Blueprint Section 10** exactly
- One component per file
- Component files named in PascalCase
- Utility files named in camelCase
- MDX content files named in kebab-case

---

## Content to Use

Use the following content from the source project documents when populating sections:

- **Hero tagline and robot description** → from `Project_Description.md`, section "Core Concept & Architecture"
- **Feature listings** → from `Features.md`, all sections
- **Hardware components and specs** → from `Hardware.md`
- **Technology stack details** → from `Technology_Stack.md`
- **Development phases** → from `Development_Plan.md`
- **Sound bank information** → from `Sound_Bank_Guide.md`
- **Cost breakdown** → from `Project_Description.md`, section "Cost Structure"
- **Eye expression strings** → from `Project_Description.md`, section "The Eyes (OLED Screen)"
- **FAQ content** → from `FAQ_Development_Environment.md`

Do not invent specifications, pricing, or technical details that are not present in the source documents.

---

## Deployment Configuration

Create a `vercel.json` at the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

Create a `next.config.mjs` that:
- Enables the MDX plugin (`@next/mdx`)
- Configures `pageExtensions: ['js', 'jsx', 'md', 'mdx']`
- Sets up any required `images.remotePatterns` for external images
- Sets `reactStrictMode: true`

Create a `.env.local.example` file documenting any environment variables needed (none expected for this static site, but document the file as a placeholder with a comment).

---

## Final Deliverable Checklist

Before declaring the build complete, verify every item:

**Functionality:**
- [ ] Home page loads with full boot-up eye animation
- [ ] All home page sections scroll smoothly into view with entrance animations
- [ ] PICO eyes track mouse cursor in the hero
- [ ] Expression showcase carousel auto-plays and is pausable
- [ ] Emotion engine cards trigger expression change on hover
- [ ] Features tabs navigate correctly, all content renders
- [ ] Navigation smooth-scrolls to sections
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] All documentation pages render MDX content correctly
- [ ] Docs sidebar highlights active page
- [ ] Docs table of contents highlights active heading on scroll
- [ ] Page transitions work on navigation between home and docs
- [ ] "Start Building" and all CTA buttons link to correct destinations

**Visual:**
- [ ] Cream base color is consistent across all sections
- [ ] Rainbow accents appear only as small, purposeful highlights
- [ ] Typography follows the defined scale throughout
- [ ] Dark CTA section provides correct contrast
- [ ] All hover states are implemented
- [ ] Responsive layout works at all defined breakpoints

**Technical:**
- [ ] `npm run build` completes with zero errors
- [ ] No console errors or warnings in the browser
- [ ] Lighthouse Performance score 90+
- [ ] Lighthouse Accessibility score 95+
- [ ] No horizontal overflow at any viewport width
- [ ] `prefers-reduced-motion` disables all animations correctly

---

*Begin with Step 0. Read the blueprint. Then build in the exact order specified above. Do not skip steps.*
