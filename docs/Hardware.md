# Hardware Bill of Materials & System Diagram

This document provides a complete list of physical components required for the prototype and detailed pin-to-pin wiring diagrams.

**⚠️ CRITICAL UPDATE:** This hardware specification is based on extensive research of the ESP32-S3-EYE platform and current Indian market pricing. The development follows a **software-first approach**—complete all AI development in Python on your PC before purchasing any hardware.

---

## 1. Detailed Hardware Specifications

### 1.1 Core Processing Unit - ESP32-S3-EYE Analysis

**Detailed ESP32-S3-EYE Specifications:**
- **Main Processor:** Dual-core Xtensa LX7 32-bit @ 240MHz
- **Co-processor:** Ultra-low-power RISC-V core for always-on operations
- **Memory Configuration:**
  - 512KB SRAM (high-speed internal memory)
  - 8MB PSRAM (external pseudo-static RAM for AI operations)
  - 16MB Flash (program storage and AI model storage)
- **Camera Module:** OV2640 2-megapixel with JPEG compression
- **Microphone:** Digital I2S MEMS microphone with noise cancellation
- **Connectivity:** Wi-Fi 802.11 b/g/n (2.4GHz) + Bluetooth 5.0 LE
- **AI Acceleration:** Hardware neural network acceleration unit
- **Power Management:** Advanced power management with multiple sleep modes

**Important Research Finding:** The ESP32-S3-EYE is specifically designed for AI vision applications and includes optimized libraries (ESP-WHO) for face detection and recognition.

### 1.2 Complete Bill of Materials (Research-Based Pricing)

**Pricing Research Methodology:** Prices verified across multiple Indian suppliers including Robu.in, ElectronicsComp, Amazon.in, and local electronics markets as of November 2024.

| Component | Specific Model/Specs | Technical Purpose | Verified Cost (₹) | Supplier Notes |
|:----------|:--------------------|:------------------|:------------------|:---------------|
| **Main Board** | **ESP32-S3-EYE Development Kit** | Core processing, AI acceleration, camera, microphone | ₹4,200–₹5,500 | Available at Robu.in, Amazon.in |
| **Display** | **0.96" OLED SSD1306 128×64 I2C** | Emotional expression display, status indicators | ₹280–₹420 | White/Blue variants available |
| **Audio Amp** | **MAX98357A I2S Class-D Amplifier** | High-quality digital audio amplification | ₹220–₹320 | Adafruit-compatible modules |
| **Speaker** | **28mm 1W 8Ω Neodymium Speaker** | Clear audio output for voice and sounds | ₹80–₹150 | Compact form factor essential |
| **Battery** | **3.7V 1000mAh LiPo (603450 size)** | 6–8 hour operation, compact design | ₹450–₹650 | JST connector preferred |
| **Charger** | **TP4056 USB-C with Protection** | Safe LiPo charging with overcurrent protection | ₹120–₹180 | Must include DW01A protection |
| **Motion** | **MPU-6050 6-DOF IMU Module** | Orientation, shake detection, gesture recognition | ₹150–₹220 | GY-521 breakout board |
| **Touch** | **TTP223 Capacitive Touch Sensor** | Human-robot physical interaction | ₹60–₹100 | Digital output, 3.3V compatible |
| **Magnets** | **N52 Neodymium 10mm × 3mm (4pcs)** | Modular attachment system | ₹200–₹300 | Strong rare-earth magnets |
| **Enclosure** | **PLA 3D Printing (200g material)** | Custom robot housing, professional finish | ₹600–₹1,200 | Local 3D printing services |
| **Electronics** | **Breadboard, Jumpers, Headers** | Prototyping and final assembly | ₹300–₹450 | Quality DuPont connectors |
| | | **TOTAL REALISTIC COST** | **₹6,660–₹9,490** | **Average: ₹8,075** |

**Critical Cost Analysis:**
- **Previous estimate of ₹5,000 was unrealistic** based on actual market research
- **ESP32-S3-EYE alone costs ₹4,200–₹5,500** in the Indian market
- **Realistic budget should be ₹8,000–₹10,000** for quality components
- **Cost can be reduced by using generic alternatives** but may impact reliability

**Note:** The ESP32-S3-EYE board replaces the separate ESP32-S3 and INMP441 microphone from the original design and adds essential camera capability. While the cost is higher, it provides significantly more functionality.

### 1.3 Alternative Component Options (Cost Optimization)

**Budget-Conscious Alternatives:**

| Original Component | Budget Alternative | Cost Savings | Trade-offs |
|:-------------------|:-------------------|:-------------|:-----------|
| ESP32-S3-EYE (₹5,500) | ESP32-CAM + ESP32-S3 (₹2,800) | ₹2,700 | More complex wiring, larger size |
| 1000mAh LiPo (₹650) | 500mAh LiPo (₹350) | ₹300 | Reduced battery life (3–4 hours) |
| Professional 3D Print (₹1,200) | DIY Cardboard/Acrylic (₹200) | ₹1,000 | Less durable, basic appearance |

