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

### 3. 👁️ Vision & Recognition System
* **[V-1] Face Detection:** The robot continuously monitors its camera feed to detect human faces in its field of view.
* **[V-2] Face Recognition:** The robot can be trained to recognize specific individuals and provide personalized greetings and interactions.
* **[V-3] Voice Recognition:** The robot can learn to identify specific voices and associate them with known individuals.
* **[V-4] Personal Interaction:** When a known person is detected (by face or voice), the robot provides personalized responses and remembers previous interactions.
* **[V-5] Stranger Detection:** When an unknown face is detected, the robot enters a "curious" mode and can optionally learn new faces.
* **[V-6] Privacy Mode:** The robot can be configured to disable camera/face recognition for privacy when needed.

### 4. 🥰 Personality & Emotion Engine
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
| **[P-13]**| **Known Face Detected** | "Happy/Recognition" eyes (e.g., `^.^`) | Personalized greeting: "Hello, [Name]!" |
| **[P-14]**| **Unknown Face Detected** | "Curious" eyes (e.g., `o.O`) | Curious sound: "Hello there!" |
| **[P-15]**| **No Face Visible** | Returns to "Idle" state | Silent or soft ambient sounds |

### 5. ⚙️ Physical Hardware Features
* **[H-1] Enclosure:** A 3D-printable, two-part modular design:
    * **Head:** Contains the ESP32-S3-EYE (with integrated camera and mic), battery, sensors, speaker, and screen.
    * **Base:** Contains the charging circuit and (optional) a larger magnet.
* **[H-2] Magnetic Attachment:** Neodymium magnets in the Head and Base allow them to snap together securely.
* **[H-3] Wearable Design:** The Head's magnet is strong enough to attach to a shirt/pocket using a secondary magnetic clip, or to a metal surface (like a fridge).
* **[H-4] Charging System:** A TP4056 module in the Base charges the LiPo battery in the Head, ideally via pogo pins or magnetic contacts.
* **[H-5] Touch Sensor:** A TTP223 capacitive touch sensor integrated into the Head's enclosure (e.g., on the "forehead") for "petting."
* **[H-6] Camera System:** A 2MP camera integrated into the ESP32-S3-EYE board for face detection and recognition capabilities.

### 6. 🖥️ Development Features
* **[D-1] PC Simulation:** Complete robot personality and AI can be developed and tested on a PC using Python before hardware implementation.
* **[D-2] Hardware Abstraction:** The software architecture allows easy porting from Python simulation to C++ hardware implementation.
* **[D-3] Modular AI Training:** Face recognition and voice recognition models can be trained and tested independently on PC before deployment.
* **[D-4] Cross-Platform Development:** Development tools work on Windows, Mac, and Linux for accessibility.

### 7. 🔧 Technical Specifications

#### 7.1 Performance Specifications
* **[T-1] Response Time:** <2 seconds for voice query processing (cloud-dependent)
* **[T-2] Face Detection Speed:** <500ms detection latency in good lighting
* **[T-3] Face Recognition Accuracy:** >95% for trained individuals in normal conditions
* **[T-4] Wake Word Detection:** <100ms latency, <1% false positive rate
* **[T-5] Battery Life:** 6-8 hours continuous operation, 24+ hours standby
* **[T-6] Boot Time:** <5 seconds from power-on to operational state

#### 7.2 Hardware Specifications
* **[H-7] Processing Power:** ESP32-S3 dual-core @ 240MHz with AI acceleration
* **[H-8] Memory:** 512KB SRAM + 8MB PSRAM + 16MB Flash storage
* **[H-9] Camera:** 2MP OV2640 with JPEG compression and face detection optimization
* **[H-10] Audio:** Digital I2S microphone with noise cancellation + I2S amplifier
* **[H-11] Display:** 0.96" OLED 128x64 pixels for expressive animations
* **[H-12] Connectivity:** Wi-Fi 802.11 b/g/n + Bluetooth 5.0 LE
* **[H-13] Power:** 3.7V 1000mAh LiPo with USB-C fast charging

