# Development Environment Setup Guide
**Document Type:** Implementation Guide  
**Version:** 1.0  
**Date:** November 3, 2025  
**Audience:** Developers, DevOps Engineers  
**Status:** Initial Draft  

---

## Document Metadata
- **Last Modified:** November 3, 2025
- **Document Owner:** DevOps Lead
- **Review Cycle:** Weekly
- **Dependencies:** `03_software_stack_v1.0.md`
- **Related Documents:** Implementation Guide, Testing Procedures

---

## Executive Summary for Non-Technical Stakeholders

This guide provides step-by-step instructions for setting up the complete development environment for Project Aura. The setup enables developers to build, test, and simulate the entire robot system on their local machines before deploying to hardware. This simulation-first approach significantly reduces development costs and accelerates the development cycle.

**Key Setup Components:**
- **WSL 2:** Linux environment on Windows for native development
- **ROS 2:** Robotics framework for component integration
- **Simulation Tools:** Complete robot simulation without hardware requirements
- **Development Tools:** IDE, debugging, and testing utilities

---

## 1.0 Prerequisites and System Requirements

### 1.1 Hardware Requirements

**Minimum System Specifications:**
- **CPU:** Intel i5-8th gen or AMD Ryzen 5 3600 (4+ cores)
- **RAM:** 16GB DDR4 (32GB recommended for AI development)
- **Storage:** 100GB free SSD space
- **GPU:** NVIDIA GTX 1060 or better (for AI model training/testing)
- **Network:** Stable internet connection for package downloads

**Recommended System Specifications:**
- **CPU:** Intel i7-10th gen or AMD Ryzen 7 5800X (8+ cores)
- **RAM:** 32GB DDR4
- **Storage:** 256GB free NVMe SSD space
- **GPU:** NVIDIA RTX 3060 or better with 8GB+ VRAM

### 1.2 Software Prerequisites

**Operating System:**
- **Windows 11:** Version 22H2 or later (required for WSL 2)
- **Windows 10:** Version 2004 or later (minimum for WSL 2 support)

**Required Software:**
- **Windows Terminal:** Modern terminal application
- **VS Code:** Primary development IDE
- **Git for Windows:** Version control system
- **Docker Desktop:** Container runtime (optional but recommended)

---

## 2.0 Phase 1: Windows Subsystem for Linux (WSL 2) Setup

### 2.1 WSL 2 Installation

**Step 1: Enable WSL Feature**
Open PowerShell as Administrator and run:
```powershell
# Enable WSL and Virtual Machine Platform
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer
Restart-Computer
```

**Step 2: Install WSL 2**
After restart, open PowerShell as Administrator:
```powershell
# Install WSL 2 with Ubuntu 22.04
wsl --install -d Ubuntu-22.04

# Set WSL 2 as default version
wsl --set-default-version 2
```

**Step 3: Verify Installation**
```powershell
# Check WSL version and distributions
wsl --list --verbose
wsl --status
```

### 2.2 Ubuntu 22.04 Configuration

**Step 1: Initial Setup**
Launch Ubuntu 22.04 from Start Menu and complete initial setup:
```bash
# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential build tools
sudo apt install -y \
    build-essential \
    cmake \
    git \
    curl \
    wget \
    vim \
    htop \
    tree \
    unzip
```

**Step 2: Configure Git**
```bash
# Set up Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

**Step 3: Install Python Development Tools**
```bash
# Install Python and development tools
sudo apt install -y \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    python-is-python3

# Upgrade pip
python -m pip install --upgrade pip
```

---

## 3.0 Phase 2: ROS 2 Humble Installation

### 3.1 ROS 2 Repository Setup

**Step 1: Add ROS 2 Repository**
```bash
# Set locale
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

# Add ROS 2 GPG key
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

# Add repository to sources list
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### 3.2 ROS 2 Package Installation

