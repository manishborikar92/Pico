This is the correct, professional-grade approach.

By separating the hardware decision, we can focus on building the entire "brain" of the robot in a simulated environment on your laptop. This is the standard, most efficient way to develop complex robotics software.

We will build a **complete, hardware-agnostic, simulation-first software stack**. The software we develop in WSL will be 99% identical to the code that will eventually run on the final robot processor (e.g., an NVIDIA Jetson). Your laptop's camera and mic will act as the robot's "senses."

Here is the complete software project documentation you requested.

-----

# Project Documentation: "Aura" Companion Robot SDK

**Document Version:** 1.0 (Initial Draft)
**Project Lead:** [Your Name/Company]
**Date:** November 3, 2025

**TABLE OF CONTENTS**
1.0 Core Idea & Project Philosophy
2.0 System Architecture Overview
2.1 Software Stack (The "Brain")
2.2 Development Environment (The "Lab")
2.3 The Simulation-to-Production Pipeline
3.0 Core Features & Functionality
3.1 Tier-1: Real-Time Perception (The Senses)
3.2 Tier-2: Real-Time Cognition (The Personality)
3.3 Tier-3: Autonomous Action (The Body)
3.4 Tier-4: Cloud Augmentation (The "Creative Brain")
4.0 Development Process & Steps (The Roadmap)
4.1 Phase 1: Environment Setup (WSL & ROS 2)
4.2 Phase 2: Sensor Integration (Simulation)
4.3 Phase 3: Core AI Implementation (Cognition & Personality)
4.4 Phase 4: Autonomous Action (Navigation & Simulation)
4.5 Phase 5: Hardware-in-the-Loop (HIL)
5.0 Complete Project Workflow (Data Flow)
5.1 Example 1: The "Hello" Interaction (Real-Time NLP)
5.2 Example 2: The "Come Here" Command (SLAM & Nav)
6.0 Complete User Workflow (The Experience)
7.0 Testing & Validation Strategy
7.1 Unit Testing
7.2 Integration Testing
7.3 User Acceptance Testing (UAT)
8.0 Next Steps

-----

## 1.0 Core Idea & Project Philosophy

**Project "Aura"** is a next-generation robotic companion. Its core idea is to provide **proactive, emotionally-aware companionship** through **real-time, on-device artificial intelligence**.

This is *not* a "smart speaker on wheels" that reactively waits for a wake-word. Aura is a *proactive* agent. It is designed to "live" in an environment, understand it, and engage with its user based on contextual events, all with no perceptible lag.

