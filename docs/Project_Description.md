# Document 1: Project Description

### 1. Project Title
**Project AIBI (Unofficial)**: A Cost-Effective, AI-Powered Companion Robot

### 2. Project Vision
To create an intelligent, emotionally-responsive, and interactive "pocket pet" robot that serves as a helpful companion. The project's core philosophy is **maximum functionality at minimal cost**, prioritizing open-source software and low-cost hardware to make the final product accessible to makers and hobbyists.

### 3. Core Concept
The robot is a small, modular "head" unit that houses all the intelligence (processor, mic, speaker, screen). This head can be attached to various bases (charging dock, wearable clip, lanyard) via magnets.

It is a **"voice-first"** device that is always listening for its wake-word. Once activated, it can connect to cloud-based AI services to answer questions, control smart home devices, and provide companionship through a personality-driven system of emotional sound and "eye" animations.

### 4. Key Objectives
* **Hardware:** To design and build a functional prototype using the **ESP32-S3** microcontroller and other low-cost, off-the-shelf (COTS) modules.
* **Software:** To develop a robust C++/MicroPython application that includes:
    * On-device wake-word detection.
    * An "Emotion Engine" (state machine) that maps triggers (like touch or voice) to reactions (sounds and animations).
    * Seamless integration with **free-tier APIs** for AI, STT, and TTS.
    * IoT (Internet of Things) capabilities for smart home control.
* **Cost:** To keep the total component cost for a single prototype **under ₹4,000** (excluding one-time tool costs).
* **Functionality:** To replicate and expand upon the core features observed in commercial products like the AIBI pet, including Q&A, IoT control, and interactive personality.

### 5. Target "User" (For This Prototype)
The primary user for this initial build is **the developer (you)**. The goal is to create a fully functional hardware and software platform. A secondary target would be the open-source/maker community, for whom this project would serve as a powerful, low-cost template for building their own companion robots.