**Step 1: Install ROS 2 Desktop Full**
```bash
# Update package lists
sudo apt update

# Install ROS 2 Humble Desktop Full
sudo apt install -y ros-humble-desktop-full

# Install additional ROS 2 packages
sudo apt install -y \
    ros-humble-navigation2 \
    ros-humble-nav2-bringup \
    ros-humble-slam-toolbox \
    ros-humble-usb-cam \
    ros-humble-audio-common \
    ros-humble-teleop-twist-keyboard \
    ros-humble-rqt* \
    ros-humble-rviz2
```

**Step 2: Install Development Tools**
```bash
# Install colcon build tool
sudo apt install -y \
    python3-colcon-common-extensions \
    python3-rosdep \
    python3-vcstool

# Initialize rosdep
sudo rosdep init
rosdep update
```

### 3.3 Environment Configuration

**Step 1: Setup ROS 2 Environment**
```bash
# Add ROS 2 sourcing to bashrc
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc

# Create workspace directory
mkdir -p ~/aura_ws/src

# Source ROS 2 environment
source ~/.bashrc
```

**Step 2: Create Workspace**
```bash
# Navigate to workspace
cd ~/aura_ws

# Build workspace (initially empty)
colcon build

# Add workspace sourcing to bashrc
echo "source ~/aura_ws/install/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

---

## 4.0 Phase 3: Development Tools Installation

### 4.1 VS Code Setup

**Step 1: Install VS Code Extensions**
Install the following extensions in VS Code:
- **WSL** (ms-vscode-remote.remote-wsl)
- **ROS** (ms-iot.vscode-ros)
- **Python** (ms-python.python)
- **C/C++** (ms-vscode.cpptools)
- **CMake Tools** (ms-vscode.cmake-tools)
- **Docker** (ms-azuretools.vscode-docker)

**Step 2: Configure VS Code for WSL**
```bash
# Open VS Code in WSL context
code .
```

**Step 3: VS Code Settings for ROS 2**
Create `.vscode/settings.json` in workspace:
```json
{
    "python.defaultInterpreterPath": "/usr/bin/python3",
    "python.autoComplete.extraPaths": [
        "/opt/ros/humble/lib/python3.10/site-packages",
        "/opt/ros/humble/local/lib/python3.10/dist-packages"
    ],
    "python.analysis.extraPaths": [
        "/opt/ros/humble/lib/python3.10/site-packages",
        "/opt/ros/humble/local/lib/python3.10/dist-packages"
    ],
    "ros.distro": "humble",
    "cmake.configureOnOpen": false
}
```

### 4.2 Python Development Environment

**Step 1: Install Python Packages**
```bash
# Install essential Python packages
pip install \
    numpy \
    opencv-python \
    matplotlib \
    scipy \
    scikit-learn \
    pandas \
    jupyter \
    pytest \
    black \
    flake8 \
    mypy
```

**Step 2: Install AI/ML Libraries**
```bash
# Install machine learning libraries
pip install \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu \
    onnxruntime \
    transformers \
    datasets \
    accelerate
```

### 4.3 Computer Vision Setup

**Step 1: Install OpenCV with Contributions**
```bash
# Install OpenCV system dependencies
sudo apt install -y \
    libopencv-dev \
    python3-opencv

# Install Python OpenCV packages
pip install opencv-contrib-python
```

**Step 2: Test OpenCV Installation**
```python
# Test script: test_opencv.py
import cv2
import numpy as np

print(f"OpenCV version: {cv2.__version__}")

# Test camera access (if available)
cap = cv2.VideoCapture(0)
if cap.isOpened():
    print("Camera access successful")
    cap.release()
else:
    print("No camera detected (normal in WSL)")
```

---

## 5.0 Phase 4: Hardware Simulation Setup

### 5.1 USB Device Access (usbipd)

**Step 1: Install usbipd on Windows**
Open PowerShell as Administrator:
```powershell
# Install usbipd-win
winget install --interactive --exact dorssel.usbipd-win
```

**Step 2: Configure USB Device Sharing**
```powershell
# List available USB devices
usbipd wsl list