#### 7.3 Software Architecture
* **[S-5] Real-time OS:** FreeRTOS for multitasking and real-time response
* **[S-6] AI Framework:** ESP-WHO for computer vision, ESP-SR for speech recognition
* **[S-7] Communication:** HTTP/HTTPS for cloud APIs, WebSocket for real-time data
* **[S-8] Security:** WPA2/WPA3 Wi-Fi encryption, API key protection
* **[S-9] Memory Management:** Dynamic allocation with garbage collection
* **[S-10] Error Handling:** Comprehensive exception handling with recovery mechanisms

### 8. 🌐 Cloud Integration Specifications

#### 8.1 API Integration Details
* **[C-1] Google Speech-to-Text:** 16kHz audio, multiple language support
* **[C-2] Google Gemini API:** 1M token context, multimodal input support
* **[C-3] Google Text-to-Speech:** Neural voices with SSML markup support
* **[C-4] Fallback Systems:** Offline processing when cloud unavailable
* **[C-5] Rate Limiting:** Intelligent request throttling to stay within free tiers
* **[C-6] Caching:** Local caching of frequent responses for faster interaction

#### 8.2 Privacy & Security Features
* **[P-16] Local Processing:** Face recognition can run entirely on-device
* **[P-17] Data Encryption:** All cloud communications use TLS encryption
* **[P-18] Privacy Mode:** Disable camera/microphone recording when requested
* **[P-19] Data Retention:** No permanent storage of audio/video data
* **[P-20] User Control:** Complete control over what data is shared with cloud services

### 9. 🎯 Advanced AI Capabilities

#### 9.1 Machine Learning Features
* **[ML-1] Adaptive Learning:** Personality adjusts based on user interaction patterns
* **[ML-2] Context Memory:** Remembers conversation context within sessions
* **[ML-3] Emotion Recognition:** Detects user emotions from voice tone and facial expressions
* **[ML-4] Behavioral Prediction:** Anticipates user needs based on patterns
* **[ML-5] Multi-User Support:** Recognizes and adapts to different family members
* **[ML-6] Continuous Improvement:** Model updates through over-the-air updates

#### 9.2 Natural Language Understanding
* **[NL-1] Intent Classification:** Accurately categorizes user requests and commands
* **[NL-2] Entity Extraction:** Identifies important information from speech (names, numbers, etc.)
* **[NL-3] Context Awareness:** Maintains conversation context across multiple exchanges
* **[NL-4] Sentiment Analysis:** Understands emotional tone of user communications
* **[NL-5] Multi-Language Support:** Expandable to support regional languages
* **[NL-6] Conversational Flow:** Natural back-and-forth dialogue capabilities

### 10. 🔌 IoT & Smart Home Integration

#### 10.1 Supported Protocols
* **[IoT-1] MQTT:** Lightweight messaging for IoT device communication
* **[IoT-2] HTTP/REST:** Standard web API integration
* **[IoT-3] WebSocket:** Real-time bidirectional communication
* **[IoT-4] Bluetooth LE:** Direct connection to nearby smart devices
* **[IoT-5] IR Blaster:** Control traditional appliances (optional hardware add-on)

#### 10.2 Platform Compatibility
* **[IoT-6] Home Assistant:** Full integration with open-source home automation
* **[IoT-7] Google Home:** Compatible with Google Assistant ecosystem
* **[IoT-8] Amazon Alexa:** Integration through IFTTT or direct API
* **[IoT-9] Apple HomeKit:** Bridge compatibility for iOS users
* **[IoT-10] Custom APIs:** Support for proprietary smart home systems

### 11. 📱 Mobile App Integration (Future Enhancement)

#### 11.1 Companion App Features
* **[M-1] Remote Control:** Control robot functions from smartphone
* **[M-2] Status Monitoring:** Real-time status and health monitoring
* **[M-3] Configuration:** Easy setup and customization interface
* **[M-4] Training Interface:** Simplified face and voice training process
* **[M-5] Analytics:** Usage statistics and interaction history
* **[M-6] Updates:** Over-the-air firmware and model updates

#### 11.2 Cross-Platform Support
* **[M-7] iOS App:** Native iOS application with full feature support
* **[M-8] Android App:** Native Android application with full feature support
* **[M-9] Web Interface:** Browser-based control panel for any device
* **[M-10] API Access:** RESTful API for third-party integrations