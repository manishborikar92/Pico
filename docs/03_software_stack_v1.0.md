# Software Stack Specification
**Document Type:** Technical Specification  
**Version:** 1.0  
**Date:** November 3, 2025  
**Audience:** Software Engineers, DevOps, Technical Teams  
**Status:** Initial Draft  

---

## Document Metadata
- **Last Modified:** November 3, 2025
- **Document Owner:** Software Lead
- **Review Cycle:** Weekly
- **Dependencies:** `01_technical_architecture_v1.0.md`, `02_hardware_specifications_v1.0.md`
- **Related Documents:** Development Setup, Implementation Guide

---

## Executive Summary for Non-Technical Stakeholders

This document defines the complete software ecosystem for Project Aura's AI companion robot. The software stack is built on industry-standard, open-source technologies to ensure reliability, maintainability, and cost-effectiveness. The architecture supports both development (simulation-based) and production (hardware-based) environments with minimal code changes.

**Key Software Decisions:**
- **Open Source Foundation:** Built entirely on free, well-supported technologies
- **Industry Standards:** ROS 2 for robotics, NVIDIA stack for AI acceleration
- **Simulation-First:** Complete development possible without hardware investment

---

## 1.0 Software Architecture Overview

### 1.1 Multi-Tier Software Design

**Tier 1 - Perception Layer:**
- Real-time sensor data acquisition and processing
- Computer vision and audio processing
- Environmental awareness and object detection

**Tier 2 - Cognition Layer:**
- Natural language processing and understanding
- Personality engine and decision-making logic
- Learning and adaptation mechanisms

**Tier 3 - Action Layer:**
- Motor control and movement coordination
- Expression management and display control
- Navigation and path planning

**Tier 4 - Integration Layer:**
- Cloud connectivity and data synchronization
- Over-the-air updates and remote management
- Telemetry and performance monitoring

### 1.2 Development Philosophy

**Simulation-First Approach:**
- Complete software development in virtual environment
- Hardware-agnostic design for easy deployment
- Rapid iteration without hardware dependencies

**Modular Architecture:**
- Independent, loosely-coupled components
- Easy testing, debugging, and maintenance
- Scalable and extensible design

---

## 2.0 Operating System and Foundation

### 2.1 Base Operating System

**Primary OS:** Ubuntu 22.04 LTS (Server Edition)
- **Rationale:** Industry standard for robotics, excellent ROS 2 support
- **License:** Free and open-source
- **Support:** Long-term support until 2027
- **Hardware Compatibility:** Raspberry Pi 5, NVIDIA Jetson platforms

**Development Environment:** Windows 11 + WSL 2
- **WSL Distribution:** Ubuntu 22.04 from Microsoft Store
- **Advantages:** Native Linux environment on Windows, seamless development
- **IDE Integration:** VS Code with WSL Remote Development extension

### 2.2 Core System Libraries

**Essential Packages:**
```bash
# System utilities
build-essential cmake git curl wget
python3 python3-pip python3-dev
nodejs npm

# ROS 2 dependencies
ros-humble-desktop-full
ros-humble-navigation2
ros-humble-nav2-bringup
ros-humble-slam-toolbox

# Computer vision and AI
opencv-python
onnxruntime
numpy scipy matplotlib
```

---

## 3.0 Robotics Middleware

### 3.1 ROS 2 (Robot Operating System)

**Version:** ROS 2 Humble Hawksbill
- **Release Date:** May 2022
- **Support Period:** Until May 2027 (LTS release)
- **License:** Apache 2.0 (open source)

**Core Components:**
- **rclpy:** Python client library for ROS 2
- **rclcpp:** C++ client library for high-performance nodes
- **DDS:** Data Distribution Service for inter-node communication
- **Launch System:** Declarative system for starting multiple nodes

**Key Packages:**
```bash
# Core ROS 2 functionality
ros-humble-rclpy
ros-humble-rclcpp
ros-humble-std-msgs
ros-humble-sensor-msgs
ros-humble-geometry-msgs

# Visualization and debugging
ros-humble-rviz2
ros-humble-rqt
ros-humble-ros2bag

# Hardware interfaces
ros-humble-usb-cam
ros-humble-audio-common
ros-humble-serial-driver
```

### 3.2 ROS 2 Node Architecture

**Node Categories:**

