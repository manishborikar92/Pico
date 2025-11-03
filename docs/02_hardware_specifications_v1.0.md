# Hardware Specifications and Requirements
**Document Type:** Technical Specification  
**Version:** 1.0  
**Date:** November 3, 2025  
**Audience:** Hardware Engineers, Procurement, Technical Teams  
**Status:** Initial Draft  

---

## Document Metadata
- **Last Modified:** November 3, 2025
- **Document Owner:** Hardware Lead
- **Review Cycle:** Bi-weekly
- **Dependencies:** `01_technical_architecture_v1.0.md`
- **Related Documents:** Software Stack, Development Setup

---

## Executive Summary for Non-Technical Stakeholders

This document outlines the hardware requirements for Project Aura's AI companion robot. The specifications are designed to support real-time AI processing while maintaining cost-effectiveness for both prototyping and production. The hardware strategy follows a tiered approach: cost-effective components for initial development, with clear upgrade paths to production-grade hardware.

**Key Hardware Decisions:**
- **Dual-Processor Architecture:** Main AI processor + real-time co-processor
- **Scalable Design:** Clear upgrade path from prototype to production hardware
- **Open Standards:** Industry-standard interfaces and protocols

---

## 1.0 Hardware Architecture Overview

### 1.1 Dual-Processor Design Philosophy

**Main Processor (AI Brain):**
- Handles complex AI computations (vision, speech, decision-making)
- Runs Ubuntu 22.04 LTS with ROS 2 framework
- Manages high-level robot behaviors and cloud communication

**Co-Processor (Reflex Engine):**
- Manages real-time operations (motor control, sensor reading)
- Handles low-latency responses and safety-critical functions
- Frees main processor for AI-intensive tasks

### 1.2 Component Categories

**Processing Units:** Main and co-processors for AI and real-time operations
**Sensors:** Vision, audio, touch, and motion detection systems
**Actuators:** Movement, expression, and audio output systems
**Communication:** Wireless connectivity and inter-component communication
**Power Management:** Battery systems and power distribution

---

## 2.0 Processing Units

### 2.1 Main Processor Options

**Development/Prototype Configuration:**
- **Component:** Raspberry Pi 5 (4GB or 8GB RAM)
- **CPU:** Quad-core ARM Cortex-A76 @ 2.4GHz
- **GPU:** VideoCore VII (supports OpenGL ES 3.1, Vulkan 1.2)
- **AI Performance:** Moderate (suitable for development and testing)
- **Cost:** ~$75-100 USD
- **Advantages:** Large community, extensive documentation, cost-effective
- **Limitations:** Limited AI acceleration, moderate performance

**Production Configuration:**
- **Component:** NVIDIA Jetson Orin Nano (8GB)
- **CPU:** 6-core ARM Cortex-A78AE @ 1.5GHz
- **GPU:** 1024-core NVIDIA Ampere GPU
- **AI Performance:** 40 TOPS (Tera Operations Per Second)
- **Cost:** ~$400-500 USD
- **Advantages:** Hardware AI acceleration, professional robotics support
- **Use Case:** Production deployment requiring real-time AI processing

### 2.2 Co-Processor Specifications

**Component:** ESP32-S3 Development Module
- **CPU:** Dual-core Xtensa LX7 @ 240MHz
- **Memory:** 512KB SRAM, 384KB ROM
- **Connectivity:** Wi-Fi 802.11 b/g/n, Bluetooth 5.0
- **I/O:** 45 programmable GPIOs, multiple communication interfaces
- **Cost:** ~$10-15 USD
- **Purpose:** Real-time sensor/motor control, LED matrix management

---

## 3.0 Sensor Systems

### 3.1 Vision System

**Development Configuration:**
- **Component:** Raspberry Pi Camera Module 3
- **Sensor:** Sony IMX708 (12MP)
- **Features:** Autofocus, HDR support
- **Interface:** MIPI CSI-2
- **Cost:** ~$25 USD
- **Field of View:** 75° diagonal

**Production Configuration (Option A):**
- **Component:** Arducam IMX477 (12MP) CSI Camera
- **Sensor:** Sony IMX477 with larger sensor area
- **Features:** Better low-light performance, manual focus
- **Interface:** MIPI CSI-2
- **Cost:** ~$50 USD

**Production Configuration (Option B - Advanced):**
- **Component:** Intel RealSense Depth Camera D435
- **Features:** RGB + dual infrared cameras, depth sensing
- **Depth Range:** 0.3m to 3m
- **Interface:** USB 3.0
- **Cost:** ~$200 USD
- **Advantages:** 3D spatial awareness, gesture recognition

### 3.2 Audio System

**Development Configuration:**
- **Component:** ReSpeaker 2-Mic Pi HAT
- **Microphones:** 2x omnidirectional microphones
- **Features:** On-board audio processing, LED indicators
- **Interface:** I2S, GPIO
- **Cost:** ~$15 USD