**Premium Upgrade Options:**

| Component | Premium Option | Additional Cost | Benefits |
|:----------|:---------------|:----------------|:---------|
| Standard Speaker | High-fidelity 2W Speaker | +₹200 | Superior audio quality |
| Basic OLED | Color TFT Display | +₹800 | Full-color expressions |
| Standard Battery | 2000mAh High-capacity | +₹400 | 12+ hour operation |

---

## 2. Essential Development Tools

### 2.1 Hardware Tools (One-Time Investment)

| Tool | Specification | Purpose | Cost (₹) |
|:-----|:--------------|:--------|:---------|
| **Soldering Iron** | 25W adjustable temperature | Component assembly | ₹400–₹800 |
| **Solder Wire** | 0.8mm rosin core, lead-free | Electrical connections | ₹150–₹250 |
| **Digital Multimeter** | Basic DC/AC measurement | Circuit debugging | ₹300–₹600 |
| **Wire Strippers** | 22–30 AWG capacity | Cable preparation | ₹200–₹400 |
| **Precision Screwdrivers** | Phillips/flathead set | Assembly work | ₹150–₹300 |
| **Anti-static Wrist Strap** | ESD protection | Component safety | ₹100–₹200 |
| **Breadboard** | 830-point half-size | Prototyping | ₹150–₹250 |
| **Jumper Wires** | Male-male, male-female sets | Connections | ₹100–₹200 |

**Total Tool Investment:** ₹1,550–₹3,000 (one-time cost for multiple projects)

---

## 3. Detailed System Architecture & Wiring

### 3.1 ESP32-S3-EYE Pin Configuration Research

**Critical Research Finding:** The ESP32-S3-EYE uses specific pins for built-in peripherals. External component connections must avoid conflicts.

**Reserved Pins (DO NOT USE):**
- **GPIO 0–15:** Camera interface (SIOD, SIOC, VSYNC, HREF, PCLK, XCLK, D0–D7)
- **GPIO 41, 42:** I2S microphone (WS, SCK)
- **GPIO 2:** Built-in LED indicator
- **GPIO 46:** Boot mode selection

**Available Pins for External Components:**

| Pin Number | Function | Max Current | Notes |
|:-----------|:---------|:------------|:------|
| **GPIO 16** | General I/O | 40mA | Recommended for I2C SDA |
| **GPIO 17** | General I/O | 40mA | Recommended for I2C SCL |
| **GPIO 18** | General I/O | 40mA | Touch sensor input |
| **GPIO 19** | General I/O | 40mA | I2S audio output |
| **GPIO 20** | General I/O | 40mA | I2S word select |
| **GPIO 21** | General I/O | 40mA | I2S bit clock |

### 3.2 Corrected Wiring Diagram

**IMPORTANT CORRECTION:** Previous pin assignments were incorrect. Here's the research-verified wiring:

| ESP32-S3-EYE Pin | Component | Component Pin | Signal Type | Notes |
|:-----------------|:----------|:--------------|:------------|:------|
| **3.3V** | All External Modules | VCC/VDD | Power Supply | Max 500mA total |
| **GND** | All External Modules | GND | Ground Reference | Multiple connections OK |
| **GPIO 16** | OLED Display | SDA | I2C Data | 4.7kΩ pullup required |
| **GPIO 16** | MPU-6050 | SDA | I2C Data | Shared bus |
| **GPIO 17** | OLED Display | SCL | I2C Clock | 4.7kΩ pullup required |
| **GPIO 17** | MPU-6050 | SCL | I2C Clock | Shared bus |
| **GPIO 18** | TTP223 Touch | SIG | Digital Input | Active HIGH |
| **GPIO 19** | MAX98357A Amp | DIN | I2S Data | Digital audio stream |
| **GPIO 20** | MAX98357A Amp | LRC | I2S Word Select | Left/Right channel |
| **GPIO 21** | MAX98357A Amp | BCLK | I2S Bit Clock | Audio timing |

### 3.3 Communication Protocol Details

**I2C Bus Configuration:**
- **Frequency:** 100kHz (standard mode) or 400kHz (fast mode)
- **Pullup Resistors:** 4.7kΩ on both SDA and SCL lines
- **Device Addresses:**
  - OLED SSD1306: 0x3C or 0x3D (configurable)
  - MPU-6050: 0x68 or 0x69 (AD0 pin dependent)

**I2S Audio Configuration:**
- **Sample Rate:** 16kHz or 44.1kHz (configurable)
- **Bit Depth:** 16-bit or 24-bit
- **Channels:** Mono or Stereo
- **Format:** I2S standard format