**Sensor Nodes:**
- `vision_node`: Camera data acquisition and publishing
- `audio_node`: Microphone array processing and streaming
- `imu_node`: Motion and orientation data
- `touch_node`: Capacitive touch sensor monitoring

**Processing Nodes:**
- `detect_node`: Object and face detection using AI models
- `nlp_node`: Natural language processing and intent extraction
- `slam_node`: Simultaneous localization and mapping

**Control Nodes:**
- `personality_engine`: Core decision-making and state management
- `motor_node`: Servo control and movement execution
- `display_node`: LED matrix control and expression management
- `nav_node`: Path planning and navigation control

**Communication Nodes:**
- `cloud_bridge_node`: Secure cloud connectivity
- `telemetry_node`: Data collection and monitoring

---

## 4.0 Artificial Intelligence Stack

### 4.1 Computer Vision

**OpenCV (Open Source Computer Vision Library)**
- **Version:** 4.8+ with Python bindings
- **License:** Apache 2.0
- **Capabilities:** Image processing, feature detection, camera calibration
- **Installation:** `pip install opencv-python opencv-contrib-python`

**AI Model Inference:**
- **ONNX Runtime:** Cross-platform inference engine
- **TensorFlow Lite:** Lightweight inference for edge devices
- **PyTorch Mobile:** Mobile-optimized PyTorch models

**Pre-trained Models:**
```python
# Object detection models
- YOLOv8 (Ultralytics): General object detection
- MobileNet-SSD: Lightweight object detection
- MediaPipe Face Detection: Real-time face detection

# Gesture recognition models
- MediaPipe Hands: Hand tracking and gesture recognition
- Custom gesture models: Trained for specific interactions
```

### 4.2 Natural Language Processing

**Speech-to-Text (STT):**
- **Whisper.cpp:** High-performance C++ port of OpenAI Whisper
- **Advantages:** Local processing, no cloud dependency, multilingual
- **Performance:** Real-time transcription on Raspberry Pi 5+
- **Installation:** Compile from source or use pre-built binaries

**Natural Language Understanding:**
- **spaCy:** Industrial-strength NLP library
- **Transformers (Hugging Face):** Pre-trained language models
- **Custom Intent Classification:** Fine-tuned models for robot interactions

**Text-to-Speech (TTS):**
- **Piper:** Fast, local neural text-to-speech
- **Advantages:** High-quality voices, low latency, offline operation
- **Voice Models:** Multiple languages and speaker styles available

### 4.3 NVIDIA AI Stack (Production Hardware)

**NVIDIA Isaac ROS:**
- **Purpose:** Hardware-accelerated robotics packages
- **Components:** Visual SLAM, object detection, depth processing
- **Requirements:** NVIDIA Jetson hardware with JetPack

**NVIDIA Riva:**
- **Purpose:** GPU-accelerated speech AI
- **Components:** ASR, NLP, TTS with real-time performance
- **Deployment:** Docker containers with GPU acceleration

---

## 5.0 Navigation and Mapping

### 5.1 SLAM (Simultaneous Localization and Mapping)

**Development Configuration:**
- **SLAM Toolbox:** 2D laser-based SLAM for ROS 2
- **Input:** Camera-based pseudo-lidar or actual 2D lidar
- **Output:** Occupancy grid maps, robot pose estimation

**Production Configuration:**
- **NVIDIA Isaac ROS Visual SLAM:** GPU-accelerated visual SLAM
- **Input:** Stereo cameras or RGB-D sensors
- **Output:** 3D maps, precise 6-DOF pose estimation

### 5.2 Navigation Stack

**Nav2 (Navigation2):**
- **Purpose:** Complete autonomous navigation solution
- **Components:** Path planning, obstacle avoidance, behavior trees
- **Algorithms:** A* path planning, DWB local planner, recovery behaviors

**Configuration:**
```yaml
# Navigation parameters
controller_frequency: 20.0
planner_frequency: 1.0
recovery_frequency: 1.0
controller_patience: 15.0
planner_patience: 5.0
```

---

## 6.0 Personality Engine

### 6.1 State Machine Implementation

**Framework:** Python-based finite state machine
- **Library:** `transitions` - Lightweight state machine library
- **States:** Emotional states (happy, curious, sleepy, playful, etc.)
- **Transitions:** Event-driven state changes based on sensor inputs

