# PICO Face System — Technical Documentation

**Document Type:** Technical Implementation Guide  
**Version:** 1.0  
**Date:** March 4, 2026  
**Status:** Active  
**Purpose:** Complete reference for PICO's animated face system across web, simulation, and firmware

---

## Overview

The PICO Face is the project's most iconic visual element — a dark rounded rectangle displaying two animated OLED-style "eyes" that convey emotional states. The face system operates across three platforms:

| Platform | Technology | Purpose |
|----------|-----------|---------|
| **Web** (`web/src/components/pico/`) | React + SVG + Framer Motion + CSS | Website showcase & interactive demo |
| **Simulation** (`simulation/src/core/`) | Python + PyGame | PC-based development & testing |
| **Firmware** (`firmware/esp32/src/core/`) | C++ + Adafruit SSD1306 | Physical 0.96" OLED display (128×64) |

---

## Emotional States — Complete Reference

PICO has **15 emotional states**, each with a unique eye expression, associated sound, and trigger condition.

### Core States (8 — Currently Implemented on Web)

| State | Eye Expression | SVG Shape | Trigger | Audio |
|-------|---------------|-----------|---------|-------|
| `IDLE` | `( o o )` — Circle + pupil | Two circles per eye: sclera + pupil | Default / No activity | Silent or breathing |
| `HAPPY` | `( ^ ^ )` — Upward arcs | Quadratic bezier arcs | Known face / Touch / Praise | `happy_chirp_01.wav` |
| `CURIOUS` | `( O o )` — Asymmetric | Left: large circle, Right: small circle | Unknown face detected | `curious_hum_01.wav` |
| `LISTENING` | `( @ @ )` — Swirl | Circle + infinity-like inner path | Wake-word detected | `listening_bing.wav` |
| `CONFUSED` | `( ? _ )` — Raised brow | Left: circle + brow line, Right: squinting ellipse | Command parse error | `error_buzz.wav` |
| `LOVED` | `( ♥ ♥ )` — Hearts | SVG heart path (pink fill) | Being petted continuously | `loved_purr_01.wav` |
| `SURPRISED` | `( O O )` — Wide open | Very large circle + tiny pupil | Picked up / Sudden event | `excited_whistle_01.wav` |
| `SLEEPY` | `( - - )` — Half-closed | Horizontal ellipse | Long idle period (45–90s) | `sleepy_yawn_01.wav` |

### Extended States (7 — To Be Implemented)

| State | Eye Expression | SVG Shape | Trigger | Audio |
|-------|---------------|-----------|---------|-------|
| `THINKING` | `( · · )` — Pulsing dots | Small circle with CSS pulse animation | Processing voice query | `thinking_hum.wav` |
| `ERROR` | `( ! ! )` — Alert | Vertical line + dot (exclamation mark) | System error | `error_buzz.wav` |
| `LOW_BATTERY` | `( _ _ )` — Droopy | Small low ellipse, reduced opacity | Battery < 15% | `sleepy_yawn_01.wav` |
| `OBEDIENT` | `( ‿ ‿ )` — Soft arcs | Gentler upward arc than happy | Command understood | `acknowledgment_chirp.wav` |
| `DIZZY` | `( @ @ )` — Spiral | Concentric circle + spiral path, CSS wobble | Shaken (accelerometer) | `error_buzz.wav` |
| `ANGRY` | `( > < )` — Sharp squint | Angular V-shaped path | Shaken aggressively | `error_buzz.wav` |
| `BOOTING` | `( ── ── )` — Lines | Horizontal line at low opacity | Power on / Page load | `startup_beep.wav` |

---

## Animation System Architecture

The face animation is composed of **5 independent layers** that combine to create lifelike behavior:

```
┌─────────────────────────────────────────────────────┐
│  Layer 5: Expression Shapes (SVG paths)             │  ← EyeExpression.js
├─────────────────────────────────────────────────────┤
│  Layer 4: Continuous Animations (CSS @keyframes)    │  ← globals.css
│           thinking-pulse, listening-swirl, dizzy    │
├─────────────────────────────────────────────────────┤
│  Layer 3: Blink System (CSS scaleY transform)       │  ← PicoFace.js
│           scaleY(0.08) ↔ scaleY(1), 80ms duration   │
├─────────────────────────────────────────────────────┤
│  Layer 2: Pupil Movement (Framer Motion spring)     │  ← PicoFace.js
│           Mouse-tracking or random drift ±8px       │
├─────────────────────────────────────────────────────┤
│  Layer 1: Brightness/Opacity (CSS opacity)          │  ← PicoFace.js
│           Boot-up fade-in, low-battery dimming       │
└─────────────────────────────────────────────────────┘
```

### Boot-Up Sequence (on page load)

| Time | Action | What Happens |
|------|--------|-------------|
| 0ms | Start | Both eyes show `booting` shape at 30% brightness |
| 300ms | Left eye on | Left eye brightness → 100% |
| 500ms | Right eye on | Right eye brightness → 100% |
| 800ms | Blink | Eyes close (scaleY → 0.08) |
| 880ms | Blink open | Eyes open (scaleY → 1) |
| 1000ms | Idle | Expression changes to `idle`, boot complete |

### Idle Behaviors

When `autoAnimate` is enabled, three idle behaviors run concurrently:

| Behavior | Interval | Duration | Description |
|----------|----------|----------|-------------|
| **Random Blink** | 3–6s (randomized) | 80ms close | Natural blink |
| **Look Left/Right** | 15–30s (randomized) | 200ms move + 300ms hold | Curious sweep |
| **Sleepy Drift** | 45–90s (randomized) | 1000ms | Briefly shows sleepy expression |

