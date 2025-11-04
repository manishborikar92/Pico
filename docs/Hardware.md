# Document 3: Hardware Bill of Materials & System Diagram

This document covers the complete list of physical components required for the prototype and the pin-to-pin wiring diagram.

### 1. Bill of Materials (BoM)

This is your component "shopping list." Prices are estimates from common Indian online electronics retailers (e.g., Robu.in, ElectronicsComp, Amazon.in) to stay within the **~₹3,500** budget.

| Component | Specific Module | Purpose | Est. Cost (₹) |
| :--- | :--- | :--- | :--- |
| **Processor** | **ESP32-S3 Dev Kit (N16R8)** | The "brain." Must be the S3 model with 16MB Flash and 8MB PSRAM for AI. | ₹900 - ₹1,200 |
| **Display** | **0.96" OLED (SSD1306, 4-pin I2C)** | The "eyes" of the robot. | ₹250 - ₹350 |
| **Microphone** | **INMP441 (I2S Digital)** | The "ears." A high-quality digital mic for voice commands. | ₹150 - ₹250 |
| **Amplifier** | **MAX98357 (I2S Digital)** | The "voice box." Powers the speaker from a digital signal. | ₹180 - ₹250 |
| **Speaker** | **1W 8-Ohm Mini Speaker** | The "mouth." Plays sounds and speech. | ₹50 - ₹80 |
| **Power (Batt)**| **3.7V LiPo Battery (500-1000mAh)** | The internal power source. A 503040 or 603040 size is good. | ₹350 - ₹450 |
| **Power (Charge)**| **TP4056 Module (USB-C, w/ Protection)** | The "stomach." Manages safe charging and discharging of the LiPo. | ₹70 - ₹100 |
| **Motion Sensor** | **MPU-6050 (I2C)** | The "inner ear." Detects motion, shaking, and tapping. | ₹80 - ₹120 |
| **Touch Sensor** | **TTP223 (Capacitive)** | The "skin." Detects a "pet" or a "tap" on the head. | ₹40 - ₹60 |
| **Enclosure** | **3D Printing Service** | The "skeleton." A custom 3D printed shell to house everything (PLA material). | ₹400 - ₹700 |
| **Misc.** | **Jumper Wires, Mini Breadboard, Magnets**| The "nerves." Used for prototyping and assembly. | ₹200 - ₹250 |
| | | **Total Component Cost (Estimate)** | **₹2,670 - ₹3,810** |

### 2. One-Time Tools (Required for Novices)

* **Basic Soldering Iron Kit (25W):** (₹300 - ₹400)
* **Basic Digital Multimeter:** (₹200 - ₹300)

### 3. System Diagram (Wiring Plan)

This is the master wiring plan. It defines exactly which pin on the ESP32 connects to which pin on each module. **This is the most critical document for writing your code.**

We will use two separate communication buses:
* **I2C Bus:** For sensors (OLED, MPU-6050). They share the same two wires.
* **I2S Bus:** For digital audio (Mic, Amp). They use separate pins for Input and Output.

| ESP32-S3 Pin | Connects To Component | Component Pin | Purpose |
| :--- | :--- | :--- | :--- |
| **3.3V** | (Multiple) | VCC / VDD | Power to *all* modules (OLED, Mic, Amp, MPU, TTP) |
| **GND** | (Multiple) | GND | Ground for *all* modules |
| **GPIO 8** | **OLED Display** | `SDA` | **I2C Data** |
| | **MPU-6050** | `SDA` | **I2C Data** |
| **GPIO 9** | **OLED Display** | `SCL` | **I2C Clock** |
| | **MPU-6050** | `SCL` | **I2C Clock** |
| **GPIO 4** | **TTP223 Sensor** | `SIG / IO` | **Touch Signal (Input)** |
| **GPIO 10** | **INMP441 Mic (Ears)** | `SD` (Data Out) | **I2S Mic (Data In)** |
| **GPIO 11** | **INMP441 Mic (Ears)** | `WS` (Word Select) | **I2S Mic (Word Clock)** |
| **GPIO 12** | **INMP441 Mic (Ears)** | `SCK` (Bit Clock) | **I2S Mic (Bit Clock)** |
| **GPIO 5** | **MAX98357 Amp (Voice)** | `DIN` (Data In) | **I2S Amp (Data Out)** |
| **GPIO 6** | **MAX98357 Amp (Voice)** | `LRC` (Word Select) | **I2S Amp (Word Clock)** |
| **GPIO 7** | **MAX98357 Amp (Voice)** | `BCLK` (Bit Clock) | **I2S Amp (Bit Clock)** |

*Note: The `INMP441` **L/R** pin should be connected directly to **GND**.*

### 4. Power Distribution (How to Wire the Battery)

This is wired separately from the logic pins.

1.  **Battery to Charger:**
    * LiPo Battery `B+` (Red) -> TP4056 Module `B+`
    * LiPo Battery `B-` (Black) -> TP4056 Module `B-`
2.  **Charger to ESP32 (Powering the "Brain"):**
    * TP4056 Module `OUT+` -> ESP32-S3 `VBUS` (or `5V`) pin
    * TP4056 Module `OUT-` -> ESP32-S3 `GND` pin
3.  **ESP32 to Other Modules (Powering Sensors):**
    * All your other modules (OLED, Mic, Amp, MPU, TTP) connect to the `3.3V` and `GND` pins on the ESP32 itself. The ESP32's onboard regulator will provide them with the clean 3.3V they need.

**Recommendation:** Assemble this on a **breadboard** first. Do *not* solder anything permanently until you have tested each component (like we planned in the previous step).