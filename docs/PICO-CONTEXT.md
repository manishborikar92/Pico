# Project Pico - Technical Context & Architecture

---

## 1. Project Overview

**Project Name:** Pico  
**Type:** AI Desktop Pet / Companion Robot  
**Core Concept:** Pico is a non-verbal, emotionally responsive desktop robot. Unlike smart speakers, it behaves like a living creature (e.g., a pet or Pokémon). It does not speak human languages; instead, it communicates through expressive sounds (chirps, hums), eye animations, and head movements.

### Key Personality Traits

- **Non-Verbal:** Understands human speech but replies only with "Pico sounds" and body language.
- **Emotionally Aware:** Possesses a dynamic internal emotional state (e.g., Happy, Curious, Sleepy) affected by interactions.
- **Stationary but Active:** Sits on a desk; cannot walk, but features a 2-axis moving head (Pan/Tilt).

---

## 2. System Architecture (The "Best of the Best" Flow)

The system follows a strict **Input → Process → Decision → Output** architecture.

### Layer 1: Senses (Input)

- **Vision:** 2MP Camera (OV2640). Detects faces and motion.
- **Hearing:** Microphone. Listens for the wake word ("Pico") and voice commands.
- **Touch:** Capacitive touch sensor. Detects petting.

### Layer 2: Understanding (The Brain)

- **Local Processing:** OpenCV (PC Phase) / ESP-WHO (Hardware Phase) for fast face detection.
- **Cloud Processing:**
  - **STT:** Google Speech-to-Text converts user audio to text.
  - **LLM:** Google Gemini 1.5 Flash acts as the logic engine. It receives the *Context* (User text + Visual data + Touch status) and decides the robot's reaction.

### Layer 3: Decision (The Emotion Engine)

- **State Machine:** A dedicated logic block that maintains the robot's mood. It prevents rapid flickering between states.
- **States:** `IDLE`, `HAPPY`, `CURIOUS`, `SLEEPY`, `LISTENING`, `CONFUSED`, `OBEDIENT`, `LOVED`.

### Layer 4: Reactions (Output)

- **Visual:** OLED Screen displays animated eye shapes (e.g., `^.^`, `o.o`, `-.-`).
- **Audio:** Speaker plays `.wav` files from a local Sound Bank (chirps, purrs, whistles). **No TTS (Text-to-Speech).**
- **Movement:** 2x Servos (Pan & Tilt) move the head (e.g., Nod "Yes", Shake "No", Look Up).

---

## 3. User Interaction Flow

1. **Wake:** User enters room (Visual) or says "Pico" (Audio).
2. **Reaction:** Pico detects the trigger, switches to `HAPPY` or `LISTENING`.
   - *Output:* Eyes open `( o o )` → `( ^ . ^ )`, plays `chirp.wav`, head looks up.
3. **Command:** User says "Sit down."
4. **Processing:** Gemini interprets command → Maps to `OBEDIENT` state.
5. **Execution:** Pico lowers head, plays `whimper.wav`, eyes look down.
6. **Affection:** User pets Pico.
7. **Reaction:** Touch sensor triggers `LOVED` state → Eyes `( ♥ . ♥ )`, plays `purr.wav`.

---

## 4. Development Strategy: "Software-First"

We do not build hardware until the software brain is fully proven on a PC.

### Phase 1: PC Simulation (Current Phase)

- **Goal:** A "Virtual Pet" program on Windows 11.
- **Hardware:** Laptop Webcam, Mic, Speakers.
- **Software:** Python, OpenCV, PyGame (Audio), Google Gemini API.
- **Status:** Environment set up. Emotion Engine skeleton written.
- **Next Task:** Update Emotion Engine for "Pet Mode" (Sounds/Head) vs "Talk Mode."

### Phase 2: Hardware Porting

- **Goal:** Transfer logic to the embedded chip.
- **Hardware:** ESP32-S3-EYE board.
- **Software:** C++, Arduino IDE / PlatformIO.
- **Task:** Translate Python logic to C++.

### Phase 3: Body Construction

- **Goal:** Physical build.
- **Hardware:** 3D Printed Enclosure, 2x SG90 Servos, OLED, Battery.
- **Task:** Wiring, Soldering, 3D Printing, Servo integration.

### Phase 4: Production

- **Goal:** Polished, standalone robot.
- **Task:** Final assembly, painting, fine-tuning.

---

## 5. Technology Stack

| Component | Technology | Details |
|-----------|------------|---------|
| **Logic** | Google Gemini 1.5 Flash | Free Tier |
| **Vision** | OpenCV (PC), ESP-WHO (Hardware) | Face/motion detection |
| **Audio Input** | Google STT | Speech-to-Text |
| **Audio Output** | Pre-recorded Sound Bank | `.wav` files (No TTS) |
| **MCU** | ESP32-S3-EYE | 240MHz, WiFi/BT, 8MB PSRAM |
| **Display** | 0.96" SSD1306 OLED | Animated eyes |
| **Actuators** | SG90 Micro Servos | 2-axis head movement |

---

## 6. Current Context & Directives

### Active Phase
**Phase 1 (PC Simulation)**

### Immediate Goal
Modify the Python `EmotionEngine` to support **Sounds** (PyGame) and **Head Angles** (Print simulation) instead of text-to-speech.

### Constraint
Keep code modular so it is easy to translate to C++ later.

---

## 7. Next Steps

✅ **Completed:**
- Environment setup
- Emotion Engine skeleton created

🎯 **Current Task:**
- Update Emotion Engine for "Pet Mode" behavior
- Implement Sound Bank integration
- Add head movement simulation

📋 **Upcoming:**
- Vision system integration (Face detection)
- Audio input system (Wake word detection)
- Touch sensor simulation