**Core Logic:**
```python
class PersonalityEngine:
    states = ['idle', 'curious', 'happy', 'playful', 'sleepy']
    
    def __init__(self):
        self.machine = Machine(
            model=self, 
            states=PersonalityEngine.states, 
            initial='idle'
        )
        
    def process_event(self, event_type, event_data):
        # Decision logic based on current state and input
        pass
```

### 6.2 Learning and Adaptation

**Local Learning:**
- **Database:** SQLite for on-device data storage
- **Data:** User preferences, interaction patterns, learned behaviors
- **Privacy:** All personal data remains on-device

**Cloud Learning:**
- **Telemetry:** Anonymized interaction data for fleet-wide learning
- **Models:** Updated behavior models deployed via OTA updates
- **Algorithms:** Reinforcement learning for behavior optimization

---

## 7.0 Cloud Backend Services

### 7.1 API Framework

**FastAPI (Python):**
- **Advantages:** High performance, automatic API documentation, type hints
- **Features:** Async support, dependency injection, security middleware
- **Deployment:** Docker containers with uvicorn ASGI server

**Service Architecture:**
```python
# Microservice structure
services/
├── auth-service/          # User authentication and authorization
├── device-service/        # Robot fleet management
├── ai-ml-service/         # Heavy AI processing
├── telemetry-service/     # Data collection and analytics
└── api-gateway/           # Request routing and load balancing
```

### 7.2 Database Systems

**PostgreSQL:**
- **Purpose:** Primary relational database for structured data
- **Data:** User accounts, device registry, configuration settings
- **Features:** ACID compliance, JSON support, full-text search

**TimescaleDB:**
- **Purpose:** Time-series data extension for PostgreSQL
- **Data:** Sensor telemetry, interaction logs, performance metrics
- **Features:** Automatic partitioning, compression, continuous aggregates

**Redis:**
- **Purpose:** In-memory cache and session storage
- **Data:** Session tokens, frequently accessed data, real-time counters
- **Features:** High performance, pub/sub messaging, data structures

### 7.3 Message Queue and Streaming

**Apache Kafka:**
- **Purpose:** Distributed streaming platform for real-time data
- **Use Cases:** Robot telemetry, event streaming, microservice communication
- **Features:** High throughput, fault tolerance, scalable architecture

---

## 8.0 Mobile Application Stack

### 8.1 Cross-Platform Framework

**Flutter:**
- **Language:** Dart programming language
- **Advantages:** Single codebase for iOS/Android, native performance
- **UI:** Material Design and Cupertino widgets

**Architecture Pattern:**
- **BLoC (Business Logic Component):** State management pattern
- **Clean Architecture:** Separation of concerns, testable code
- **Dependency Injection:** Service locator pattern for loose coupling

### 8.2 Key Libraries

```yaml
dependencies:
  flutter: sdk
  bloc: ^8.1.0              # State management
  dio: ^5.0.0               # HTTP client
  web_socket_channel: ^2.4.0  # WebSocket communication
  shared_preferences: ^2.0.0   # Local storage
  permission_handler: ^10.0.0  # Device permissions
  camera: ^0.10.0           # Camera access
  bluetooth_plus: ^4.0.0    # Bluetooth connectivity
```

---

## 9.0 Web Frontend Stack

### 9.1 Marketing Website

**Next.js Framework:**
- **Version:** Next.js 14+ with App Router
- **Features:** Server-side rendering, static site generation, API routes
- **Deployment:** Vercel or Netlify for global CDN distribution

**Technology Stack:**
```json
{
  "framework": "Next.js 14",
  "styling": "Tailwind CSS",
  "ui_components": "Headless UI",
  "animations": "Framer Motion",
  "cms": "Strapi (headless CMS)",
  "ecommerce": "Medusa.js",
  "analytics": "Vercel Analytics"
}
```

### 9.2 E-commerce Integration

**Medusa.js:**
- **Type:** Headless e-commerce platform
- **Advantages:** Open source, customizable, API-first
- **Features:** Product management, cart functionality, payment processing

---

## 10.0 Development Tools and Utilities

### 10.1 Development Environment

**IDE and Editors:**
- **VS Code:** Primary IDE with extensions for ROS 2, Python, Flutter
- **Extensions:** WSL Remote, ROS, Python, Flutter, Docker

**Version Control:**
- **Git:** Distributed version control system
- **GitHub:** Repository hosting with CI/CD integration
- **Monorepo:** Single repository for all project components

