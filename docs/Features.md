Here is the second document. This list is comprehensive and will be the "master list" of requirements for your software.

You can copy and paste everything below into your local file (e.g., `Features.md`).

---

# Document 2: Complete Features

This document outlines the complete feature set for the robot, broken down by functional category.

### 1. 🤖 Core Software & System
* **[S-1] Boot-up Sequence:** On power-on, the robot plays a boot-up animation on the OLED "eyes" and an optional startup chime.
* **[S-2] Wi-Fi Manager:** The robot can be configured to connect to a local Wi-Fi network. It should attempt to auto-reconnect if the connection is lost.
* **[S-3] State Machine:** A central software component (the "Emotion Engine") that manages the robot's current state (e.g., `IDLE`, `LISTENING`, `THINKING`, `RESPONDING`, `HAPPY`).
* **[S-4] OTA Updates:** (Over-the-Air) The ability to update the ESP32-S3's software over Wi-Fi without needing a USB connection.

### 2. 🗣️ AI & Voice Interaction
* **[AI-1] Wake-Word Detection:** The robot continuously listens (on-device) for a specific wake-word (e.g., "Aibi"). This is the only audio processing done while idle.
* **[AI-2] Speech-to-Text (STT):** Upon hearing the wake-word, the robot records audio, sends it to a free-tier STT service, and converts the speech to text.
* **[AI-3] Intent Recognition:** The software parses the text to understand the user's command. It must differentiate between:
    * **Q&A / Chat:** (e.g., "What's 5x4?", "Who is...")
    * **Internal Command:** (e.g., "Sing a song", "Parrot me")
    * **IoT Command:** (e.g., "Turn on the light")
    * **Mode Change:** (e.g., "Connect to ChatGPT")
* **[AI-4] Cloud AI Integration:** Ability to enter a "ChatGPT Mode" where all subsequent voice queries are sent to a free-tier generative AI API (like Google Gemini).
* **[AI-5] Text-to-Speech (TTS):** The robot sends text answers (from the AI or internal commands) to a free-tier TTS service to generate audio, which is then played through the speaker.
* **[AI-6] IoT Smart Home Control:** The robot can send commands (e.g., MQTT, HTTP requests) to smart home platforms (like Home Assistant, IFTTT, or others) to control external devices.

### 3. 🥰 Personality & Emotion Engine
This is the "state machine" that links triggers to reactions.

| Feature ID | Trigger (Input) | Visual Reaction (OLED) | Audio Reaction (Speaker) |
| :--- | :--- | :--- | :--- |
| **[P-1]** | Power On | "Booting" animation -> "Awake" | Startup chime |
| **[P-2]** | Idle (No activity) | Eyes "breathe" slowly or blink | Silent |
| **[P-3]** | Wake-Word Heard | "Listening" icon (e.g., swirl) | Affirmative "bing!" chirp |
| **[P-4]** | Voice Query Received | "Thinking" icon (e.g., dots) | Short "processing" sound |
| **[P-5]** | Q&A Answer Ready | Returns to "Idle" | Speaks the TTS audio |
| **[P-6]** | IoT Command Succeeded | "Happy" eyes (e.g., `^.^`) | Happy "Whoop!" sound |
| **[P-7]** | Command Failed (Error) | "Confused" eyes (e.g., `?_?`) | Sad "womp-womp" sound |
| **[P-8]** | **Touch Sensor** (TTP223) | "Happy" eyes (e.g., `^.^`) | "Purring" or "cooing" sound |
| **[P-9]** | **Accelerometer** (MPU-6050) - **Picked Up** | "Surprised" or "Alert" eyes (e.g., `O.O`) | "Hello?" or "Hmm?" sound |
| **[P-10]**| **Accelerometer** (MPU-6050) - **Placed Down**| "Sleepy" eyes (e.g., `_ _`) | "Yawn" sound |
| **[P-11]**| **Accelerometer** (MPU-6050) - **Shaken** | "Dizzy" or "Angry" eyes | "Wobbly" or "Stop!" sound |
| **[P-12]**| Low Battery | "Tired" or "Low Batt" icon | "I'm tired..." audio warning |

### 4. ⚙️ Physical Hardware Features
* **[H-1] Enclosure:** A 3D-printable, two-part modular design:
    * **Head:** Contains the ESP32, battery, sensors, mic, speaker, and screen.
    * **Base:** Contains the charging circuit and (optional) a larger magnet.
* **[H-2] Magnetic Attachment:** Neodymium magnets in the Head and Base allow them to snap together securely.
* **[H-3] Wearable Design:** The Head's magnet is strong enough to attach to a shirt/pocket using a secondary magnetic clip, or to a metal surface (like a fridge).
* **[H-4] Charging System:** A TP4056 module in the Base charges the LiPo battery in the Head, ideally via pogo pins or magnetic contacts.
* **[H-5] Touch Sensor:** A TTP223 capacitive touch sensor integrated into the Head's enclosure (e.g., on the "forehead") for "petting."

---

We can now proceed to the next document, which is the crucial hardware "blueprint."

Would you like me to generate **Document 3: Hardware Bill of Materials & System Diagram**?