### 3.4 Power Distribution Analysis

**Power Consumption Research:**

| Component | Operating Voltage | Current Draw | Power (mW) |
|:----------|:------------------|:-------------|:-----------|
| ESP32-S3-EYE (Active) | 3.3V | 200–300mA | 660–990 |
| ESP32-S3-EYE (Sleep) | 3.3V | 10–50μA | 0.033–0.165 |
| OLED Display | 3.3V | 20–30mA | 66–99 |
| MAX98357A Amp | 3.3V | 50–100mA | 165–330 |
| MPU-6050 | 3.3V | 3–5mA | 10–16.5 |
| TTP223 Touch | 3.3V | 1–2mA | 3.3–6.6 |
| **Total Active** | | **274–437mA** | **904–1,442mW** |

**Battery Life Calculation:**
- **1000mAh Battery:** 2.3–3.6 hours continuous operation
- **With Sleep Mode:** 8–12 hours typical usage (30% active time)
- **Optimization Potential:** Up to 24 hours with aggressive power management

---

## 4. Advanced Power Management System

### 4.1 Battery & Charging Circuit Design

**Detailed Power Architecture:**

```
[3.7V LiPo Battery] → [TP4056 Charger] → [ESP32-S3-EYE] → [External Components]
     1000mAh              USB-C Input        3.3V Regulator      Various Modules
```

**Critical Wiring Specifications:**

1. **Battery to TP4056 Charger:**
   - LiPo `Positive (Red)` → TP4056 `B+` terminal
   - LiPo `Negative (Black)` → TP4056 `B-` terminal
   - **Safety:** Use JST connector for secure connection

2. **TP4056 to ESP32-S3-EYE:**
   - TP4056 `OUT+` → ESP32-S3-EYE `5V` pin (NOT 3.3V)
   - TP4056 `OUT-` → ESP32-S3-EYE `GND` pin
   - **Important:** ESP32-S3-EYE has onboard 3.3V regulator

3. **Power Distribution to External Components:**
   - All external modules connect to ESP32-S3-EYE `3.3V` and `GND`
   - **Maximum total current:** 500mA from 3.3V rail
   - **Decoupling:** Add 100μF capacitor near power connections

### 4.2 Advanced Power Management Features

**TP4056 Charger Module Specifications:**
- **Input:** 5V USB-C (1A maximum)
- **Charging Current:** 1A (adjustable with resistor)
- **Protection Features:**
  - Overcharge protection (4.2V cutoff)
  - Over-discharge protection (2.5V cutoff)
  - Short circuit protection
  - Thermal protection

**ESP32-S3 Power Modes:**

| Mode | CPU State | Power Draw | Wake Sources |
|:-----|:----------|:-----------|:-------------|
| **Active** | Full operation | 200–300mA | N/A |
| **Modem Sleep** | CPU active, Wi-Fi off | 50–100mA | Timer, GPIO |
| **Light Sleep** | CPU paused | 10–20mA | Timer, GPIO, touch |
| **Deep Sleep** | CPU off | 10–50μA | Timer, GPIO, touch |

### 4.3 Battery Monitoring & Safety

**Battery Level Detection:**
```cpp
// Read battery voltage through ADC
float battery_voltage = analogRead(ADC_PIN) * (3.3 / 4095.0) * 2;
int battery_percentage = map(battery_voltage, 3.0, 4.2, 0, 100);
```

**Low Battery Protection:**
- **Warning Level:** 3.4V (20% remaining)
- **Shutdown Level:** 3.0V (5% remaining)
- **Visual Indicator:** OLED shows battery status
- **Audio Alert:** "Low battery" voice warning

### 4.4 Charging Status Indicators

**TP4056 LED Indicators:**
- **Red LED:** Charging in progress
- **Blue/Green LED:** Charging complete
- **No LED:** No battery or fault condition

**Software Battery Monitoring:**
```cpp
void checkBatteryStatus() {
    float voltage = readBatteryVoltage();
    
    if (voltage < 3.0) {
        // Emergency shutdown
        enterDeepSleep();
    } else if (voltage < 3.4) {
        // Low battery warning
        displayLowBatteryWarning();
        playLowBatterySound();
    }
    
    // Update battery icon on OLED
    updateBatteryIcon(voltage);
}
```

---

## 5. Hardware Development Strategy & Risk Mitigation

### 5.1 Phased Hardware Acquisition Strategy

**⚠️ CRITICAL SUCCESS FACTOR:** Follow this exact sequence to minimize risk and cost.

**Phase 1: PC Simulation (Weeks 1–4) - ₹0 Hardware Cost**
- Complete AI development using existing laptop hardware
- Validate all algorithms and user interactions
- Perfect the personality engine and response system
- Test face recognition with laptop webcam
- Verify voice interaction with laptop audio

