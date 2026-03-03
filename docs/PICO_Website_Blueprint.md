# Project PICO — Website Blueprint
### A Complete Planning Document for Design, Architecture & Implementation

---

## Table of Contents

1. [Project Overview & Website Goals](#1-project-overview--website-goals)
2. [Technology Stack](#2-technology-stack)
3. [Design Philosophy & Visual Identity](#3-design-philosophy--visual-identity)
4. [Design System](#4-design-system)
5. [Site Architecture & Pages](#5-site-architecture--pages)
6. [Page-by-Page Breakdown](#6-page-by-page-breakdown)
7. [Component Library](#7-component-library)
8. [Animation & Interaction Strategy](#8-animation--interaction-strategy)
9. [Responsive Design Strategy](#9-responsive-design-strategy)
10. [Project Structure](#10-project-structure)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Performance & SEO Considerations](#12-performance--seo-considerations)

---

## 1. Project Overview & Website Goals

### What This Website Is

The Project PICO website is a **public-facing showcase and documentation hub** for an AI desktop companion robot. It serves multiple audiences simultaneously: curious visitors who stumble upon it, maker-community members evaluating whether to build one, and active developers who need technical reference material.

### Core Goals

The website must accomplish the following in order of priority:

**Goal 1 — Immediately communicate what PICO is.** A visitor who has never heard of the project should understand within 5 seconds that this is a cute, non-verbal AI robot companion that sits on your desk and reacts to you like a pet.

**Goal 2 — Inspire and excite.** The project is genuinely delightful. The website should feel alive, playful, and slightly magical — mirroring PICO's own personality. It should make someone want to build one.

**Goal 3 — Provide a clear path to getting started.** Whether a visitor wants to read documentation, understand the hardware, or jump straight into the development guide, the journey from landing to action should be no more than 2 clicks.

**Goal 4 — Establish credibility.** Through clean design, well-structured documentation, and thorough feature showcasing, the site should signal that this is a serious, well-engineered project — not just a toy prototype.

### Target Audiences

| Audience | What They Need | How the Website Serves Them |
|---|---|---|
| Curious general visitors | To understand what PICO is in 30 seconds | Hero section with animated demo |
| Makers & hobbyists | Feature list, cost breakdown, hardware specs | Features & Hardware sections |
| Developers | Technical docs, project structure, APIs | Documentation section & GitHub link |
| Educators & institutions | Use cases, learning potential | Project description + applications section |

---

## 2. Technology Stack

### Core Framework

**Next.js 15+ (App Router)**

Next.js is the right choice for this project for several reasons. The App Router enables fast, server-rendered pages out of the box, which is critical for SEO and initial load performance. Static generation works perfectly for documentation pages. The file-system routing is clean and maintainable. Image optimization via `next/image` will handle any robot photography or illustrations efficiently.

```
Framework:    Next.js 15+ (App Router)
Language:     JavaScript (ES2022+)
Styling:      Tailwind CSS v4
Package Mgr:  npm or pnpm (pnpm recommended for speed)
Node Version: 20+ (required by Next.js 15+)
```

### Styling

**Tailwind CSS v4**

Tailwind's utility-first approach pairs exceptionally well with component-driven development in Next.js. The integrated compiler means zero unused CSS in production. Custom design tokens (colors, spacing, fonts) will be defined in `src/app/globals.css` using the `@theme` directive so the entire design system lives natively in standard CSS.

### Animation Libraries

**Framer Motion** — Primary animation library for React. Handles entrance animations, page transitions, scroll-triggered effects, hover states, and the PICO eye animations. Its `useInView` hook and `whileInView` prop make scroll-based animations trivially easy.

```bash
npm install framer-motion
```

**Lenis** — For buttery smooth scroll behavior site-wide. Lenis intercepts native scroll and replaces it with a lerp-based smooth scroll that feels premium and intentional.

```bash
npm install lenis
```

### UI Component Libraries

**Radix UI Primitives** — Accessible, unstyled UI primitives for interactive components like accordions, tabs, tooltips, and modals. These provide correct ARIA semantics and keyboard navigation out of the box, then get styled with Tailwind.

```bash
npm install @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-dialog
```

**shadcn/ui** — A curated set of copy-paste components built on Radix + Tailwind. Use it for things like badges, cards, and buttons to establish consistency quickly without reinventing the wheel.

### Additional Utility Libraries

**clsx + tailwind-merge** — For conditional class merging in components without className conflicts.

```bash
npm install clsx tailwind-merge
```

**React Icons** — Comprehensive icon library supporting multiple icon sets in a single package (Heroicons, Feather, etc.).

```bash
npm install react-icons
```

**next-mdx-remote** — For rendering MDX documentation content from files, enabling a clean docs section powered by markdown files.

```bash
npm install next-mdx-remote
```

**react-syntax-highlighter** — For beautifully styled code blocks throughout the documentation section.

```bash
npm install react-syntax-highlighter
```

---

## 3. Design Philosophy & Visual Identity

### The Core Aesthetic Direction

The visual identity of PICO's website should feel like **"a warm, friendly lab notebook that has come to life."** It's technical and precise, but also warm, approachable, and a little playful. Think of the intersection between a well-designed maker community site and a consumer tech product page.

The creamy white base you've proposed is excellent — it reads as premium without the clinical coldness of pure white, and it's much easier on the eyes for long reading sessions. The rainbow accent strategy is equally strong because it visually echoes the idea that PICO can express a whole spectrum of emotions.

### Design Keywords

These five adjectives should guide every design decision made on this site:

- **Warm** — Like welcoming someone into a workshop
- **Playful** — Echoing PICO's pet-like personality
- **Precise** — Engineering credibility comes through clean grids and deliberate spacing
- **Alive** — Subtle motion everywhere; the site should feel like it breathes
- **Honest** — No marketing fluff; clear, direct copy that respects the reader's intelligence

### Visual Metaphor

The OLED "eyes" of PICO are the project's most iconic visual element. They should appear throughout the website as a recurring motif — as section dividers, as loading states, as decorative elements, and most prominently in the hero section where they are animated to be interactive. This gives the site a unique visual fingerprint that is immediately tied to the product.

---

## 4. Design System

### Color Palette

#### Base Colors (Backgrounds & Surfaces)

```
Cream Base:       #FDFBF4   (primary page background)
Warm White:       #FFFEF9   (card surfaces, elevated elements)
Warm Gray Light:  #F5F0E8   (subtle section dividers, input backgrounds)
Warm Gray Mid:    #E8E0D0   (borders, separators)
Ink:              #1C1917   (primary text — warm near-black, not pure black)
Ink Light:        #44403C   (secondary text, captions)
Ink Muted:        #78716C   (placeholder text, metadata)
```

#### Rainbow Accent Palette

The rainbow accents are drawn from a carefully curated palette that maintains harmony while covering the full spectrum. Each color maps to a specific use case to create meaning rather than decoration.

```
Coral Red:        #FF6B6B   → Error states, "scolded" personality, warning badges
Warm Orange:      #FF9E40   → Energy, hardware section highlights
Golden Yellow:    #FFCB47   → Happy state, achievements, star ratings
Lime Green:       #7ED957   → Success states, online indicators, confirmed actions
Teal:             #4ECDC4   → AI & cloud features, processing states
Sky Blue:         #45B7D1   → Vision & camera features, informational
Periwinkle:       #8B9CF4   → Development features, code-related content
Lavender:         #C77DFF   → Advanced AI, machine learning features
Pink Rose:        #FF85A1   → Touch/affection interactions, "loved" state
```

#### Semantic Color Usage

```
Primary Action:   Periwinkle #8B9CF4  (main buttons, links, CTAs)
Secondary Action: Teal #4ECDC4        (secondary buttons, hover highlights)
Success:          Lime Green #7ED957  
Warning:          Golden Yellow #FFCB47
Error:            Coral Red #FF6B6B
Info:             Sky Blue #45B7D1
```

#### Gradient Definitions

These gradients are used for accent elements, badge backgrounds, and highlight strips. They should appear sparingly to maintain their visual impact.

```
Rainbow Shimmer:  linear-gradient(135deg, #FF6B6B, #FF9E40, #FFCB47, #7ED957, #4ECDC4, #45B7D1, #8B9CF4, #C77DFF)
Warm Glow:        linear-gradient(135deg, #FFCB47 0%, #FF9E40 100%)
Cool Glow:        linear-gradient(135deg, #45B7D1 0%, #8B9CF4 100%)
Life Glow:        linear-gradient(135deg, #7ED957 0%, #4ECDC4 100%)
```

### Typography

#### Font Stack

```
Display/Headings: "DM Sans" (Google Fonts) — friendly, rounded, modern
Body Text:        "Inter" (Google Fonts) — excellent readability at small sizes
Monospace/Code:   "JetBrains Mono" (Google Fonts) — clean code blocks
```

**Why DM Sans for headings?** Its rounded terminals and geometric forms echo the rounded, approachable nature of PICO's eye animations. It has personality without sacrificing legibility.

**Why Inter for body?** It was specifically designed for screen readability. At 16px with comfortable line-height, it's effortless to read in documentation.

#### Type Scale (Tailwind @theme Custom Config)

```css
/* src/app/globals.css */
@theme {
  'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
  'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
  'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
  'heading-lg': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
  'heading-md': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
  'heading-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
  'body-lg':    ['1.125rem', { lineHeight: '1.7' }],
  'body-md':    ['1rem', { lineHeight: '1.65' }],
  'body-sm':    ['0.875rem', { lineHeight: '1.6' }],
  'caption':    ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
  'code':       ['0.875rem', { lineHeight: '1.6', fontFamily: 'JetBrains Mono' }],
}
```

(Or equivalent mappings inside the `@theme` directive based on Tailwind v4 CSS variable syntax).

### Spacing & Layout

```
Base Grid:        8px (all spacing is a multiple of 8px)
Content Width:    1200px maximum
Reading Width:    720px maximum (for documentation text columns)
Section Padding:  96px vertical (desktop), 64px (tablet), 48px (mobile)
Gutter:           24px (mobile), 32px (tablet), 48px (desktop)
```

### Border Radius

```
Sharp (inputs, code blocks): 4px
Standard (cards, buttons):   12px
Large (modals, hero cards):  20px
Pill (badges, tags):         9999px
```

### Shadow System

Shadows use warm tones to maintain the cream palette's warmth.

```
Shadow SM:  0 1px 3px rgba(28, 25, 23, 0.06), 0 1px 2px rgba(28, 25, 23, 0.04)
Shadow MD:  0 4px 12px rgba(28, 25, 23, 0.08), 0 2px 4px rgba(28, 25, 23, 0.04)
Shadow LG:  0 12px 32px rgba(28, 25, 23, 0.10), 0 4px 8px rgba(28, 25, 23, 0.06)
Shadow XL:  0 24px 64px rgba(28, 25, 23, 0.12), 0 8px 16px rgba(28, 25, 23, 0.08)

Glow Periwinkle: 0 0 24px rgba(139, 156, 244, 0.35)
Glow Teal:       0 0 24px rgba(78, 205, 196, 0.35)
Glow Yellow:     0 0 24px rgba(255, 203, 71, 0.35)
```

---

## 5. Site Architecture & Pages

### Page Map

```
pico-robot.dev/
│
├── /                     ← Home (One-page scroll experience)
│   ├── #hero             (PICO eyes animation + headline)
│   ├── #what-is-pico     (Core concept explainer)
│   ├── #personality      (Emotion engine showcase)
│   ├── #features         (Feature grid)
│   ├── #how-it-works     (3-phase development methodology)
│   ├── #hardware         (Component breakdown)
│   ├── #tech-stack       (Technologies used)
│   └── #get-started      (CTA section)
│
├── /docs                 ← Documentation Hub
│   ├── /docs/overview
│   ├── /docs/development-plan
│   ├── /docs/project-structure
│   ├── /docs/hardware
│   ├── /docs/technology-stack
│   ├── /docs/sound-bank-guide
│   ├── /docs/windows-guide
│   └── /docs/faq
│
└── /about                ← Project background & project info
```

### Navigation Strategy

The site uses a **floating navigation bar** that starts transparent over the hero and transitions to a solid cream background with subtle blur (backdrop-filter) as the user scrolls down. This is a premium pattern used by well-regarded product sites.

Navigation links for the home page will use smooth-scroll anchor behavior. On docs pages, the nav shows a "breadcrumb" sub-bar below the main nav.

---

## 6. Page-by-Page Breakdown

### 6.1 Home Page (/)

The home page is a single continuous scroll experience divided into clearly delineated sections. Each section transitions into the next with purposeful spacing and subtle scroll-triggered animations.

---

#### Section 1: Hero

**Purpose:** Create an immediate emotional connection. Make the visitor feel like PICO is looking at them.

**Layout:**
Full-viewport-height section. Content is centered vertically and horizontally. A large animated PICO "face" sits prominently in the upper-center portion of the screen, with headline text below it.

**The PICO Eye Animation (Centerpiece):**
This is the most important element on the entire site. Two large OLED-style eye shapes (rendered as SVG or canvas) are displayed side by side on a dark rounded rectangle that mimics the robot's face. The eyes are animated using Framer Motion:

- **Default state:** Eyes blink gently every 3–5 seconds (randomized). Pupils subtly shift based on mouse cursor position (parallax tracking).
- **On page load:** Eyes appear one at a time with a "turning on" flicker effect (simulating OLED boot-up).
- **Hover interaction:** Eyes change to a happy expression (`^.^`) with a sparkle particle effect.
- **Random idle behaviors:** Occasionally the robot looks left, then right (curious). Occasionally shows a sleepy eye state before snapping back to alert. This should feel organic, not looped.

The face card itself sits on a subtle background of faint grid dots (like graph paper) that adds texture without competing with the content.

**Headline Copy:**
```
Meet Pico.
Your AI companion that 
sees, hears, and feels.
```

The headline uses the display-xl type size. "Pico." appears first in one animated line (the name slides up and fades in). The subtitle fades in half a second later. Below the headline, a short two-line description:

```
An emotionally responsive desktop robot that communicates
like a pet — through chirps, expressions, and movement.
```

**CTA Buttons:**
Two side-by-side buttons below the description:
1. **"Start Building"** — Primary button, periwinkle background, links to `/docs/development-plan`
2. **"See How It Works"** — Secondary button (outlined), smooth-scrolls to the `#how-it-works` section

**Background Treatment:**
The cream base with an extremely subtle radial gradient bloom behind the robot face (a soft warm glow, like the robot is emitting a slight warmth). No photography — this is intentional to keep the focus on the animated face.

**Scroll Indicator:**
A small animated "scroll" indicator at the very bottom of the viewport (a bouncing dot or animated chevron). It fades out after the user begins scrolling.

---

#### Section 2: What Is PICO?

**Purpose:** Give the 30-second elevator pitch with more substance than the hero tagline.

**Layout:**
Two-column layout on desktop. Left column: large text block. Right column: an animated "expression showcase" — a card cycling through PICO's different eye states with their names and triggers labeled.

**Left Column — Core Copy:**

A large pull-quote in the `heading-lg` size:

> *"Unlike smart speakers that just answer questions, Pico behaves like a living pet. It's a non-verbal AI companion that communicates through expressive sounds, animated eyes, and head movements."*

Below this, three iconographic cards in a horizontal row, each with a rainbow-accented icon and short text:

| Card | Icon | Headline | Description |
|---|---|---|---|
| Sees | Eye icon (Sky Blue accent) | It Sees You | Face detection and recognition. Knows your face, remembers you. |
| Hears | Mic icon (Teal accent) | It Hears You | Wake-word detection and speech-to-text. Understands your commands. |
| Feels | Hand icon (Pink Rose accent) | It Feels Touch | Capacitive touch sensor. Pet it and it purrs. |

**Right Column — Expression Showcase:**
An auto-playing (but user-pausable) carousel of PICO face states. Each state shows:
- The rendered eye expression (large, centered on a dark rounded card)
- The state name (e.g., `HAPPY`, `CURIOUS`, `LISTENING`)
- The trigger that causes it (e.g., "Touch Sensor Activated")
- The audio reaction (e.g., "Purring sound 🎵")

The transitions between states should use a smooth cross-fade. The active state indicator is a row of small dots below the card styled with the rainbow palette.

---

#### Section 3: The Personality Engine

**Purpose:** Show the depth of PICO's emotional system in a visually engaging way.

**Layout:**
Full-width section with a slightly darker warm-gray background (`#F5F0E8`) to differentiate it from the surrounding cream sections. Centered content with a maximum width of 1100px.

**Section Header:**
```
The Emotion Engine
Every trigger has a reaction. Every moment, an expression.
```

**Content — Interactive Reaction Table:**
Rather than showing a static table (as in the features document), this becomes an interactive component. It displays as a visual grid of "trigger → reaction" cards. Each card is a mini-panel showing:
- A color-coded trigger icon (using the rainbow palette — hardware triggers in orange, voice triggers in teal, face triggers in sky blue)
- A small animated OLED eye preview
- The audio reaction label

On hover over any card, it animates: the eyes change expression, a subtle sound wave icon animates, and the card elevates with a shadow. This makes the emotion system feel tangible rather than abstract.

The cards are arranged in a responsive masonry-style grid (3 columns on desktop, 2 on tablet, 1 on mobile).

---

#### Section 4: Features

**Purpose:** Comprehensive feature overview with clear categorization.

**Layout:**
Tabbed interface using Radix UI Tabs. The tab bar sits at the top of the section with rainbow-accented active tab indicators. Tabs navigate between feature categories.

**Tabs:**
```
🤖 Core System  |  🗣️ Voice & AI  |  👁️ Vision  |  🥰 Personality  |  ⚙️ Hardware  |  🔌 IoT
```

**Each Tab Content:**
A clean grid of feature cards (3 per row on desktop). Each card shows:
- Feature ID badge (e.g., `AI-1`) styled as a monospace pill in the category's accent color
- Feature name as `heading-sm`
- A 1–2 sentence description
- A small icon

**Featured Feature Callout:**
At the bottom of every tab, one "spotlight" feature card spans the full width. This is a larger card with a gradient background, more detailed description, and an illustration/animation. For example, the Voice tab's spotlight would be the AI Intent Recognition feature.

---

#### Section 5: How It Works — The Development Methodology

**Purpose:** Explain the software-first development methodology visually. This is a key differentiator of the project and deserves its own prominently designed section.

**Layout:**
Three-step horizontal flow on desktop, vertical on mobile. Each step is a large card that unfolds on scroll.

**Step 1 — PC Simulation (Weeks 1–4)**
Accent color: Periwinkle
Icon: Laptop with code
Content: Describe building the entire AI personality in Python on a standard Windows PC first.
Visual: A simplified code snippet showing the Python `RobotHardware` abstraction class.

**Step 2 — Code Translation (Weeks 5–7)**
Accent color: Teal
Icon: Arrow/transform icon
Content: Translate Python to C++ for the ESP32-S3. The same architecture, different language.
Visual: Side-by-side comparison of Python class vs. C++ class (the same interface, different implementations). Use the syntax highlighter here.

**Step 3 — Hardware Assembly (Weeks 8–9)**
Accent color: Warm Orange
Icon: Circuit board / robot
Content: 3D print the enclosure, assemble components, deploy.
Visual: Component checklist with checkboxes (aesthetic, not functional) showing all hardware parts.

**Timeline Bar:**
Below the three cards, a visual timeline bar shows the 9-week journey with milestone markers.

**Pull Quote:**
A large, centered quote:
> *"Build the AI brain before the physical body. Test everything on your PC before buying a single component."*

---

#### Section 6: Hardware

**Purpose:** Give makers a clear picture of the components required.

**Layout:**
Two-column layout. Left: Component list with specs. Right: Illustrated component diagram (or stylized flat-design illustration of the robot with callout lines).

**Component Cards:**
Each major component gets a card:

| Component | Card Accent | Details Shown |
|---|---|---|
| ESP32-S3-EYE | Teal | Specs: Dual-core 240MHz, 8MB PSRAM, 2MP Camera, Wi-Fi |
| OLED Display | Periwinkle | 128×64px, 0.96", I2C interface |
| Micro Servos (×2) | Warm Orange | SG90, Pan/Tilt 2-axis head movement |
| LiPo Battery | Lime Green | 3.7V, 1000mAh, 6–8hr runtime |
| Touch Sensor | Pink Rose | TTP223 capacitive, forehead placement |
| Speaker + Amplifier | Golden Yellow | I2S digital, sound bank playback |
| TP4056 Charger | Sky Blue | USB-C fast charging |

**Cost Breakdown:**
A styled table showing the component cost breakdown:
- ESP32-S3-EYE: ₹4,200–₹5,500
- Supporting components: ₹1,500–₹2,200
- 3D printing: ₹800–₹1,200
- **Total: ₹6,500–₹8,900**

This is displayed with a subtle rainbow gradient border on the total row to draw the eye.

---

#### Section 7: Technology Stack

**Purpose:** Quick visual overview of the tech stack for developer audiences.

**Layout:**
Clean icon grid. Two rows — "Development Tools" and "Robot & Hardware". Each technology gets a logo tile with its name, a one-line description, and its purpose in the project.

**Row 1 — Development Tools:**
Python, VS Code, OpenCV, Google Gemini API, Google Speech-to-Text, FreeRTOS

**Row 2 — Hardware & Embedded:**
Arduino IDE, ESP-IDF, ESP-WHO, Git, Windows 11

Each tile has a soft colored background using the rainbow palette relevant to its category.

---

#### Section 8: Get Started (CTA)

**Purpose:** Convert interest into action. This is the final push.

**Layout:**
Full-width section with a dark background (`#1C1917` — the ink color) breaking the cream pattern. This dark section creates dramatic visual contrast and signals "this is important."

**Headline:**
```
Ready to build your AI companion?
```

In white, `display-lg` size. Below it:
```
Start with PC simulation. No hardware required to begin.
```

**Two CTA Paths:**

Path 1 — "Start with Phase 1" (Prominent)
Large card with periwinkle gradient background. Shows the Phase 1 Python setup checklist (4 items). CTA button: "Open Development Guide →"

Path 2 — "Browse All Docs" (Secondary)
Outlined card. Shows the documentation structure as a mini sitemap. CTA button: "Go to Documentation →"

**Social/Community Links:**
Below the CTA cards, a row of link pills:
- GitHub (full source code)
- Discord/Community (if applicable)
- "Submit an Issue"

---

### 6.2 Documentation Pages (/docs/*)

The documentation section is a separate layout from the home page.

**Layout Structure:**
Three-column layout:
- **Left (240px):** Fixed sidebar navigation with collapsible sections
- **Center (fluid, max 720px):** MDX-rendered document content
- **Right (220px):** Table of contents for the current page (auto-generated from headings)

**Left Sidebar:**
```
📖 Getting Started
    Overview
    Development Plan

🏗️ Architecture
    Project Structure
    Technology Stack
    Structure Rationale

🔧 Hardware
    Hardware Guide

🗣️ Sound & Personality
    Sound Bank Guide
    Features Reference

💻 Development
    Windows Dev Guide
    FAQ
```

The active page is highlighted with a periwinkle accent on the left border of its menu item.

**Content Rendering:**
MDX content renders with custom styled components for headings, paragraphs, code blocks, tables, and callout boxes. Code blocks use `react-syntax-highlighter` with a custom theme that matches the warm cream palette (light theme with warm-tinted token colors).

**Callout Box Types:**
```
💡 TIP        (yellow background)
⚠️ WARNING    (orange background)
❌ DANGER     (red background)
✅ NOTE       (teal/green background)
```

**Top Banner:**
A thin rainbow-gradient top border across the entire docs layout signals you're in the documentation section.

---

### 6.3 About Page (/about)

A simpler page covering:
- The origin and motivation for the project
- The open-source philosophy
- Acknowledgments and credits
- License information

Styled consistently with the home page but with simpler, more editorial layout (large text, minimal decoration).

---

## 7. Component Library

### Core UI Components

These are the reusable building blocks that should be built first, as they appear throughout the site.

#### `<PicoFace />`
The animated OLED eye component. Accepts props:
- `expression`: `'idle' | 'happy' | 'curious' | 'sleepy' | 'listening' | 'confused' | 'loved' | 'surprised'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `interactive`: `boolean` — enables mouse-tracking pupil movement
- `autoAnimate`: `boolean` — enables random idle behaviors
- `darkMode`: `boolean` — dark OLED style vs. light style

This component is used in the hero, the expression showcase, and the emotion engine cards.

#### `<FeatureCard />`
A content card for displaying a single feature. Props:
- `id`: Feature ID string (e.g., `"AI-1"`)
- `title`: Feature name
- `description`: Short description
- `icon`: React component
- `accentColor`: One of the rainbow colors
- `category`: For color-coding the ID badge

#### `<CodeBlock />`
Styled code snippet with syntax highlighting. Props:
- `language`: `'python' | 'cpp' | 'javascript' | 'bash' | 'text'`
- `filename`: Optional filename to display in header tab
- `highlight`: Array of line numbers to highlight
- `title`: Optional title above the block

#### `<StepCard />`
For the 3-phase methodology section. Large card with a numbered step indicator, title, description, and optional code/illustration slot.

#### `<ComponentCard />`
For the hardware section. Shows component name, specs, accent color, and pricing.

#### `<NavBar />`
The floating navigation. Transparent on hero, solid/blurred on scroll. Contains:
- PICO logo (small eye animation + "Pico" wordmark)
- Navigation links
- "Docs" CTA button (periwinkle)
- Theme toggle (optional — light/dark)

#### `<SectionHeader />`
Consistent section title treatment used across all home page sections. Contains:
- Small rainbow pill badge (section category, e.g., "Personality System")
- Large heading
- Optional subtitle paragraph

#### `<EyeExpression />`
A single eye shape (left or right). Used within `<PicoFace />`. Handles all expression shapes as SVG paths.

#### `<RainbowBadge />`
Small pill-shaped badge with gradient border. Used for feature IDs, category labels, and status indicators.

#### `<AnimatedCounter />`
Scroll-triggered number counter. Used for stats like "240MHz", "95% accuracy", "6–8 hrs battery".

---

## 8. Animation & Interaction Strategy

### Philosophy

Animation on this site serves three purposes in order of importance:

1. **Communication** — Animations explain what PICO does (the eye animations literally show the product's core behavior)
2. **Delight** — Small moments of surprise and joy that make the site feel alive
3. **Polish** — Entrance animations, smooth transitions, and hover states that signal quality

Animations should never slow the user down. If an animation is longer than 600ms, it needs a very good reason to exist.

### Scroll Animation System

Every section uses a consistent scroll-entrance pattern. As a section enters the viewport (triggered at 20% visibility using Framer Motion's `useInView`), its content animates in. The pattern varies by section type:

```
Default entrance:   opacity 0→1, translateY 24px→0, duration 500ms, ease: easeOut
Stagger children:   Each child adds 80ms delay
Card entrance:      opacity 0→1, translateY 16px→0, scale 0.97→1, duration 400ms
```

### Hero Eye Animation — Detailed Spec

This is the most complex animation on the site and deserves a detailed specification:

**Boot-up Sequence (on page load):**
1. Screen starts fully dark (robot face card background is visible, but eyes are off)
2. At 300ms: Left eye appears with a horizontal scan-line effect (top to bottom, 200ms)
3. At 500ms: Right eye appears with same scan-line effect
4. At 800ms: Eyes are at full brightness, then blink once (50ms close, 80ms open)
5. At 1000ms: Normal idle state begins

**Idle State:**
- Eyes blink randomly every 3000–6000ms (randomized per eye with slight offset)
- Pupils drift ±4px randomly every 4–8 seconds (slow, organic movement)
- Occasionally (every 15–30 seconds) look left then right (curious sweep: 200ms each direction)

**Mouse Tracking:**
When `interactive` is true, pupils follow cursor position. The tracking range is limited so pupils don't go to extremes (maximum 8px displacement). Uses a lerp/spring interpolation so the movement is smooth.

**Expression Transitions:**
All expression changes use a 150ms fade through a half-blink (eyes close halfway, expression changes, eyes reopen). This mimics natural facial expression changes.

### Page Transition

Between the home page and documentation pages, use a custom Next.js page transition. The outgoing page fades to cream over 250ms, and the incoming page fades in from cream over 250ms. Total transition: 500ms. This is handled in the root layout using Framer Motion's `AnimatePresence`.

### Lenis Smooth Scroll Configuration

```javascript
// lenis initialization
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
})
```

### Hover States

All interactive elements have explicit hover states:

- **Buttons:** Scale 1.02, shadow elevation +1 level, 200ms transition
- **Cards:** Shadow elevation +2 levels, translateY -2px, 200ms transition
- **Nav links:** Underline slides in from left, color shifts to accent
- **Feature cards:** Slight rotation (1deg), color shift on ID badge, 200ms transition

---

## 9. Responsive Design Strategy

### Breakpoints (Tailwind Defaults with Custom Addition)

```javascript
// src/app/globals.css
@theme {
  --breakpoint-xs: 475px;
  /* (other breakpoints are defaults) */
}
  'xs': '475px',   // Large phones (custom)
  'sm': '640px',   // Small tablets (Tailwind default)
  'md': '768px',   // Tablets (Tailwind default)
  'lg': '1024px',  // Small desktops (Tailwind default)
  'xl': '1280px',  // Large desktops (Tailwind default)
  '2xl': '1536px', // Extra large (Tailwind default)
```

### Mobile-First Approach

Every component is designed for mobile first, then enhanced for larger screens. A few key responsive behaviors:

**Hero Section:**
- Mobile: Eye animation scales down to 280px wide; headline at `display-md`; CTAs stack vertically
- Tablet: Eyes at 380px; headline at `display-lg`; CTAs side by side
- Desktop: Eyes at full 480px; headline at `display-xl`

**Navigation:**
- Mobile: Hamburger menu with full-screen slide-in overlay
- Desktop: Full horizontal nav bar

**Feature Tabs:**
- Mobile: Tabs become a dropdown select; grid switches to single column
- Desktop: Full tab bar; 3-column grid

**Hardware Section:**
- Mobile: Single column component cards
- Desktop: Two columns with spec table on left, diagram on right

**Documentation Sidebar:**
- Mobile: Sidebar becomes a top-sliding drawer, triggered by a hamburger button
- Desktop: Persistent fixed sidebar at 240px width

---

## 10. Project Structure

```
web/
├── src/                          # Source code root
│   ├── app/                      # Next.js App Router
│   │   ├── layout.js             # Root layout (fonts, providers, Lenis init)
│   │   ├── page.js               # Home page (all sections)
│   │   ├── globals.css           # Global styles, Tailwind v4 @theme, font imports
│   │   ├── about/
│   │   │   └── page.js
│   │   └── docs/
│   │       ├── layout.js         # Docs layout (sidebar + TOC)
│   │       ├── page.js           # Docs index/overview
│   │       └── [slug]/
│   │           └── page.js       # Dynamic doc pages
│   │
│   ├── components/               # React components directory
│   │   ├── ui/                   # Base UI components (shadcn-style)
│   │   │   ├── Button.js
│   │   │   ├── Badge.js
│   │   │   ├── Card.js
│   │   │   ├── Tabs.js
│   │   │   └── CodeBlock.js
│   │   │
│   │   ├── pico/                 # PICO-specific components
│   │   │   ├── PicoFace.js       # The main eye animation component
│   │   │   ├── EyeExpression.js  # Single eye SVG component
│   │   │   └── EmotionCard.js    # Emotion trigger/reaction card
│   │   │
│   │   ├── home/                 # Home page section components
│   │   │   ├── HeroSection.js
│   │   │   ├── WhatIsPicoSection.js
│   │   │   ├── PersonalitySection.js
│   │   │   ├── FeaturesSection.js
│   │   │   ├── HowItWorksSection.js
│   │   │   ├── HardwareSection.js
│   │   │   ├── TechStackSection.js
│   │   │   └── GetStartedSection.js
│   │   │
│   │   ├── docs/                 # Documentation components
│   │   │   ├── DocsSidebar.js
│   │   │   ├── DocsTableOfContents.js
│   │   │   ├── DocsBreadcrumb.js
│   │   │   └── DocsCallout.js
│   │   │
│   │   ├── layout/               # Global layout components
│   │   │   ├── NavBar.js
│   │   │   ├── Footer.js
│   │   │   └── SectionHeader.js
│   │   │
│   │   └── shared/               # Shared utility components
│   │       ├── AnimatedCounter.js
│   │       ├── RainbowBadge.js
│   │       ├── ComponentCard.js
│   │       ├── FeatureCard.js
│   │       └── StepCard.js
│   │
│   ├── lib/                      # Utility functions
│   │   ├── mdx.js                # MDX parsing and metadata utilities
│   │   ├── motion.js             # Shared Framer Motion variants
│   │   └── utils.js              # clsx/twMerge helper and misc utils
│   │
│   └── hooks/                    # Custom React hooks
│       ├── useMousePosition.js   # For eye cursor tracking
│       ├── useScrollProgress.js  # Scroll-based animations
│       └── useLenis.js           # Lenis scroll instance
│
├── content/                      # MDX documentation files
│   ├── overview.mdx
│   ├── development-plan.mdx
│   ├── project-structure.mdx
│   ├── hardware.mdx
│   ├── technology-stack.mdx
│   ├── sound-bank-guide.mdx
│   ├── windows-guide.mdx
│   └── faq.mdx
│
├── public/
│   ├── sounds/                   # Sample .wav files for demo
│   └── fonts/                    # Self-hosted fallback fonts (optional)
│
├── next.config.mjs               # Next.js config (MDX plugin, external domains)
└── package.json
```

---

## 11. Implementation Roadmap

### Phase 1 — Foundation (Days 1–3)

Set up the project, design system, and build the most important component first.

**Day 1:**
- Initialize Next.js project with App Router and TypeScript
- Configure Tailwind with the full design system (all colors, fonts, spacing)
- Install all dependencies
- Set up global layout, fonts, and Lenis smooth scroll
- Create the NavBar component (transparent + scroll behavior)

**Day 2:**
- Build the `PicoFace` and `EyeExpression` components
- Implement all 8 expression states as SVG paths
- Implement boot-up animation sequence
- Implement idle blinking and random drift behaviors

**Day 3:**
- Build the `HeroSection` using the completed `PicoFace`
- Implement mouse tracking for hero eyes
- Build base UI components: `Button`, `Badge`, `Card`, `RainbowBadge`
- Create the `SectionHeader` component

### Phase 2 — Home Page Sections (Days 4–7)

**Day 4:**
- `WhatIsPicoSection` with expression carousel
- `PersonalitySection` with emotion engine grid

**Day 5:**
- `FeaturesSection` with Radix tabs and feature card grid

**Day 6:**
- `HowItWorksSection` with 3-step cards and code comparison
- `HardwareSection` with component cards and cost table

**Day 7:**
- `TechStackSection`
- `GetStartedSection` (dark CTA section)
- Footer component
- Page-level scroll animations and section entrance effects

### Phase 3 — Documentation (Days 8–10)

**Day 8:**
- Docs layout with sidebar and table of contents
- Convert all provided .md files to .mdx
- Set up dynamic routing for docs pages

**Day 9:**
- MDX rendering with custom components (callouts, code blocks, tables)
- Sidebar navigation with active states
- Mobile docs navigation (drawer)

**Day 10:**
- About page
- Final responsive polish across all breakpoints
- Performance audit (Lighthouse)
- SEO metadata (og:image, titles, descriptions)

### Phase 4 — Polish & Launch (Days 11–12)

**Day 11:**
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility audit (keyboard navigation, ARIA labels, color contrast)
- Performance optimization (image optimization, bundle analysis, code splitting)

**Day 12:**
- Deploy to Vercel (recommended — native Next.js support, zero config)
- Custom domain configuration
- Final review and launch

---

## 12. Performance & SEO Considerations

### Performance Targets

```
Lighthouse Performance:   90+
Lighthouse Accessibility: 95+
Largest Contentful Paint: < 2.5s
First Input Delay:        < 100ms
Cumulative Layout Shift:  < 0.1
Total Bundle Size:        < 250KB (initial JS, gzipped)
```

### Key Performance Strategies

**Code splitting:** Every section component is dynamically imported with `next/dynamic` and a lazy loading threshold so only the components near the viewport are loaded initially.

**Animation performance:** All Framer Motion animations use CSS `transform` and `opacity` properties only — these are GPU-accelerated and do not cause layout reflows. The `will-change` CSS property is added only to the `PicoFace` component.

**Font loading:** Google Fonts are loaded using `next/font/google` with `display: 'swap'` to prevent render-blocking. Font files are preloaded in the document head.

**Image optimization:** All images and illustrations use `next/image` with explicit `width` and `height` to prevent layout shift. WebP format served to supporting browsers.

**Lenis and Framer Motion:** Both are initialized client-side only (using `useEffect`) and destroyed on component unmount to prevent memory leaks.

### SEO Configuration

```javascript
// src/app/layout.js
export const metadata = {
  title: 'Project PICO - AI Desktop Companion Robot',
  description: 'Build an emotionally responsive AI companion robot that sees, hears, and reacts like a pet. Open-source, ESP32-S3 based, software-first development.',
  keywords: ['AI robot', 'ESP32', 'companion robot', 'desktop pet', 'face recognition', 'maker project'],
  openGraph: {
    title: 'Project PICO - AI Desktop Companion Robot',
    description: 'A non-verbal AI companion that communicates through expressions, sounds, and movement.',
    image: '/og-image.png', // 1200×630px image with the PICO face
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  }
}
```

### Accessibility Requirements

- All interactive elements are keyboard-navigable with visible focus rings
- Color contrast ratios meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- The rainbow colors are never used as the sole means of conveying information
- All animations respect `prefers-reduced-motion` — users who have this set will see instant transitions instead of animated ones
- The `PicoFace` component includes an `aria-label` describing the current expression state
- All images have meaningful `alt` attributes
- Documentation section renders a logical heading hierarchy

---

## Final Notes

### On the Rainbow + Cream Direction

The color strategy you've outlined is excellent and the right call for this project. A few thoughts on execution:

The cream base will make the site feel warm and distinctive compared to the vast majority of dark-mode or stark-white tech sites. It signals personality and care. The key is to keep the cream truly consistent — avoid mixing too many slightly different off-white tones, which creates visual noise.

The rainbow accents work precisely because PICO is a multi-emotional robot. The color system has inherent meaning when mapped to emotional states. The most important rule is restraint: each accent color should appear in small quantities. A single periwinkle button, a single teal highlight, a coral error badge. When used sparingly, the rainbow palette feels curated. When overused, it becomes chaotic.

The combination of large cream backgrounds with small rainbow accents will produce a visual result similar to high-quality indie app sites — fresh, human, and unmistakably crafted.

### First Component to Build

Build `PicoFace` first. It is the soul of the website. Everything else can be iterated, but if the eye animation is delightful and works perfectly, the entire site will feel right. Spend the most time getting it to feel organic and alive.

---

*Document Version: 1.0 | Project: PICO Website | Status: Ready for Implementation*