# Attach USB camera to WSL (replace BUSID with actual bus ID)
usbipd wsl attach --busid 1-1

# Verify device in WSL
wsl lsusb
```

### 5.2 Camera Node Setup

**Step 1: Install USB Camera Package**
```bash
# Install USB camera ROS 2 package
sudo apt install -y ros-humble-usb-cam

# Test camera node
ros2 run usb_cam usb_cam_node_exe
```

**Step 2: Verify Camera Stream**
```bash
# In another terminal, check camera topics
ros2 topic list | grep image

# View camera stream (if display available)
ros2 run rqt_image_view rqt_image_view
```

### 5.3 Audio System Setup

**Step 1: Install Audio Packages**
```bash
# Install audio system packages
sudo apt install -y \
    ros-humble-audio-common \
    pulseaudio \
    alsa-utils

# Configure PulseAudio for WSL
echo "export PULSE_RUNTIME_PATH=/mnt/wslg/PulseAudio" >> ~/.bashrc
source ~/.bashrc
```

**Step 2: Test Audio Capture**
```bash
# Test audio recording
arecord -l  # List audio devices
arecord -d 5 test.wav  # Record 5-second test

# Test ROS 2 audio node
ros2 run audio_common audio_capturer_node
```

---

## 6.0 Phase 5: Simulation Environment

### 6.1 Gazebo Simulation (Optional)

**Step 1: Install Gazebo**
```bash
# Install Gazebo for ROS 2
sudo apt install -y \
    ros-humble-gazebo-ros-pkgs \
    ros-humble-gazebo-ros2-control

# Test Gazebo installation
gazebo --version
```

**Step 2: Create Simple Robot Model**
```bash
# Create robot description package
cd ~/aura_ws/src
ros2 pkg create --build-type ament_cmake aura_description

# Build workspace
cd ~/aura_ws
colcon build --packages-select aura_description
```

### 6.2 RViz2 Visualization

**Step 1: Configure RViz2**
```bash
# Launch RViz2
rviz2

# Save configuration for project
# File -> Save Config As -> ~/aura_ws/src/aura_config.rviz
```

**Step 2: Create Launch File**
Create `~/aura_ws/src/aura_bringup/launch/simulation.launch.py`:
```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='rviz2',
            executable='rviz2',
            name='rviz2',
            arguments=['-d', '/path/to/aura_config.rviz']
        ),
    ])
```

---

## 7.0 Phase 6: Project Workspace Setup

### 7.1 Create Project Structure

**Step 1: Initialize Project Packages**
```bash
cd ~/aura_ws/src

# Create core packages
ros2 pkg create --build-type ament_python aura_core --dependencies rclpy std_msgs sensor_msgs geometry_msgs
ros2 pkg create --build-type ament_python aura_sensors --dependencies rclpy sensor_msgs
ros2 pkg create --build-type ament_python aura_actuators --dependencies rclpy geometry_msgs
ros2 pkg create --build-type ament_cmake aura_description
ros2 pkg create --build-type ament_python aura_bringup --dependencies rclpy
```

**Step 2: Build Initial Workspace**
```bash
cd ~/aura_ws
colcon build
source install/setup.bash
```

### 7.2 Version Control Setup

**Step 1: Initialize Git Repository**
```bash
cd ~/aura_ws

# Initialize git repository
git init
git remote add origin https://github.com/your-username/aura-robot.git

# Create .gitignore
cat > .gitignore << EOF
# ROS 2 build artifacts
build/
install/
log/

# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF
```

**Step 2: Initial Commit**
```bash
git add .
git commit -m "Initial project setup"
git push -u origin main
```

---

## 8.0 Testing and Verification

### 8.1 System Verification Tests

**Step 1: ROS 2 Installation Test**
```bash
# Test ROS 2 installation
ros2 doctor