**Phase 2: Core Hardware (Week 5) - ₹4,500–₹6,000**
- Purchase ESP32-S3-EYE board only
- Basic breadboard and jumper wires
- Test camera and microphone functionality
- Verify AI model porting feasibility

**Phase 3: Complete System (Week 6–7) - ₹2,000–₹3,000**
- Purchase remaining components after core validation
- OLED display, amplifier, speaker, sensors
- Battery and charging system
- Complete breadboard prototype

**Phase 4: Final Assembly (Week 8–9) - ₹800–₹1,200**
- 3D printing and enclosure fabrication
- Professional assembly and finishing
- Quality testing and calibration

### 5.2 Component Testing & Validation Sequence

**Individual Component Testing (Before Integration):**

1. **ESP32-S3-EYE Validation:**
   ```cpp
   // Test camera functionality
   camera_config_t config;
   esp_err_t err = esp_camera_init(&config);
   
   // Test microphone
   i2s_config_t i2s_config = I2S_CONFIG_DEFAULT();
   i2s_driver_install(I2S_NUM_1, &i2s_config, 0, NULL);
   ```

2. **OLED Display Test:**
   ```cpp
   #include <Adafruit_SSD1306.h>
   Adafruit_SSD1306 display(128, 64, &Wire, -1);
   
   display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
   display.clearDisplay();
   display.setTextSize(2);
   display.println("Hello!");
   display.display();
   ```

3. **Audio System Test:**
   ```cpp
   // Generate test tone
   for (int i = 0; i < sample_count; i++) {
       audio_buffer[i] = sin(2 * PI * 440 * i / sample_rate) * 32767;
   }
   i2s_write(I2S_NUM_0, audio_buffer, buffer_size, &bytes_written, portMAX_DELAY);
   ```

### 5.3 Risk Mitigation & Troubleshooting

**Common Hardware Issues & Solutions:**

| Problem | Symptoms | Solution | Prevention |
|:--------|:---------|:---------|:-----------|
| **Power Issues** | Random resets, brown-outs | Check power supply capacity | Use quality TP4056 module |
| **I2C Conflicts** | Sensor not detected | Verify addresses, pullups | Use I2C scanner code |
| **Audio Distortion** | Poor sound quality | Check I2S timing, connections | Use shielded cables |
| **Camera Failures** | No image, poor quality | Verify pin connections | Handle with anti-static care |
| **Touch Sensitivity** | Erratic touch response | Adjust sensitivity, grounding | Proper enclosure design |

**Hardware Debugging Tools:**
```cpp
// I2C Scanner for device detection
void scanI2C() {
    for (byte address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        if (Wire.endTransmission() == 0) {
            Serial.printf("I2C device found at 0x%02X\n", address);
        }
    }
}

// Power monitoring
void monitorPower() {
    float voltage = analogRead(ADC_PIN) * 3.3 / 4095.0;
    Serial.printf("System voltage: %.2fV\n", voltage);
}
```

### 5.4 Quality Assurance & Testing Protocol

**Hardware Acceptance Testing:**
1. **Power-On Test:** Verify all components receive correct voltage
2. **Communication Test:** Confirm I2C and I2S data transmission
3. **Sensor Calibration:** Test and calibrate all sensor readings
4. **Audio Quality Test:** Verify clear speech synthesis and playback
5. **Camera Calibration:** Test face detection accuracy and speed
6. **Integration Test:** Complete system functionality verification
7. **Stress Test:** Extended operation under various conditions
8. **Safety Test:** Verify all protection circuits function correctly

**Performance Benchmarks:**
- **Boot Time:** <5 seconds from power-on to ready
- **Face Detection:** <500ms response time
- **Voice Response:** <2 seconds end-to-end latency
- **Battery Life:** >6 hours continuous operation
- **Reliability:** >99% uptime during normal operation

### 5.5 Professional Assembly Guidelines

**Soldering Best Practices:**
1. **Temperature Control:** 350°C for lead-free solder
2. **Flux Application:** Use rosin flux for clean joints
3. **Heat Management:** Avoid overheating sensitive components
4. **Joint Inspection:** Verify all connections with multimeter
5. **ESD Protection:** Use anti-static wrist strap throughout

**Enclosure Design Considerations:**
- **Ventilation:** Ensure adequate airflow for heat dissipation
- **Access Ports:** USB-C charging port accessibility
- **Camera Window:** Clear acrylic or glass for camera
- **Speaker Grille:** Acoustic design for optimal sound
- **Touch Surface:** Capacitive-friendly materials
- **Magnetic Mounting:** Secure magnet placement for stability

**Final Quality Control:**
- Visual inspection of all solder joints
- Continuity testing of all connections
- Functional testing of each subsystem
- Calibration of sensors and audio levels
- Stress testing under various conditions
- Documentation of final configuration