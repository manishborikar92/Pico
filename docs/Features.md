# Complete Features

This document outlines the complete feature set for the robot, organized by functional category.

---

## 1. 🤖 Core Software & System

* **[S-1] Boot-up Sequence:** On power-on, the robot displays a boot-up animation on the OLED "eyes" and plays an optional startup chime.
* **[S-2] Wi-Fi Manager:** The robot can be configured to connect to a local Wi-Fi network with automatic reconnection if the connection is lost.
* **[S-3] State Machine:** A central software component (the "Emotion Engine") manages the robot's current state (e.g., `IDLE`, `LISTENING`, `THINKING`, `RESPONDING`, `HAPPY`).
* **[S-4] OTA Updates:** Over-the-Air updates enable software updates for the ESP32-S3 over Wi-Fi without requiring a USB connection.

---

## 2. 🗣️ AI & Voice Interaction

* **[AI-1] Wake-Word Detection:** The robot continuously listens on-device for a specific wake-word (e.g., "Pico"). This is the only audio processing performed while idle.
* **[AI-2] Speech-to-Text (STT):** Upon detecting the wake-word, the robot records audio, sends it to a free-tier STT service, and converts the speech to text.
* **[AI-3] Intent Recognition:** The software parses the text to understand user commands, differentiating between:
    * **Q&A / Chat:** (e.g., "What's 5×4?", "Who is...")
    * **Internal Command:** (e.g., "Sing a song", "Parrot me")
    * **IoT Command:** (e.g., "Turn on the light")
    * **Mode Change:** (e.g., "Connect to ChatGPT")
* **[AI-4] Cloud AI Integration:** Ability to enter "ChatGPT Mode" where all subsequent voice queries are sent to a free-tier generative AI API (e.g., Google Gemini).
* **[AI-5] Sound Bank Playback:** The robot plays pre-recorded sound effects (.wav files) to express emotions and reactions. **No TTS** - Pico is non-verbal and communicates like a pet through chirps, purrs, and whistles. See `docs/Sound_Bank_Guide.md` for complete sound creation guide.
* **[AI-6] IoT Smart Home Control:** The robot can send commands (e.g., MQTT, HTTP requests) to smart home platforms (e.g., Home Assistant, IFTTT) to control external devices.

---

## 3. 👁️ Vision & Recognition System

* **[V-1] Face Detection:** The robot continuously monitors its camera feed to detect human faces in its field of view.
* **[V-2] Face Recognition:** The robot can be trained to recognize specific individuals and provide personalized greetings and interactions.
* **[V-3] Voice Recognition:** The robot can learn to identify specific voices and associate them with known individuals.
* **[V-4] Personal Interaction:** When a known person is detected (by face or voice), the robot provides personalized responses and remembers previous interactions.
* **[V-5] Stranger Detection:** When an unknown face is detected, the robot enters "curious" mode and can optionally learn new faces.
* **[V-6] Privacy Mode:** The robot can be configured to disable camera and face recognition features when privacy is needed.

---

## 4. 🥰 Personality & Emotion Engine

The Emotion Engine is a state machine that links triggers to reactions, creating expressive and responsive behavior.