### 10.2 Testing Framework

**Python Testing:**
```bash
# Testing libraries
pytest                    # Primary testing framework
pytest-cov               # Coverage reporting
pytest-mock              # Mocking utilities
pytest-asyncio           # Async testing support
```

**ROS 2 Testing:**
```bash
# ROS 2 testing tools
ros-humble-launch-testing    # Integration testing
ros-humble-test-msgs        # Test message types
colcon-test                 # Build system testing
```

### 10.3 Containerization

**Docker:**
- **Base Images:** Ubuntu 22.04, ROS 2 Humble official images
- **Multi-stage Builds:** Optimized production images
- **Docker Compose:** Local development environment orchestration

**Container Strategy:**
```dockerfile
# Development container
FROM ros:humble-desktop-full
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-opencv \
    ros-humble-usb-cam
```

---

## 11.0 Security and Privacy

### 11.1 Data Protection

**Encryption:**
- **At Rest:** AES-256 encryption for stored data
- **In Transit:** TLS 1.3 for all network communication
- **Key Management:** Hardware security modules for production

**Privacy Compliance:**
- **COPPA:** Children's Online Privacy Protection Act compliance
- **GDPR:** General Data Protection Regulation compliance
- **Data Minimization:** Process only necessary data locally

### 11.2 Secure Communication

**Authentication:**
- **OAuth 2.0:** Industry-standard authorization framework
- **JWT Tokens:** Stateless authentication with expiration
- **Certificate Pinning:** Mobile app security enhancement

**Network Security:**
- **VPN:** Secure tunneling for robot-cloud communication
- **Firewall Rules:** Restrictive network access policies
- **Intrusion Detection:** Monitoring for security threats

---

## 12.0 Performance Optimization

### 12.1 Real-Time Performance

**Latency Optimization:**
- **Model Quantization:** INT8 inference for faster processing
- **Pipeline Parallelism:** Concurrent processing streams
- **Memory Management:** Efficient buffer allocation and reuse

**Resource Management:**
- **CPU Affinity:** Dedicated cores for critical processes
- **Memory Limits:** Controlled memory usage per component
- **Priority Scheduling:** Real-time scheduling for time-critical tasks

### 12.2 Monitoring and Profiling

**Performance Monitoring:**
```python
# Monitoring tools
psutil                   # System resource monitoring
py-spy                   # Python profiler
memory_profiler          # Memory usage analysis
```

**ROS 2 Monitoring:**
```bash
# ROS 2 performance tools
ros2 topic hz            # Topic frequency monitoring
ros2 topic bw            # Bandwidth monitoring
ros2 node info           # Node resource usage
```

---

## 13.0 Deployment and Distribution

### 13.1 Over-The-Air (OTA) Updates

**Update Mechanism:**
- **Differential Updates:** Only changed files transmitted
- **Rollback Capability:** Automatic rollback on update failure
- **Staged Deployment:** Gradual rollout to robot fleet

**Update Components:**
- **System Packages:** Ubuntu package updates
- **ROS 2 Packages:** Robot software updates
- **AI Models:** Updated neural network models
- **Configuration:** Parameter and behavior updates

### 13.2 Continuous Integration/Deployment

**CI/CD Pipeline:**
```yaml
# GitHub Actions workflow
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3
      - name: Setup ROS 2
        uses: ros-tooling/setup-ros@v0.6
      - name: Run tests
        run: colcon test
```

---

## 14.0 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 3, 2025 | Initial software stack specification | Software Lead |

---

## 15.0 Software Glossary

**API:** Application Programming Interface, set of protocols for building software
**ASGI:** Asynchronous Server Gateway Interface, Python web server standard
**BLoC:** Business Logic Component, Flutter state management pattern
**CI/CD:** Continuous Integration/Continuous Deployment, automated software delivery
**DDS:** Data Distribution Service, middleware for real-time systems
**JWT:** JSON Web Token, compact token format for secure information transmission
**OTA:** Over-The-Air updates, remote software deployment method
**SLAM:** Simultaneous Localization and Mapping, robotic navigation technique
**STT:** Speech-to-Text, audio transcription technology
**TTS:** Text-to-Speech, speech synthesis technology

---

*This document provides comprehensive software specifications for Project Aura implementation. For hardware integration and deployment procedures, refer to the related technical documentation.*