# Document 4: Free-Tier Technology Stack & API Analysis

This document outlines the software stack for the robot's three core AI functions: **Speech-to-Text (STT)**, **Natural Language Processing (NLP)**, and **Text-to-Speech (TTS)**. The primary goal is to use free or generous free-tier services.

We will define two "stacks":
* **The Online Stack (Recommended):** Uses cloud APIs. It is *vastly* more powerful, more accurate, and easier to implement, with generous free tiers that should be sufficient for prototyping.
* **The Offline Stack (Advanced):** Uses on-device models. It is 100% free forever and works without Wi-Fi, but it is much less powerful and significantly more difficult to implement.

### 1. Recommended "Online" Stack (Wi-Fi Required)

This stack provides the "ChatGPT-like" experience you saw in the videos.

| Task | Service | Recommendation & Free Tier Analysis |
| :--- | :--- | :--- |
| **STT** (Ears) | **Google Speech-to-Text** | **Recommended.** The free tier includes **60 minutes of audio per month**. This is more than enough for development and moderate personal use. |
| **NLP** (Brain)| **Google Gemini API** | **This is the clear winner.** The free tier for personal accounts is **60 requests per minute and 1,000 requests per day**. This is incredibly generous and more than we need. It will provide the "intelligence" for all Q&A. |
| **TTS** (Voice) | **Google Gemini API (Native)** | **This is our most efficient option.** The Gemini API can return its answer as text *and* as audio. This means we make **one API call** to get both the "thought" and the "voice," saving time and complexity. |

**Online Stack Workflow:**
1.  **User:** "Aibi, what's 5 multiply by 4?"
2.  **STT (Google):** `[Audio Stream]` -> `"What's 5 multiply by 4"` (Uses ~5 seconds of our 60-min/month quota).
3.  **NLP/TTS (Gemini):** `"What's 5 multiply by 4"` -> **(One API Call)** -> Returns:
    * `Text:` "5 multiplied by 4 is 20" (to check for IoT commands)
    * `Audio:` `response_audio.mp3` (which we play directly on the speaker)
    * (Uses 1 of our 1,000 requests/day quota).

---

### 2. "Offline" Stack (No Wi-Fi Required)

This stack is for advanced users. It will *not* be able to answer "What is 5x4?" but it can understand "Turn on the light" locally.

| Task | Service | Recommendation & Analysis |
| :--- | :--- | :--- |
| **STT** (Ears) | **Vosk** or **ESP-SR** | **ESP-SR (Espressif Speech Recognition)** is the best choice. It's a library from the chip maker (Espressif) designed for the ESP32-S3. It can be trained to recognize a small set of commands (e.g., "turn on," "turn off," "light," "blue") 100% on the device. |
| **NLP** (Brain)| **Hard-Coded `if/else`** | There is no "AI" in this stack. Your code must manually parse the text from ESP-SR. **Example:** `if (text == "turn on" && text.contains("light")) { ... }` |
| **TTS** (Voice) | **PicoTTS** | **This is the best offline option.** There is a GitHub project that ports PicoTTS directly to the ESP32-S3. It uses ~1.1MB of RAM (which is why we need the PSRAM model). It will sound very robotic, but it's 100% free and offline. |

**Offline Stack Workflow:**
1.  **User:** "Aibi, turn on the light."
2.  **STT (ESP-SR):** `[Audio Stream]` -> `"turn on light"` (Recognized from its limited vocabulary).
3.  **NLP (Your Code):** `if (text == "turn on light") { ... }` -> Triggers the IoT function.
4.  **TTS (PicoTTS):** Your code calls `pico.say("Okay")` -> Generates robotic "Okay" audio and plays it.

---

### 3. Summary & Final Recommendation

**Start with the "Online" Stack.**

It's the only way to achieve the "ChatGPT-like" functionality from the video. The Google Gemini API's free tier is perfectly suited for this project.

You can implement the "Offline" stack's **ESP-SR** for *only* the **Wake-Word** and *only* for a few key commands like "turn on the light." This gives you a powerful hybrid:

* **Offline:** Wake-word ("Aibi") and "turn on light" work instantly, with no Wi-Fi.
* **Online:** For any other command ("what's the weather?"), it connects to the Google APIs.