| Feature ID | Trigger (Input) | Visual Reaction (OLED) | Audio Reaction (Speaker) |
|:-----------|:----------------|:-----------------------|:-------------------------|
| **[P-1]**  | Power On | "Booting" animation → "Awake" | Startup chime |
| **[P-2]**  | Idle (No activity) | Eyes "breathe" slowly or blink | Silent |
| **[P-3]**  | Wake-Word Heard | "Listening" icon (e.g., swirl) | Affirmative "bing!" chirp |
| **[P-4]**  | Voice Query Received | "Thinking" icon (e.g., dots) | Short "processing" sound |
| **[P-5]**  | Command Understood | Returns to "Idle" | Plays acknowledgment sound (chirp) |
| **[P-6]**  | IoT Command Succeeded | "Happy" eyes (e.g., `^.^`) | Happy "Whoop!" sound |
| **[P-7]**  | Command Failed (Error) | "Confused" eyes (e.g., `?_?`) | Sad "womp-womp" sound |
| **[P-8]**  | **Touch Sensor** (TTP223) | "Happy" eyes (e.g., `^.^`) | "Purring" or "cooing" sound |
| **[P-9]**  | **Accelerometer** (MPU-6050) - **Picked Up** | "Surprised" or "Alert" eyes (e.g., `O.O`) | "Hello?" or "Hmm?" sound |
| **[P-10]** | **Accelerometer** (MPU-6050) - **Placed Down** | "Sleepy" eyes (e.g., `_ _`) | "Yawn" sound |
| **[P-11]** | **Accelerometer** (MPU-6050) - **Shaken** | "Dizzy" or "Angry" eyes | "Wobbly" or "Stop!" sound |
| **[P-12]** | Low Battery | "Tired" or "Low Batt" icon | "I'm tired..." audio warning |
| **[P-13]** | **Known Face Detected** | "Happy/Recognition" eyes (e.g., `^.^`) | Personalized greeting: "Hello, [Name]!" |
| **[P-14]** | **Unknown Face Detected** | "Curious" eyes (e.g., `o.O`) | Curious sound: "Hello there!" |
| **[P-15]** | **No Face Visible** | Returns to "Idle" state | Silent or soft ambient sounds |

---

## 5. ⚙️ Physical Hardware Features

* **[H-1] Enclosure:** A 3D-printable desktop design that houses all components:
    * Contains the ESP32-S3-EYE (with integrated camera and microphone), battery, sensors, speaker, OLED screen, and servos.
    * Designed to sit on a desk with a stable base.
* **[H-2] Head Movement System:** 2-axis servo mechanism allows the head to pan (left/right) and tilt (up/down) for expressive movements.
* **[H-3] Desktop Design:** Stationary robot designed to sit on your desk, not wearable or portable.
* **[H-4] Charging System:** A TP4056 module charges the LiPo battery via USB-C connection.
* **[H-5] Touch Sensor:** A TTP223 capacitive touch sensor integrated into the enclosure (e.g., on the "forehead") for petting interactions.
* **[H-6] Camera System:** A 2MP camera integrated into the ESP32-S3-EYE board provides face detection and recognition capabilities.
* **[H-7] Head Movement:** 2x SG90 micro servos provide 2-axis head movement (Pan left/right, Tilt up/down) for expressive body language.

---

## 6. 🖥️ Development Features

* **[D-1] PC Simulation:** Complete robot personality and AI can be developed and tested on a PC using Python before hardware implementation.
* **[D-2] Hardware Abstraction:** The software architecture allows easy porting from Python simulation to C++ hardware implementation.
* **[D-3] Modular AI Training:** Face recognition and voice recognition models can be trained and tested independently on PC before deployment.
* **[D-4] Cross-Platform Development:** Development tools work on Windows, macOS, and Linux for maximum accessibility.

---

## 7. 🔧 Technical Specifications

### 7.1 Performance Specifications

* **[T-1] Response Time:** <2 seconds for voice query processing (cloud-dependent)
* **[T-2] Face Detection Speed:** <500ms detection latency in good lighting conditions
* **[T-3] Face Recognition Accuracy:** >95% for trained individuals under normal conditions
* **[T-4] Wake Word Detection:** <100ms latency, <1% false positive rate
* **[T-5] Battery Life:** 6–8 hours continuous operation, 24+ hours standby
* **[T-6] Boot Time:** <5 seconds from power-on to operational state

### 7.2 Hardware Specifications

* **[H-7] Processing Power:** ESP32-S3 dual-core @ 240MHz with AI acceleration
* **[H-8] Memory:** 512KB SRAM + 8MB PSRAM + 16MB Flash storage
* **[H-9] Camera:** 2MP OV2640 with JPEG compression and face detection optimization
* **[H-10] Audio:** Digital I2S microphone with noise cancellation + I2S amplifier
* **[H-11] Display:** 0.96" OLED, 128×64 pixels for expressive animations
* **[H-12] Connectivity:** Wi-Fi 802.11 b/g/n + Bluetooth 5.0 LE
* **[H-13] Power:** 3.7V 1000mAh LiPo with USB-C fast charging

### 7.3 Software Architecture