**Core Philosophy:**

  * **Real-Time is Everything:** An interaction lag of more than one second breaks the illusion of life. All primary AI (perception, core NLP, personality) *must* run on-device.
  * **Privacy-First:** By processing 95% of data on-device, Aura does not need to stream private camera or microphone data to the cloud. This is a critical trust and marketing feature.
  * **Simulation-First Development:** We will build a complete, simulated robot in software before committing to final, expensive hardware. This allows for rapid iteration, parallel development, and a "hardware-agnostic" design.
  * **Hardware-Accelerated:** The software stack will be built from the ground up to leverage GPU and AI-accelerator hardware (like NVIDIA's Tensor Cores) for its on-device AI.

## 2.0 System Architecture Overview

### 2.1 Software Stack (The "Brain")

The entire on-robot system will be built on the **Robot Operating System 2 (ROS 2)**. This is a collection of libraries and tools for building complex robot applications. It allows each component (camera, AI, motors) to be a separate, plug-and-play "node" that communicates on a high-speed data bus.

  * **OS:** **Ubuntu 22.04 LTS** (This will run in WSL and on the final robot).
  * **Middleware:** **ROS 2 Humble Hawksbill** (Standard, stable, long-term support).
  * **Core AI Stack:** **NVIDIA Isaac ROS & NVIDIA Riva**
      * **Why:** This is the *only* stack that meets our "no-lag, on-device AI" requirement. It's built by NVIDIA to provide GPU-accelerated AI on the same platforms we will use (x86 laptop for dev, Jetson for production).
  * **Navigation:** **Nav2 Stack (ROS 2 Navigation Stack)**
  * **Programming Language:** **Python** (for high-level AI, personality, and logic) & **C++** (for performance-critical sensor drivers and control loops).

### 2.2 Development Environment (The "Lab")

  * **Host OS:** Windows 11
  * **Virtualization:** **WSL 2 (Windows Subsystem for Linux)**
  * **Guest OS:** **Ubuntu 22.04** (Installed from the Microsoft Store)
  * **IDE:** **VS Code** with the **WSL Remote Development** and **ROS** extensions. This is a seamless, professional-grade setup.
  * **Simulation Inputs:**
      * **Camera:** Laptop's built-in webcam.
      * **Microphone:** Laptop's built-in microphone.
  * **Simulation Outputs:**
      * **Robot "Display":** A simple OpenCV window (created with Python) that shows the robot's "pixel face" and expressions.
      * **Robot "Wheels":** A simple Python script that prints motor commands to the console (e.g., `[MOTOR_CTRL] Moving forward: 0.5 m/s`).
      * **Robot "World":** **RViz2** (The built-in ROS 2 visualizer) to show the map the robot is building, its perceived location, and its navigation path.

### 2.3 The Simulation-to-Production Pipeline

This is the most critical part of the process.

| Phase | **Phase 1: Simulation (Laptop)** | **Phase 2: Production (Robot Hardware)** |
| :--- | :--- | :--- |
| **Processor** | Intel/AMD CPU + NVIDIA GPU (in Laptop) | NVIDIA Jetson Orin Nano (ARM CPU + Ampere GPU) |
| **Camera Node** | `usb_cam` (ROS 2 package for laptop cam) | `argus_camera` (NVIDIA's package for Jetson cam) |
| **Audio Node** | `audio_common` (Laptop mic) | `respeaker_ros` (Package for 4-mic array) |
| **AI Stack** | **NVIDIA Isaac & Riva** (x86\_64 version) | **NVIDIA Isaac & Riva** (aarch64 version) |
| **Personality** | `personality_engine.py` (Your Python Code) | `personality_engine.py` **(THE EXACT SAME CODE)** |

As you can see, we only swap the low-level hardware *drivers*. The entire AI system and "brain" (your core code) transfers directly with a simple recompile.

## 3.0 Core Features & Functionality

This defines the software "nodes" we will build.

### 3.1 Tier-1: Real-Time Perception (The Senses)

  * **`vision_node` (Camera):**
      * **Feature:** Publishes a real-time `/image_raw` topic from the laptop webcam.
      * **Feature (AI):** A secondary node, `detect_node` (using **Isaac ROS DNN Inference**), subscribes to `/image_raw` and runs a real-time **object detection** model (e.g., YOLO).
      * **Output:** Publishes a topic `/detected_objects` (e.g., `{'class': 'person', 'box': [x,y,w,h]}`).
  * **`audio_node` (Microphone):**
      * **Feature:** A node (using `audio_common`) that captures the laptop mic audio and streams it.
      * **Feature (AI):** This stream is fed *locally* into the **NVIDIA Riva ASR** service (Automatic Speech Recognition).
      * **Output:** A real-time transcription, published to `/speech_to_text`.
  * **`mic_array_node` (Simulation):**
      * **Feature (Sim):** A "mock" node that publishes a fake **Direction of Arrival (DOA)**.
      * **Output:** Publishes a topic `/sound_direction` (e.g., `{'angle': 90.0}`).
  * **`touch_node` (Simulation):**
      * **Feature (Sim):** A mock node that we can trigger manually from the command line (e.g., `ros2 topic pub ... 'pet_head'`).
      * **Output:** Publishes a topic `/touch_event`.
  * **`motion_node` (Simulation):**
      * **Feature (Sim):** A mock node that publishes a fake IMU (motion sensor) data.
      * **Output:** Publishes a topic `/imu/data`.

### 3.2 Tier-2: Real-Time Cognition (The Personality)

This is the **"brain"** of the robot. It is a single, large Python node (`personality_node`) that subscribes to all the perception topics.

  * **`nlp_node` (AI):**
      * **Feature:** Subscribes to `/speech_to_text`. It feeds the text into the **NVIDIA Riva NLP** service.
      * **Output:** Publishes a high-level "intent" to the `/intent` topic (e.g., `{'intent': 'greet', 'user': 'Mia'}` or `{'intent': 'play_game'}`).
  * **`personality_engine` (The Core):**
      * **Feature:** A complex **Finite State Machine (FSM)**. This is the robot's "mood" (e.g., `happy`, `curious`, `sleepy`, `playful`).
      * **Logic:** It receives all sensor and AI inputs (`/intent`, `/detected_objects`, `/touch_event`, `/sound_direction`) and decides what to do based on its current state.
      * **Example:**
          * `IF state == 'sleepy'` AND `event == /detected_objects('person')`
          * `THEN transition_state_to 'curious'` AND `call_action 'turn_to_person'`
  * **`voice_node` (AI):**
      * **Feature:** An "action" service that receives text from the `personality_engine`. It uses **NVIDIA Riva TTS** (Text-to-Speech) to generate a natural, human-sounding voice *on-device*.
      * **Output:** Plays the audio out of the laptop's speakers.

### 3.3 Tier-3: Autonomous Action (The Body)

  * **`slam_node` (AI):**
      * **Feature:** Subscribes to `/image_raw`. It runs **NVIDIA Isaac ROS Visual SLAM** to build a 3D map of the room in real-time.
      * **Output:** Publishes the robot's position (`/tf`) and the map (`/map`).
  * **`nav_node` (AI):**
      * **Feature:** The full **Nav2** stack. It takes a *goal* from the `personality_engine` (e.g., "go to the 'person' object") and calculates a path.
      * **Output:** Publishes velocity commands to `/cmd_vel` (e.g., `{'linear': 0.5, 'angular': 0.1}`).
  * **`display_node` (Simulation):**
      * **Feature:** Subscribes to an `/expression` topic published by the `personality_engine`.
      * **Output:** Opens an OpenCV window showing a "pixel face" (e.g., `happy_eyes.png`).
  * **`motor_node` (Simulation):**
      * **Feature:** Subscribes to `/cmd_vel`.
      * **Output:** Prints the velocity commands to the console (e.g., `[MOTOR_CTRL] Moving...`).

### 3.4 Tier-4: Cloud Augmentation (The "Creative Brain")

This is *optional* and used *only* for non-real-time tasks.

  * **`cloud_bridge_node`:**
      * **Feature:** If the `personality_engine` gets an intent it can't handle (e.g., `{'intent': 'ask_world_knowledge'}` like "What's the weather?"), it will pass this request to the `cloud_bridge_node`.
      * **Logic:** This node securely calls a **REST API** (which you will build using **FastAPI** in Python) that can connect to a Generative AI (like an LLM) or a weather API.
      * **Result:** The response comes back, is fed to the `voice_node` (TTS), and the robot gives a "smart" answer. This is the only part that has lag, which is acceptable.

## 4.0 Development Process & Steps (The Roadmap)

This is your step-by-step plan for development.

### 4.1 Phase 1: Environment Setup (WSL & ROS 2)

1.  **Install Windows 11:** (Done)
2.  **Install WSL 2:** Open PowerShell as Admin:
    ```powershell
    wsl --install
    ```
3.  **Install Ubuntu 22.04:** Get it from the Microsoft Store.
4.  **Install VS Code:** Install the **WSL Remote Development** extension.
5.  **Install ROS 2 Humble:** Open your new Ubuntu terminal and follow the official ROS 2 installation guide.
6.  **Install `usbipd`:** This is the *critical* step to give WSL access to your laptop camera.
      * In PowerShell (Admin): `winget install --interactive --exact dorssel.usbipd-win`
      * Follow instructions to attach your laptop webcam (`usbipd wsl attach --busid <bus-id>`)
7.  **Create ROS 2 Workspace:**
    ```bash
    mkdir -p ~/aura_ws/src
    cd ~/aura_ws
    colcon build
    ```
8.  **Source Workspace:** Add `source ~/aura_ws/install/setup.bash` to your `~/.bashrc`.

### 4.2 Phase 2: Sensor Integration (Simulation)

1.  **Camera Node:**
      * `sudo apt install ros-humble-usb-cam`
      * Run: `ros2 run usb_cam usb_cam_node`
      * **Test:** `ros2 topic echo /image_raw` (You should see image data).
2.  **Audio Node:**
      * `sudo apt install ros-humble-audio-common`
      * Run: `ros2 run audio_common audio_capture_node`
      * **Test:** `ros2 topic echo /audio` (You should see audio data).
3.  **Mock Nodes (Write these in Python):**
      * Create a new ROS 2 package: `ros2 pkg create --build-type ament_python mock_sensors --dependencies rclpy`
      * Inside `mock_sensors/`, create `touch_node.py` (publishes to `/touch_event`), `imu_node.py` (publishes to `/imu/data`), etc.
4.  **Display & Motor Nodes (Write these in Python):**
      * Create `display_node.py` that uses `opencv-python` to open a window and subscribes to `/expression`.
      * Create `motor_node.py` that subscribes to `/cmd_vel` and just prints the message.

### 4.3 Phase 3: Core AI Implementation (Cognition & Personality)

1.  **Install NVIDIA Stack:** This is the hardest part. You will install **NVIDIA Riva** and **NVIDIA Isaac ROS** on your WSL/Ubuntu environment. They provide Docker containers and setup scripts for this.
2.  **Test ASR (Speech-to-Text):**
      * Run the Riva ASR service.
      * Write a simple Python script (not ROS 2 yet) to feed it audio from your mic and see the text transcription.
3.  **Test NLP (Intent):**
      * Configure the Riva NLP service with 10 custom intents (e.g., `greet`, `play`, `come_here`, `stop`).
      * Write a script to feed it text (e.g., "Hello there buddy\!") and see it output `{'intent': 'greet'}`.
4.  **Test TTS (Text-to-Speech):**
      * Run the Riva TTS service.
      * Write a script to send it "Hello world" and hear it play on your laptop speakers.
5.  **Build the `personality_node`:**
      * Create a new Python package `aura_core`.
      * Create `personality_node.py`.
      * This is the "main" node. It will subscribe to `/intent`, `/detected_objects`, etc.
      * Start building the State Machine logic (e.g., `if state == 'listening': ...`).
      * It will *publish* to `/expression` (to make the OpenCV window change) and *call* the TTS service.

### 4.4 Phase 4: Autonomous Action (Navigation & Simulation)

1.  **Install Navigation Stack:**
      * `sudo apt install ros-humble-nav2-bringup`
      * `sudo apt install ros-humble-slam-toolbox` (We'll start with this before moving to Isaac VSLAM).
2.  **Install Sim Tools:**
      * `sudo apt install ros-humble-teleop-twist-keyboard` (Lets you "drive" the robot with your keyboard to test).
3.  **Configure SLAM:**
      * Launch `slam_toolbox`. As you move your laptop around the room, you will see a 2D map being built in **RViz2**. This is the "magic" moment.
4.  **Configure Nav2:**
      * Launch the full Nav2 stack. It will use the map from SLAM.
      * In RViz2, you can now "click" a destination, and Nav2 will publish commands to `/cmd_vel`.
      * **Test:** Your `motor_node.py` (from Phase 2) should spring to life, printing `[MOTOR_CTRL] Moving...`.
5.  **Integrate with Personality:**
      * The final step. The `personality_node` can now *send goals* to the Nav2 stack.
      * **Example:** It sees a `person` from `/detected_objects`. It looks up their coordinates. It sends a navigation goal to Nav2. The robot "moves" (in simulation) towards the person.

### 4.5 Phase 5: Hardware-in-the-Loop (HIL)

1.  **Acquire Hardware:** You buy the NVIDIA Jetson Orin Nano, the ReSpeaker 4-Mic Array, the wheels, motors, and camera.
2.  **Install OS:** Flash the Jetson with the NVIDIA JetPack (Ubuntu 22.04).
3.  **Install ROS 2:** Install ROS 2 Humble.
4.  **Deploy Code:** Copy your *entire* `~/aura_ws` (your whole project) to the Jetson.
5.  **Re-build:** `cd ~/aura_ws && colcon build` (This recompiles your code for the Jetson's ARM processor).
6.  **Swap Nodes:**
      * *Disable* the `usb_cam` node. *Enable* the `argus_camera` node.
      * *Disable* the `audio_common` node. *Enable* the `respeaker_ros` node.
      * *Disable* the `motor_node.py` (mock). *Enable* the *real* C++ motor controller node (which uses `ros2_control`).
7.  **Run:** Launch your main project file. The *exact same* `personality_node.py` will now be controlling a *real* robot.

## 5.0 Complete Project Workflow (Data Flow)

This shows how all the nodes work together.

### 5.1 Example 1: The "Hello" Interaction (Real-Time NLP)

1.  **User:** Speaks "Hey Aura, hello\!"
2.  **`audio_node`:** Captures audio -\> streams it.
3.  **Riva ASR Node:** Subscribes to audio -\> transcribes it in real-time -\> publishes `"Hey Aura, hello!"` to `/speech_to_text`.
4.  **`nlp_node`:** Subscribes to `/speech_to_text` -\> processes text -\> publishes `{'intent': 'greet'}` to `/intent`.
5.  **`personality_node`:** Is in `state: 'listening'`. It receives the `/intent` message.
      * **Logic:** `IF event == 'greet'` -\> `CALL_SERVICE 'tts_service' ('Hello there!')` AND `PUBLISH '/expression' ('happy_eyes')`.
6.  **`voice_node` (TTS):** Receives the service call -\> generates "Hello there\!" audio -\> plays on laptop speakers.
7.  **`display_node` (Sim):** Receives `/expression` message -\> updates OpenCV window to show "happy\_eyes.png".
8.  **Result:** The robot's face lights up and it replies "Hello there\!" almost instantly. **(No Lag)**.

### 5.2 Example 2: The "Come Here" Command (SLAM & Nav)

1.  **User:** Stands 10 feet away. Speaks "Aura, come here\!"
2.  **Nodes 1-4 (Audio):** The `nlp_node` publishes `{'intent': 'come_here'}` to `/intent`.
3.  **`vision_node` + `detect_node`:** Are constantly running. They see the user and publish `{'class': 'person', 'distance': 3.0}` to `/detected_objects`.
4.  **`slam_node`:** Is constantly running, publishing the robot's location (`/tf`) and the room map (`/map`).
5.  **`personality_node`:** Receives the `/intent` message.
      * **Logic:** `IF event == 'come_here'` -\> `QUERY_DATA 'get_latest_object_coords("person")'`.
      * **Logic:** It gets the person's coordinates from the `/detected_objects` and `/tf` data (e.g., `[x=3.0, y=1.5]`).
      * **Logic:** `CALL_ACTION 'navigation_goal' ([x=3.0, y=1.5])` AND `PUBLISH '/expression' ('focused_eyes')`.
6.  **`nav_node`:** Receives the navigation goal. It calculates a safe path to `[3.0, 1.5]` using the `/map`.
7.  **`nav_node`:** Begins publishing velocity commands to `/cmd_vel`.
8.  **`motor_node` (Sim):** Receives `/cmd_vel` messages -\> prints `[MOTOR_CTRL] Moving forward...`, `[MOTOR_CTRL] Turning left...`, etc.
9.  **Result:** The robot "moves" across the room (in simulation, visible in RViz2) and stops in front of the user.

## 6.0 Complete User Workflow (The Experience)

1.  **User Unboxing:** The user receives the robot.
2.  **First-Time Setup:** The user connects to the robot's temporary Wi-Fi hotspot via a **mobile app** (a separate project, likely in Flutter/React Native). The user provides their home Wi-Fi credentials.
3.  **First Interaction (Introduction):**
      * **User:** "Hello."
      * **Robot:** (Wakes up, looks at user) "Hello. I am Aura. What is your name?" (This is a `voice_node` (TTS) action).
      * **User:** "My name is Mia."
      * **Robot:** (NLP node extracts `intent: 'set_name', 'value: 'Mia'`). The `personality_node` saves this *locally*. "It's nice to meet you, Mia."
4.  **Daily Interaction (Proactive):**
      * Mia walks into the room.
      * **Robot:** (The `detect_node` sees a 'person'). It *already knows* this person's face (a more advanced `dnn_inference` model). It transitions to `state: 'greeting'`.
      * **Robot:** (Wheels turn, robot orients to face Mia. This is `nav_node` moving the robot). "Welcome home, Mia\!"
5.  **Daily Interaction (Reactive):**
      * **Mia:** "Hey Aura, let's play a game."
      * **Robot:** (NLP gets `intent: 'play_game'`). (Personality node checks its 'play' state). "Okay\! I will hide. You try to find me\!"
      * **Robot:** (Sends a navigation goal to a "hiding spot" it learned from its SLAM map). (Wheels move).
6.  **Idle State:**
      * The robot sits quietly, "sleeping" (display is off). It's still running its AI, but in a low-power "detection" mode, only looking for people or its name.

## 7.0 Testing & Validation Strategy

### 7.1 Unit Testing

  * **What:** Testing *each individual node* in isolation.
  * **Method:** We will use `pytest` for all Python nodes.
  * **Example:** A test for the `personality_node` that gives it a *fake* `/intent` message and asserts that it publishes the *correct* `/expression` message.

### 7.2 Integration Testing

  * **What:** Testing how the nodes work *together*.
  * **Method:** We will use `ros2 launch test`. This is a system that launches *all* our nodes, performs a series of actions (like publishing a "hello" audio file), and then checks for the *final* output (the TTS audio being played).
  * **Example:** We will write a test that:
    1.  Launches the entire stack.
    2.  Plays a `.wav` file of "Come here" into the `audio_node`.
    3.  Monitors the `/cmd_vel` topic.
    4.  The test *passes* if velocity commands are published within 2 seconds.

### 7.3 User Acceptance Testing (UAT)

  * **What:** Real-world testing (still on the laptop).
  * **Method:** You (and other testers) will simply interact with the simulation. You will talk to your laptop. You will move your laptop around the room.
  * **Goal:** You will find "bugs" in the *personality*, not just the code. (e.g., "The robot got annyoing and wouldn't be quiet," or "It didn't understand me when I said 'stop'"). This is where we refine the AI and the user experience.

## 8.0 Next Steps

This document provides the complete software blueprint. The immediate next step is to begin **Phase 4.1: Environment Setup**.

Once you have WSL, Ubuntu, and ROS 2 installed, the next task is **Phase 4.2**, specifically getting your laptop's camera to publish to a ROS 2 topic.

This is a massive, exciting, and professional-grade project. This development plan allows us to build the entire "soul" of your robot before spending a single rupee on the final, expensive hardware.

Would you like me to provide the specific, step-by-step terminal commands to begin **Phase 4.1** and **4.2** (setting up WSL, ROS 2, and the camera node)?