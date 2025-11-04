# Windows 11 Development Guide

## Development Environment Overview

### Phase 1: Windows 11 PC Development
**Your Development Machine:** Windows 11 PC/Laptop
- **Language:** Python 3.10+ for AI development and simulation
- **IDE:** Visual Studio Code with Python extensions
- **Hardware:** Your laptop's webcam, microphone, and speakers
- **Purpose:** Develop and test 100% of AI functionality before buying robot hardware

### Phase 2: Robot Hardware OS
**Robot's Operating System:** FreeRTOS (Real-Time Operating System)
- **Platform:** ESP32-S3-EYE runs FreeRTOS (built into ESP-IDF)
- **Language:** C++ (Arduino framework) for final robot code
- **Memory:** 512KB SRAM + 8MB PSRAM + 16MB Flash
- **Purpose:** Real-time robot operation with AI processing

## Windows 11 Setup Process

### Step 1: Install Python Development Environment
```powershell
# Open PowerShell as Administrator
# Install Python 3.11 (recommended for Windows 11)
winget install Python.Python.3.11

# Verify installation
python --version
pip --version

# Install Windows-specific dependencies
pip install pyaudio-windows-binaries
```

### Step 2: Install Visual Studio Code
```powershell
# Install VS Code
winget install Microsoft.VisualStudioCode

# Install Git for version control
winget install Git.Git
```

### Step 3: Windows-Specific Library Installation
```powershell
# Create project directory
mkdir C:\AibiRobot
cd C:\AibiRobot

# Create virtual environment
python -m venv aibi_env

# Activate environment (Windows)
aibi_env\Scripts\activate

# Install Windows-compatible versions
pip install opencv-python==4.8.1.78
pip install face-recognition==1.3.0
pip install sounddevice==0.4.6
pip install soundfile==0.12.1

# Windows-specific audio library
pip install pyaudio==0.2.11

# Google Cloud libraries
pip install google-cloud-speech==2.21.0
pip install google-cloud-texttospeech==2.16.3
pip install google-generativeai==0.3.2

# Utility libraries
pip install requests==2.31.0
pip install numpy==1.24.3
pip install matplotlib==3.7.2
```

### Step 4: Hardware Testing on Windows
```python
# test_windows_hardware.py
import cv2
import sounddevice as sd
import numpy as np
import platform

def test_windows_compatibility():
    print(f"🖥️ Running on: {platform.system()} {platform.release()}")
    print(f"🐍 Python version: {platform.python_version()}")
    
    # Test camera
    print("\n📷 Testing camera...")
    cap = cv2.VideoCapture(0)  # Try default camera
    if cap.isOpened():
        ret, frame = cap.read()
        if ret:
            print("✅ Camera working!")
            cv2.imshow('Windows Camera Test', frame)
            cv2.waitKey(2000)
            cv2.destroyAllWindows()
        cap.release()
    else:
        print("❌ Camera not found")
    
    # Test microphone
    print("\n🎤 Testing microphone...")
    try:
        print("Recording 3 seconds...")
        audio = sd.rec(int(3 * 16000), samplerate=16000, channels=1)
        sd.wait()
        if np.max(np.abs(audio)) > 0.01:
            print("✅ Microphone working!")
        else:
            print("⚠️ Microphone not detecting sound")
    except Exception as e:
        print(f"❌ Microphone error: {e}")
    
    # Test speakers
    print("\n🔊 Testing speakers...")
    try:
        duration = 1
        sample_rate = 16000
        frequency = 440
        t = np.linspace(0, duration, int(sample_rate * duration))
        tone = 0.3 * np.sin(2 * np.pi * frequency * t)
        sd.play(tone, sample_rate)
        sd.wait()
        print("✅ Speakers working!")
    except Exception as e:
        print(f"❌ Speaker error: {e}")

if __name__ == "__main__":
    test_windows_compatibility()
```

## Robot Operating System Details

### ESP32-S3 FreeRTOS Architecture
```cpp
// Robot runs on FreeRTOS with these tasks:
void setup() {
    // Initialize hardware
    initCamera();
    initMicrophone();
    initOLED();
    initWiFi();
    
    // Create FreeRTOS tasks
    xTaskCreate(cameraTask, "Camera", 8192, NULL, 2, NULL);
    xTaskCreate(audioTask, "Audio", 4096, NULL, 2, NULL);
    xTaskCreate(aiTask, "AI", 8192, NULL, 1, NULL);
    xTaskCreate(displayTask, "Display", 2048, NULL, 1, NULL);
}

void loop() {
    // Main loop handles system monitoring
    vTaskDelay(pdMS_TO_TICKS(100));
}
```

### Memory Management on Robot
- **Program Storage:** 16MB Flash (stores your C++ code)
- **Runtime Memory:** 512KB SRAM (fast access for running code)
- **AI Models:** 8MB PSRAM (stores face recognition models)
- **Operating System:** FreeRTOS (real-time multitasking)

## Development Workflow: Windows → Robot

### Phase 1: Windows Development
1. **Develop in Python** on your Windows 11 PC
2. **Test with laptop hardware** (camera, mic, speakers)
3. **Perfect AI algorithms** and personality engine
4. **Train face recognition** models
5. **Validate complete system** before hardware purchase

### Phase 2: Code Translation
1. **Install Arduino IDE** on Windows 11
2. **Add ESP32-S3 board support** to Arduino IDE
3. **Translate Python logic** to C++ Arduino code
4. **Test on ESP32-S3-EYE** hardware
5. **Deploy final firmware** to robot

### Windows 11 Advantages for This Project
- **Excellent Python support** with latest libraries
- **Visual Studio Code** with best-in-class debugging
- **Windows Subsystem for Linux (WSL)** if needed for Linux tools
- **Arduino IDE** runs perfectly on Windows 11
- **Google Cloud SDK** fully supported on Windows
- **All development tools** available and well-supported

## Troubleshooting Windows-Specific Issues

### Common Windows 11 Issues & Solutions
```powershell
# If camera access denied
# Go to Settings > Privacy & Security > Camera
# Enable "Camera access" and "Let apps access your camera"

# If microphone access denied  
# Go to Settings > Privacy & Security > Microphone
# Enable "Microphone access" and "Let apps access your microphone"

# If Python packages fail to install
# Install Microsoft C++ Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools

# If OpenCV doesn't work
pip uninstall opencv-python
pip install opencv-python-headless==4.8.1.78
```

### Windows Firewall Configuration
```powershell
# Allow Python through Windows Firewall (for Google APIs)
netsh advfirewall firewall add rule name="Python" dir=in action=allow program="C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe"
```

## Summary

**✅ Windows 11 is Perfect for This Project:**
- Complete development environment available
- All required libraries work excellently
- Visual Studio Code provides best development experience
- Easy transition from Python development to Arduino C++ deployment
- Robot runs on FreeRTOS (embedded real-time OS), not Windows

**Development Flow:**
1. **Windows 11 PC:** Develop AI in Python
2. **ESP32-S3-EYE Robot:** Deploy as C++ firmware running on FreeRTOS
3. **No Linux required:** Everything works natively on Windows 11