* **[S-5] Real-time OS:** FreeRTOS for multitasking and real-time response
* **[S-6] AI Framework:** ESP-WHO for computer vision, ESP-SR for speech recognition
* **[S-7] Communication:** HTTP/HTTPS for cloud APIs, WebSocket for real-time data
* **[S-8] Security:** WPA2/WPA3 Wi-Fi encryption, API key protection
* **[S-9] Memory Management:** Dynamic allocation with garbage collection
* **[S-10] Error Handling:** Comprehensive exception handling with recovery mechanisms

---

## 8. 🌐 Cloud Integration Specifications

### 8.1 API Integration Details

* **[C-1] Google Speech-to-Text:** 16kHz audio with multiple language support
* **[C-2] Google Gemini API:** 1M token context with multimodal input support
* **[C-3] Sound Bank System:** Pre-recorded .wav files for pet-like communication (no TTS)
* **[C-4] Fallback Systems:** Offline processing when cloud services are unavailable
* **[C-5] Rate Limiting:** Intelligent request throttling to stay within free tiers
* **[C-6] Caching:** Local caching of frequent responses for faster interaction

### 8.2 Privacy & Security Features

* **[P-16] Local Processing:** Face recognition can run entirely on-device
* **[P-17] Data Encryption:** All cloud communications use TLS encryption
* **[P-18] Privacy Mode:** Disable camera and microphone recording when requested
* **[P-19] Data Retention:** No permanent storage of audio or video data
* **[P-20] User Control:** Complete control over what data is shared with cloud services

---

## 9. 🎯 Advanced AI Capabilities

### 9.1 Machine Learning Features

* **[ML-1] Adaptive Learning:** Personality adjusts based on user interaction patterns
* **[ML-2] Context Memory:** Remembers conversation context within sessions
* **[ML-3] Emotion Recognition:** Detects user emotions from voice tone and facial expressions
* **[ML-4] Behavioral Prediction:** Anticipates user needs based on patterns
* **[ML-5] Multi-User Support:** Recognizes and adapts to different family members
* **[ML-6] Continuous Improvement:** Model updates through over-the-air updates

### 9.2 Natural Language Understanding

* **[NL-1] Intent Classification:** Accurately categorizes user requests and commands
* **[NL-2] Entity Extraction:** Identifies important information from speech (names, numbers, etc.)
* **[NL-3] Context Awareness:** Maintains conversation context across multiple exchanges
* **[NL-4] Sentiment Analysis:** Understands emotional tone of user communications
* **[NL-5] Multi-Language Support:** Expandable to support regional languages
* **[NL-6] Conversational Flow:** Natural back-and-forth dialogue capabilities

---

## 10. 🔌 IoT & Smart Home Integration

### 10.1 Supported Protocols

* **[IoT-1] MQTT:** Lightweight messaging for IoT device communication
* **[IoT-2] HTTP/REST:** Standard web API integration
* **[IoT-3] WebSocket:** Real-time bidirectional communication
* **[IoT-4] Bluetooth LE:** Direct connection to nearby smart devices
* **[IoT-5] IR Blaster:** Control traditional appliances (optional hardware add-on)

### 10.2 Platform Compatibility

* **[IoT-6] Home Assistant:** Full integration with open-source home automation
* **[IoT-7] Google Home:** Compatible with Google Assistant ecosystem
* **[IoT-8] Amazon Alexa:** Integration through IFTTT or direct API
* **[IoT-9] Apple HomeKit:** Bridge compatibility for iOS users
* **[IoT-10] Custom APIs:** Support for proprietary smart home systems

---

## 11. 📱 Mobile App Integration (Future Enhancement)

### 11.1 Companion App Features

* **[M-1] Remote Control:** Control robot functions from smartphone
* **[M-2] Status Monitoring:** Real-time status and health monitoring
* **[M-3] Configuration:** Easy setup and customization interface
* **[M-4] Training Interface:** Simplified face and voice training process
* **[M-5] Analytics:** Usage statistics and interaction history
* **[M-6] Updates:** Over-the-air firmware and model updates

### 11.2 Cross-Platform Support

* **[M-7] iOS App:** Native iOS application with full feature support
* **[M-8] Android App:** Native Android application with full feature support
* **[M-9] Web Interface:** Browser-based control panel for any device
* **[M-10] API Access:** RESTful API for third-party integrations