### Expression Transitions (Half-Blink)

All expression changes use a **half-blink** pattern:

```
0ms         100ms         200ms
│            │             │
▼            ▼             ▼
[Eyes Open]  [Eyes Closed]  [Eyes Open]
[Old Shape]  [Swap Shape]  [New Shape]
```

This mimics natural facial expression changes and hides the instant shape swap.

### Mouse Tracking

When `interactive` is `true`, pupils follow the cursor:

- Maximum displacement: ±8 pixels
- Interpolation: Framer Motion spring (stiffness: 100, damping: 30)
- Tracking range: 600px from face center → normalized to ±8px

---

## Web Component API

### `<PicoFace />` — Main Component

```jsx
<PicoFace
    expression="idle"    // See emotional states table
    size="md"            // 'sm' | 'md' | 'lg' | 'xl'
    interactive={false}  // Enable mouse-tracking pupils
    autoAnimate={false}  // Enable idle behaviors (blink, look, sleepy)
/>
```

**Size Presets:**

| Size | Width | Height | Gap | Radius |
|------|-------|--------|-----|--------|
| `sm` | 80px | 48px | 8px | 12px |
| `md` | 160px | 96px | 16px | 16px |
| `lg` | 280px | 168px | 24px | 20px |
| `xl` | 400px | 240px | 32px | 24px |

### `<EyeExpression />` — Sub-Component

```jsx
<EyeExpression
    shape="idle"           // One of the 16 shape keys
    pupilOffset={{ x: 0, y: 0 }}  // Pixel offset for pupil
    isBlinking={false}     // Whether eye is in blink state
    brightness={1}         // 0–1 opacity multiplier
/>
```

---

## Where Components Live

### Web (React)

```
web/src/
├── components/pico/
│   ├── PicoFace.js         ← Main face orchestrator
│   ├── EyeExpression.js    ← SVG eye shape renderer
│   └── expressions.js      ← Shared expression config (planned)
├── app/globals.css          ← CSS @keyframes for continuous animations
└── lib/motion.js            ← Shared Framer Motion variants
```

### Simulation (Python)

```
simulation/src/core/
├── __init__.py
├── emotion_engine.py        ← State machine with transitions
├── face_renderer.py         ← Console ASCII face renderer
├── face_gui.py              ← PyGame OLED simulator (optional)
└── robot_core.py            ← Main robot orchestrator
```

### Firmware (C++ — Future Phase 2)

```
firmware/esp32/src/core/
├── face_display.h           ← Face rendering interface
├── face_display.cpp         ← SSD1306 OLED drawing functions
├── emotion_engine.h         ← State machine (ported from Python)
└── emotion_engine.cpp       ← Transition logic
```

---

## Usage Examples

### Hero Section (Full Animation)

```jsx
<PicoFace size="xl" interactive={true} autoAnimate={true} />
```
- Runs boot-up sequence on page load
- Pupils track mouse cursor
- Random blinking, looking, and sleepy drifts
- Expression defaults to `idle`

### Interactive Demo (PersonalitySection)

```jsx
const [expression, setExpression] = useState('idle');

<PicoFace size="lg" expression={expression} interactive={true} autoAnimate={false} />

<button onClick={() => setExpression('happy')}>HAPPY</button>
<button onClick={() => setExpression('curious')}>CURIOUS</button>
```
- Expression controlled externally via button clicks
- Transitions use half-blink pattern automatically
- Mouse tracking active, idle behaviors disabled

### Auto-Cycling Carousel (WhatIsPicoSection)

```jsx
const [index, setIndex] = useState(0);
useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % 8), 3000);
    return () => clearInterval(interval);
}, []);

<PicoFace size="lg" expression={EXPRESSIONS[index]} autoAnimate={false} />
```
- Expression cycles every 3 seconds
- Wrapped in `AnimatePresence` for crossfade transitions

---

## State Machine Diagram

```
                    ┌──────────┐
                    │ BOOTING  │
                    └────┬─────┘
                         │ boot_complete (1s)
                    ┌────▼─────┐
              ┌─────│   IDLE   │─────┐──────────────┐
              │     └────┬─────┘     │              │
    known_face│  unknown │ wake_word │  idle_timeout │  picked_up
              │     face │           │              │
         ┌────▼──┐ ┌────▼───┐ ┌────▼─────┐  ┌────▼───┐ ┌─────▼────┐
         │ HAPPY │ │CURIOUS │ │LISTENING │  │ SLEEPY │ │SURPRISED │
         └───────┘ └────────┘ └────┬─────┘  └────────┘ └──────────┘
                                   │ speech_received
                              ┌────▼─────┐
                              │ THINKING │
                              └──┬───┬───┘
                    success ─────┘   └───── error
                              │           │
                         ┌────▼──┐  ┌────▼────┐
                         │ HAPPY │  │CONFUSED │
                         └───────┘  └─────────┘
```

All states auto-return to `IDLE` after a configurable timeout unless another trigger occurs.

---

## Related Documentation

- **[Features.md](Features.md)** — Complete feature specifications incl. Personality Engine reactions [P-1] through [P-15]
- **[Development_Plan.md](Development_Plan.md)** — Emotion Engine code architecture and state machine implementation
- **[PICO_Website_Blueprint.md](PICO_Website_Blueprint.md)** — Section 7 (Component Library) and Section 8 (Animation Strategy)
- **[Sound_Bank_Guide.md](Sound_Bank_Guide.md)** — Audio files that pair with each emotional state
- **[Technology_Stack.md](Technology_Stack.md)** — Cloud AI integration for triggering emotional states

---

*Last Updated: March 4, 2026 | Version: 1.0 | Status: Active*