**Production Configuration:**
- **Component:** ReSpeaker 4-Mic USB Array
- **Microphones:** 4x microphone array with beamforming
- **Features:** Direction of Arrival (DOA), noise suppression
- **Interface:** USB 2.0
- **Cost:** ~$50-70 USD
- **Range:** 3-meter voice pickup radius

### 3.3 Touch Sensors

**Component:** TTP223 Capacitive Touch Sensors
- **Quantity:** 3-5 units (head, back, belly placement)
- **Detection:** Capacitive touch through non-conductive materials
- **Interface:** Digital GPIO
- **Cost:** ~$1 USD per unit
- **Response Time:** <100ms

### 3.4 Motion and Orientation

**Development Configuration:**
- **Component:** MPU6050 6-DOF IMU
- **Sensors:** 3-axis accelerometer + 3-axis gyroscope
- **Interface:** I2C
- **Cost:** ~$5 USD
- **Accuracy:** Moderate, requires sensor fusion

**Production Configuration:**
- **Component:** BNO055 9-DOF IMU
- **Sensors:** Accelerometer + gyroscope + magnetometer
- **Features:** Built-in sensor fusion processor
- **Interface:** I2C or UART
- **Cost:** ~$20 USD
- **Advantages:** Absolute orientation, reduced processing overhead

---

## 4.0 Actuator Systems

### 4.1 Movement System

**Servo Motors:**
- **Component:** DS3218MG Digital Servo Motors
- **Quantity:** 8-12 units (depending on design complexity)
- **Torque:** 20kg-cm at 6V
- **Features:** Metal gears, digital control, position feedback
- **Interface:** PWM control signals
- **Cost:** ~$15-20 USD per unit
- **Rotation:** 180° (standard) or 270° (extended range)

**Motor Driver:**
- **Component:** PCA9685 16-Channel PWM Driver
- **Channels:** 16 independent PWM outputs
- **Interface:** I2C communication
- **Cost:** ~$10 USD
- **Purpose:** Centralized servo control from co-processor

### 4.2 Expression System

**Display Technology:**
- **Component:** 16x16 RGB LED Matrix (WS2812B/NeoPixel)
- **Pixels:** 256 individually addressable RGB LEDs
- **Control:** Single data line with timing-based protocol
- **Interface:** Digital GPIO from co-processor
- **Cost:** ~$20-30 USD
- **Features:** Full-color expressions, animations, low power

**Alternative Display (Higher Resolution):**
- **Component:** 32x32 RGB LED Matrix
- **Pixels:** 1024 individually addressable RGB LEDs
- **Cost:** ~$40-60 USD
- **Use Case:** Production version with enhanced expression capability

### 4.3 Audio Output

**Amplifier:**
- **Component:** MAX98357 I2S Digital Amplifier
- **Power Output:** 3.2W at 4Ω
- **Interface:** I2S digital audio from main processor
- **Cost:** ~$5 USD
- **Features:** Digital input, no analog components required

**Speaker:**
- **Component:** 4Ω Full-Range Speaker (40mm diameter)
- **Power Handling:** 3-5W
- **Frequency Response:** 200Hz - 18kHz
- **Cost:** ~$5-10 USD
- **Mounting:** Custom enclosure integration

---

## 5.0 Communication Systems

### 5.1 Wireless Connectivity

**Wi-Fi:**
- **Standard:** 802.11 b/g/n (2.4GHz) + 802.11 ac (5GHz)
- **Implementation:** Built into main processor (Pi 5/Jetson)
- **Purpose:** Cloud connectivity, OTA updates, local network communication

**Bluetooth:**
- **Standard:** Bluetooth 5.0 LE
- **Implementation:** Built into main processor or co-processor
- **Purpose:** Mobile app pairing, initial setup, proximity detection

### 5.2 Inter-Processor Communication

**Main ↔ Co-Processor:**
- **Interface:** UART (Serial) communication
- **Baud Rate:** 115200 bps (configurable)
- **Protocol:** Custom message format with checksums
- **Purpose:** Sensor data exchange, motor commands, status updates

---

## 6.0 Power Management

### 6.1 Power Requirements

**Main Processor Power:**
- **Raspberry Pi 5:** 5V @ 3A (15W typical, 25W peak)
- **Jetson Orin Nano:** 5-20V @ 2A (10-15W typical, 20W peak)

**Co-Processor Power:**
- **ESP32-S3:** 3.3V @ 500mA (1.65W typical)

**Servo Motors:**
- **Per Servo:** 6V @ 1A (6W per servo under load)
- **Total (12 servos):** 6V @ 12A (72W peak, 20W typical)

**LED Matrix:**
- **16x16 Matrix:** 5V @ 2A (10W at full brightness)
- **32x32 Matrix:** 5V @ 4A (20W at full brightness)

### 6.2 Battery System

**Development Configuration:**
- **Type:** USB Power Bank (20,000mAh)
- **Output:** 5V @ 3A via USB-C
- **Runtime:** 4-6 hours typical operation
- **Cost:** ~$30-50 USD
- **Advantages:** Readily available, safe, easy replacement

