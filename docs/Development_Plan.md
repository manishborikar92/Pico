Here is the fifth and final document. This is your step-by-step roadmap from "hello world" to a fully functional AI pet.

This plan is built on a "bottom-up" principle: **test every single component in isolation before you try to combine them.** This will save you countless hours of debugging.

You can copy and paste everything below into your local file (e.g., `Development_Plan.md`).

---

# Document 5: Comprehensive Development Plan

### Project Philosophy
Test hardware in isolation. Write software in small, testable modules. Integrate one piece at a time.

### Development Environment Setup (Milestone 0)
* **Task 0.1:** Install **Visual Studio Code**.
* **Task 0.2:** Install the **PlatformIO (PIO)** extension from the VS Code marketplace.
* **Task 0.3:** Create a new PIO project, selecting your **ESP32-S3 Dev Kit** as the board.
* **Task 0.4:** Buy all components from the **Hardware BoM (Document 3)** and a soldering kit.
* **Task 0.5:** Solder header pins onto the ESP32-S3 and all modules (OLED, MPU, TTP, Mic, Amp).
* **Task 0.6:** Get a breadboard and jumper wires ready for prototyping.

---

### Milestone 1: "Hello, World" (Hardware Bring-Up)
*Goal: Prove that each component works individually.*

* **Task 1.1: The Brain (ESP32-S3)**
    * Connect the ESP32-S3 to your PC via USB.
    * Upload the default PlatformIO "Blink" sketch.
    * **✅ Success:** The onboard LED blinks.
* **Task 1.2: The Eyes (OLED)**
    * Wire the OLED as per **Document 3**.
    * Install the `adafruit/Adafruit_GFX` and `adafruit/Adafruit_SSD1306` libraries.
    * Run test code to print "Hello!" on the screen.
    * **✅ Success:** You see "Hello!" on the OLED.
* **Task 1.3: The Ears (INMP441 Mic)**
    * Wire the INMP441 as per **Document 3**.
    * Run the I2S test code (from our previous chat) to read audio samples.
    * **✅ Success:** You see audio data (numbers) printed to the Serial Monitor when you make noise.
* **Task 1.4: The Voice (MAX98357 Amp)**
    * Wire the MAX98357 and connect the speaker as per **Document 3**.
    * Run an I2S test sketch to play a simple sine wave or "beep" tone.
    * **✅ Success:** You hear a sound from the speaker.
* **Task 1.5: The "Inner Ear" (MPU-6050)**
    * Wire the MPU-6050 as per **Document 3**.
    * Run a test sketch to read accelerometer/gyro data.
    * **✅ Success:** You see X, Y, Z values changing in the Serial Monitor as you tilt the sensor.
* **Task 1.6: The "Skin" (TTP223)**
    * Wire the TTP223 as per **Document 3**.
    * Run a test sketch to read the digital input pin.
    * **✅ Success:** You see "Touched!" or "1" in the Serial Monitor when you touch the sensor.

---

### Milestone 2: The "Emotion Engine"
*Goal: Combine inputs and outputs to create personality.*

* **Task 2.1:** Create a "State Machine" in your code (e.g., using `enum`).
* **Task 2.2: Touch -> Reaction:** Combine **Task 1.6** and **Task 1.2**.
    * *If* the TTP223 is touched, *then* draw "Happy" eyes (`^.^`) on the OLED.
    * *Else*, draw "Idle" eyes (`-.-`).
* **Task 2.3: Motion -> Reaction:** Combine **Task 1.5** and **Task 1.2**.
    * *If* the MPU-6050 detects a "shake," *then* draw "Dizzy" eyes (`x.x`) on the OLED.
* **Task 2.4: Add Sound:** Combine **Task 2.2** and **Task 1.4**.
    * *If* the TTP223 is touched, *then* draw "Happy" eyes *and* play a "purr" sound (a pre-recorded audio file).
    * **✅ Success:** The robot "reacts" to touch and motion with both visuals and sound.

---

### Milestone 3: AI Brain (Cloud Integration)
*Goal: Get the AI, STT, and TTS services working.*

* **Task 3.1: Wi-Fi:** Write code to connect the ESP32-S3 to your Wi-Fi.
* **Task 3.2: STT (Speech-to-Text):**
    * Record 5 seconds of audio from the **INMP441** mic.
    * Send this audio data to the **Google Speech-to-Text API** (as per **Document 4**).
    * **✅ Success:** The API returns the correct text transcription in the Serial Monitor.
* **Task 3.3: NLP (AI Brain):**
    * Take the text from **Task 3.2**.
    * Send this text to the **Google Gemini API** (as per **Document 4**).
    * **✅ Success:** The Gemini API returns a text answer in the Serial Monitor.
* **Task 3.4: TTS (Voice):**
    * Take the text answer from **Task 3.3**.
    * Make an API call (to Gemini or another TTS service) to get an MP3 audio stream.
    * Play that MP3 audio stream *directly* to your **MAX98357** speaker.
    * **✅ Success:** The robot "speaks" the answer from the AI.

---

### Milestone 4: Final Integration & Assembly
*Goal: Combine all milestones into the final product.*

* **Task 4.1: Wake-Word:**
    * Integrate the **ESP-SR** library.
    * Set it to *only* listen for the wake-word ("Aibi").
    * **✅ Success:** The robot ignores all speech *until* it hears the wake-word, at which point it triggers **Task 3.2**.
* **Task 4.2: Full Logic Loop:** Combine all code:
    1.  **Loop:** `Emotion Engine` (Milestone 2) runs, checking for touch/motion.
    2.  **Interrupt:** `Wake-Word` (Task 4.1) is detected.
    3.  **State Change:** `LISTENING`. Draw "Listening" eyes.
    4.  **Action:** Run the `AI Brain` (Milestone 3) functions.
    5.  **State Change:** `IDLE`. Return to step 1.
* **Task 4.3: IoT Control:**
    * Add an `if` statement to your NLP logic (Task 3.3).
    * *If* the text contains "turn on the light," *then* send an MQTT or HTTP command (instead of sending to Gemini).
* **Task 4.4: 3D Printing & Assembly:**
    * Design the 3D model for the "Head" and "Base."
    * Print the parts.
    * Move all components from the breadboard into the final 3D printed enclosure, soldering them permanently.
    * **✅ Success:** You have a fully functional, self-contained AI companion robot.

---

We have now generated all 5 documents you requested. You have a complete project plan, feature list, hardware blueprint, technology stack, and development roadmap.

Would you like to get started with **Milestone 1**? We can begin with the test code for the **OLED screen (Task 1.2)**.