# Test node communication
ros2 run demo_nodes_cpp talker &
ros2 run demo_nodes_py listener
```

**Step 2: Camera System Test**
```bash
# Test camera access
ros2 run usb_cam usb_cam_node_exe &
ros2 topic echo /image_raw --once
```

**Step 3: Build System Test**
```bash
# Test workspace build
cd ~/aura_ws
colcon build --symlink-install
colcon test
```

### 8.2 Performance Verification

**Step 1: System Resource Check**
```bash
# Check system resources
htop
free -h
df -h

# Check ROS 2 performance
ros2 topic hz /image_raw
ros2 topic bw /image_raw
```

**Step 2: Network Connectivity Test**
```bash
# Test network connectivity
ping google.com
curl -I https://packages.ros.org

# Test WSL networking
ip addr show
```

---

## 9.0 Troubleshooting Guide

### 9.1 Common WSL Issues

**Issue: WSL 2 not starting**
```powershell
# Check WSL status
wsl --status

# Restart WSL service
wsl --shutdown
wsl
```

**Issue: USB device not accessible**
```powershell
# Detach and reattach USB device
usbipd wsl detach --busid 1-1
usbipd wsl attach --busid 1-1
```

### 9.2 ROS 2 Issues

**Issue: Package not found**
```bash
# Source ROS 2 environment
source /opt/ros/humble/setup.bash
source ~/aura_ws/install/setup.bash

# Rebuild workspace
cd ~/aura_ws
colcon build --symlink-install
```

**Issue: Camera node fails**
```bash
# Check camera permissions
ls -la /dev/video*
sudo chmod 666 /dev/video0

# Check USB devices
lsusb | grep -i camera
```

### 9.3 Performance Issues

**Issue: Slow build times**
```bash
# Use parallel builds
colcon build --parallel-workers 4

# Use symlink install for faster iteration
colcon build --symlink-install
```

**Issue: High memory usage**
```bash
# Monitor memory usage
free -h
ps aux --sort=-%mem | head

# Limit parallel processes
export MAKEFLAGS="-j2"
```

---

## 10.0 Next Steps

### 10.1 Development Workflow

**Daily Development Process:**
1. Start WSL 2 and navigate to workspace
2. Source ROS 2 environment
3. Pull latest changes from repository
4. Build and test changes
5. Commit and push updates

**Recommended Development Practices:**
- Use feature branches for new development
- Write unit tests for all new code
- Document code changes and API updates
- Regular integration testing with full system

### 10.2 Advanced Setup (Optional)

**Docker Development Environment:**
```bash
# Install Docker in WSL 2
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Remote Development:**
- Configure SSH access for remote development
- Set up VS Code remote development
- Configure automated testing and deployment

---

## 11.0 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 3, 2025 | Initial development setup guide | DevOps Lead |

---

## 12.0 Setup Checklist

**Phase 1: WSL 2 Setup**
- [ ] WSL 2 installed and configured
- [ ] Ubuntu 22.04 running successfully
- [ ] Basic development tools installed
- [ ] Git configured with user credentials

**Phase 2: ROS 2 Installation**
- [ ] ROS 2 Humble installed
- [ ] Additional ROS 2 packages installed
- [ ] Workspace created and building
- [ ] Environment variables configured

**Phase 3: Development Tools**
- [ ] VS Code with extensions installed
- [ ] Python development environment ready
- [ ] OpenCV and AI libraries installed
- [ ] Project workspace configured

**Phase 4: Hardware Simulation**
- [ ] USB device sharing configured
- [ ] Camera node functional
- [ ] Audio system operational
- [ ] Basic simulation running

**Phase 5: Project Setup**
- [ ] Project packages created
- [ ] Version control initialized
- [ ] Build system verified
- [ ] Testing framework operational

---

*This guide provides complete setup instructions for Project Aura development environment. For implementation details and next development steps, refer to the Implementation Guide documentation.*