**Production Configuration:**
- **Type:** Custom Li-ion Battery Pack
- **Capacity:** 5000-8000mAh at 7.4V (2S configuration)
- **Output:** Multiple regulated voltages (5V, 6V, 3.3V)
- **Runtime:** 6-8 hours typical operation
- **Features:** Battery management system, charging circuit

---

## 7.0 Mechanical Considerations

### 7.1 Chassis Requirements

**Material:** 3D-printed PLA or PETG plastic
- **Advantages:** Rapid prototyping, design iteration, cost-effective
- **Considerations:** Mounting points for all components, cable management

**Design Constraints:**
- **Size:** Compact form factor (target: <30cm in any dimension)
- **Weight:** <2kg total system weight
- **Accessibility:** Easy access to main processor for development

### 7.2 Thermal Management

**Cooling Requirements:**
- **Main Processor:** Passive heatsink (Pi 5) or active cooling (Jetson)
- **Servo Motors:** Adequate ventilation, thermal monitoring
- **LED Matrix:** Heat dissipation consideration for high-brightness operation

---

## 8.0 Cost Analysis

### 8.1 Development Configuration Cost Breakdown

| Component Category | Item | Quantity | Unit Cost | Total Cost |
|-------------------|------|----------|-----------|------------|
| **Processing** | Raspberry Pi 5 (4GB) | 1 | $75 | $75 |
| | ESP32-S3 Module | 1 | $12 | $12 |
| **Sensors** | Pi Camera Module 3 | 1 | $25 | $25 |
| | ReSpeaker 2-Mic HAT | 1 | $15 | $15 |
| | MPU6050 IMU | 1 | $5 | $5 |
| | TTP223 Touch Sensors | 5 | $1 | $5 |
| **Actuators** | DS3218MG Servos | 10 | $18 | $180 |
| | 16x16 LED Matrix | 1 | $25 | $25 |
| | MAX98357 Amplifier | 1 | $5 | $5 |
| | 4Ω Speaker | 1 | $8 | $8 |
| **Support** | PCA9685 PWM Driver | 1 | $10 | $10 |
| | Power Bank | 1 | $40 | $40 |
| | Miscellaneous | - | - | $50 |
| **Total Development Cost** | | | | **$455** |

### 8.2 Production Configuration Cost Breakdown

| Component Category | Item | Quantity | Unit Cost | Total Cost |
|-------------------|------|----------|-----------|------------|
| **Processing** | Jetson Orin Nano | 1 | $450 | $450 |
| | ESP32-S3 Module | 1 | $12 | $12 |
| **Sensors** | RealSense D435 | 1 | $200 | $200 |
| | ReSpeaker 4-Mic Array | 1 | $60 | $60 |
| | BNO055 IMU | 1 | $20 | $20 |
| | TTP223 Touch Sensors | 5 | $1 | $5 |
| **Actuators** | DS3218MG Servos | 12 | $18 | $216 |
| | 32x32 LED Matrix | 1 | $50 | $50 |
| | MAX98357 Amplifier | 1 | $5 | $5 |
| | 4Ω Speaker | 1 | $8 | $8 |
| **Support** | PCA9685 PWM Driver | 1 | $10 | $10 |
| | Custom Battery Pack | 1 | $80 | $80 |
| | Miscellaneous | - | - | $100 |
| **Total Production Cost** | | | | **$1,216** |

---

## 9.0 Procurement Guidelines

### 9.1 Vendor Recommendations

**Electronic Components:**
- **Primary:** Adafruit, SparkFun (development boards and sensors)
- **Secondary:** DigiKey, Mouser (electronic components)
- **Specialty:** NVIDIA Developer Store (Jetson products)

**Mechanical Components:**
- **3D Printing:** Local makerspaces, online services (Shapeways, Craftcloud)
- **Servo Motors:** HobbyKing, ServoCity, Amazon

### 9.2 Quality Considerations

**Component Selection Criteria:**
- **Reliability:** Proven track record in robotics applications
- **Documentation:** Comprehensive technical documentation and community support
- **Availability:** Consistent supply chain and multiple vendor options
- **Compatibility:** Verified compatibility with chosen software stack

---

## 10.0 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 3, 2025 | Initial hardware specification document | Hardware Lead |

---

## 11.0 Hardware Glossary

**CSI:** Camera Serial Interface, high-speed interface for camera modules
**GPIO:** General Purpose Input/Output, configurable digital pins
**I2C:** Inter-Integrated Circuit, serial communication protocol
**I2S:** Inter-IC Sound, serial bus interface for digital audio
**IMU:** Inertial Measurement Unit, sensor measuring motion and orientation
**PWM:** Pulse Width Modulation, method for controlling analog devices digitally
**UART:** Universal Asynchronous Receiver-Transmitter, serial communication interface

---

*This document provides comprehensive hardware specifications for Project Aura implementation. For software integration details, refer to the technical architecture and development setup documentation.*