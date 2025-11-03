# Implementation Guide - Phase-by-Phase Development
**Document Type:** Implementation Guide  
**Version:** 1.0  
**Date:** November 3, 2025  
**Audience:** Developers, Technical Teams  
**Status:** Initial Draft  

---

## Document Metadata
- **Last Modified:** November 3, 2025
- **Document Owner:** Technical Lead
- **Review Cycle:** Weekly
- **Dependencies:** `04_development_setup_v1.0.md`
- **Related Documents:** Technical Architecture, Software Stack, Testing Procedures

---

## Executive Summary for Non-Technical Stakeholders

This guide provides detailed step-by-step instructions for building Project Aura's AI companion robot software. The implementation follows a phase-by-phase approach, starting with basic sensor integration and progressing to advanced AI capabilities. Each phase builds upon the previous one, ensuring a solid foundation before adding complexity.

**Implementation Strategy:**
- **Incremental Complexity:** Start simple, add advanced features progressively
- **Continuous Testing:** Testing at every development stage
- **Simulation-First:** Complete software testing without hardware requirements
- **Clear Milestones:** Each phase has specific deliverables and success criteria

---

## 1.0 Implementation Overview

### 1.1 Development Phases

**Phase 1: Basic Sensor Integration**
- Establish ROS 2 node communication
- Implement camera, audio, and mock sensors
- Basic data acquisition and publishing
- Visualization and monitoring tools

**Phase 2: Core AI Implementation**
- Computer vision processing with YOLO
- Natural language processing with spaCy
- Speech recognition and synthesis
- AI processing pipeline integration

**Phase 3: Personality Engine Development**
- State machine implementation
- Behavior coordination and decision logic
- Response generation system
- Emotion and interaction management

**Phase 4: Navigation and Movement**
- SLAM implementation for mapping
- Path planning and navigation
- Motor control and movement coordination
- Personality-navigation integration

**Phase 5: System Integration and Testing**
- Complete system launch files
- Performance monitoring and optimization
- Comprehensive testing framework
- Hardware deployment preparation
#
## 1.2 Success Criteria

**Functional Requirements:**
- All core features working as specified
- Seamless integration between components
- Meeting performance and accuracy targets
- Proper error handling and recovery

**Performance Requirements:**
- Sub-1-second response latency for interactions
- Resource usage within hardware limits
- Real-time processing capabilities
- Stable operation under load

**Integration Requirements:**
- Clean component interfaces and APIs
- Comprehensive test coverage (>80%)
- Scalable and maintainable architecture
- Complete documentation and examples

---

## 2.0 Phase 1: Basic Sensor Integration

### 2.1 Objectives and Deliverables

**Primary Objectives:**
- Establish ROS 2 node communication framework
- Implement sensor data acquisition nodes
- Create mock sensors for development
- Set up visualization and monitoring tools

**Deliverables:**
- Camera node with image publishing
- Audio node with real-time capture
- Touch and IMU mock sensor nodes
- System launch files and monitoring tools

### 2.2 Camera Node Implementation

**Step 1: Create Sensor Package**
```bash
cd ~/aura_ws/src
ros2 pkg create --build-type ament_python aura_sensors --dependencies rclpy sensor_msgs cv_bridge std_msgs
```

**Step 2: Implement Camera Node**
Create `aura_sensors/aura_sensors/camera_node.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import cv2
import numpy as np
from sensor_msgs.msg import Image
from cv_bridge import CvBridge

class CameraNode(Node):
    def __init__(self):
        super().__init__('camera_node')
        
        # CV Bridge for image conversion
        self.bridge = CvBridge()
        
        # Setup Camera
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            self.get_logger().warn("Failed to open camera - using mock data")
            self.cap = None
        
        # Publishers
        self.image_publisher = self.create_publisher(Image, '/camera/image_raw', 10)
        
        # Timer for image capture (30 FPS)
        self.timer = self.create_timer(0.033, self.capture_and_publish)
        
        self.get_logger().info("Camera node initialized")
    
    def capture_and_publish(self):
        """Capture and publish image"""
        if self.cap and self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret:
                image_msg = self.bridge.cv2_to_imgmsg(frame, encoding='bgr8')
                image_msg.header.stamp = self.get_clock().now().to_msg()
                image_msg.header.frame_id = 'camera_frame'
                self.image_publisher.publish(image_msg)
        else:
            # Generate mock image data for development
            mock_image = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(mock_image, 'MOCK CAMERA', (200, 240), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            
            image_msg = self.bridge.cv2_to_imgmsg(mock_image, encoding='bgr8')
            image_msg.header.stamp = self.get_clock().now().to_msg()
            image_msg.header.frame_id = 'camera_frame'
            self.image_publisher.publish(image_msg)
    
    def destroy_node(self):
        if self.cap and self.cap.isOpened():
            self.cap.release()
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    camera_node = CameraNode()
    
    try:
        rclpy.spin(camera_node)
    except KeyboardInterrupt:
        pass
    finally:
        camera_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```#
## 2.3 Audio Node Implementation

**Step 1: Install Audio Dependencies**
```bash
# Install audio processing libraries
pip install sounddevice numpy wave
sudo apt install -y pulseaudio alsa-utils
```

**Step 2: Implement Audio Node**
Create `aura_sensors/aura_sensors/audio_node.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import sounddevice as sd
import numpy as np
import threading
import queue
from audio_common_msgs.msg import AudioData
from std_msgs.msg import String

class AudioNode(Node):
    def __init__(self):
        super().__init__('audio_node')
        
        # Audio configuration
        self.sample_rate = 16000
        self.channels = 1
        self.chunk_size = 1024
        
        # Audio processing queue
        self.audio_queue = queue.Queue()
        
        # Publishers
        self.audio_publisher = self.create_publisher(AudioData, '/audio/raw', 10)
        
        # Timer for publishing audio data
        self.timer = self.create_timer(0.1, self.publish_audio)  # 10 Hz
        
        # Start audio capture thread
        self.audio_thread = threading.Thread(target=self.audio_capture_thread)
        self.audio_thread.daemon = True
        self.audio_thread.start()
        
        self.get_logger().info("Audio node initialized")
    
    def audio_capture_thread(self):
        """Continuous audio capture in separate thread"""
        try:
            with sd.InputStream(
                samplerate=self.sample_rate,
                channels=self.channels,
                blocksize=self.chunk_size,
                callback=self.audio_callback
            ):
                # Keep thread alive
                while rclpy.ok():
                    sd.sleep(100)
        except Exception as e:
            self.get_logger().error(f"Audio capture error: {e}")
    
    def audio_callback(self, indata, frames, time, status):
        """Audio callback for continuous capture"""
        if status:
            self.get_logger().warn(f"Audio callback status: {status}")
        
        # Convert to int16 and add to queue
        audio_data = (indata[:, 0] * 32767).astype(np.int16)
        self.audio_queue.put(audio_data.tobytes())
    
    def publish_audio(self):
        """Publish accumulated audio data"""
        if not self.audio_queue.empty():
            # Get all available audio chunks
            audio_chunks = []
            while not self.audio_queue.empty():
                try:
                    chunk = self.audio_queue.get_nowait()
                    audio_chunks.append(chunk)
                except queue.Empty:
                    break
            
            # Combine chunks and publish
            if audio_chunks:
                combined_audio = b''.join(audio_chunks)
                audio_msg = AudioData()
                audio_msg.data = list(combined_audio)
                self.audio_publisher.publish(audio_msg)

def main(args=None):
    rclpy.init(args=args)
    audio_node = AudioNode()
    
    try:
        rclpy.spin(audio_node)
    except KeyboardInterrupt:
        pass
    finally:
        audio_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 2.4 Mock Sensor Nodes

**Step 1: IMU Mock Node**
Create `aura_sensors/aura_sensors/imu_node.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import math
import random
from sensor_msgs.msg import Imu

class IMUNode(Node):
    def __init__(self):
        super().__init__('imu_node')
        
        # Internal state variables
        self.time_counter = 0.0
        
        # Publisher for IMU data
        self.imu_publisher = self.create_publisher(Imu, '/sensors/imu', 10)
        
        # Timer for IMU data publication (10 Hz)
        self.timer = self.create_timer(0.1, self.publish_imu_data)
        
        self.get_logger().info("IMU node initialized (simulation mode)")
    
    def publish_imu_data(self):
        """Publish simulated IMU data"""
        imu_msg = Imu()
        
        # Header
        imu_msg.header.stamp = self.get_clock().now().to_msg()
        imu_msg.header.frame_id = 'imu_frame'
        
        # Simulate gentle swaying motion (quaternion orientation)
        roll = 0.1 * math.sin(self.time_counter * 0.5)
        pitch = 0.05 * math.cos(self.time_counter * 0.3)
        yaw = 0.02 * math.sin(self.time_counter * 0.2)
        
        # Convert to quaternion (simplified)
        imu_msg.orientation.x = roll
        imu_msg.orientation.y = pitch
        imu_msg.orientation.z = yaw
        imu_msg.orientation.w = 1.0
        
        # Linear acceleration (m/s²)
        imu_msg.linear_acceleration.x = random.gauss(0, 0.1)
        imu_msg.linear_acceleration.y = random.gauss(0, 0.1)
        imu_msg.linear_acceleration.z = 9.81 + random.gauss(0, 0.1)  # Gravity + noise
        
        # Angular velocity (rad/s)
        imu_msg.angular_velocity.x = random.gauss(0, 0.01)
        imu_msg.angular_velocity.y = random.gauss(0, 0.01)
        imu_msg.angular_velocity.z = random.gauss(0, 0.01)
        
        self.imu_publisher.publish(imu_msg)
        self.time_counter += 0.1

def main(args=None):
    rclpy.init(args=args)
    imu_node = IMUNode()
    
    try:
        rclpy.spin(imu_node)
    except KeyboardInterrupt:
        pass
    finally:
        imu_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```*
*Step 2: Touch Sensor Mock Node**
Create `aura_sensors/aura_sensors/touch_node.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import random
from std_msgs.msg import String

class TouchNode(Node):
    def __init__(self):
        super().__init__('touch_node')
        
        # Touch sensor locations
        self.touch_locations = ['head', 'back', 'belly', 'side']
        
        # Publisher for touch events
        self.touch_publisher = self.create_publisher(String, '/sensors/touch', 10)
        
        # Timer for simulating random touch events
        self.timer = self.create_timer(5.0, self.simulate_touch)
        
        self.get_logger().info("Touch node initialized (simulation mode)")
    
    def simulate_touch(self):
        """Simulate random touch events"""
        # 30% chance of touch event
        if random.random() < 0.3:
            location = random.choice(self.touch_locations)
            
            touch_msg = String()
            touch_msg.data = f"touch_{location}"
            
            self.touch_publisher.publish(touch_msg)
            self.get_logger().info(f"Simulated touch: {location}")

def main(args=None):
    rclpy.init(args=args)
    touch_node = TouchNode()
    
    try:
        rclpy.spin(touch_node)
    except KeyboardInterrupt:
        pass
    finally:
        touch_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 2.5 Package Configuration

**Step 1: Update Package Configuration**
Update `aura_sensors/setup.py`:
```python
from setuptools import setup

package_name = 'aura_sensors'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        ('share/' + package_name + '/launch', ['launch/sensors.launch.py']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Aura Team',
    maintainer_email='aura-robot.team@example.com',
    description='Sensor nodes for Aura robot',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'camera_node = aura_sensors.camera_node:main',
            'audio_node = aura_sensors.audio_node:main',
            'imu_node = aura_sensors.imu_node:main',
            'touch_node = aura_sensors.touch_node:main',
        ],
    },
)
```

**Step 2: Create Launch File**
Create `aura_sensors/launch/sensors.launch.py`:
```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # Sensor nodes
        Node(
            package='aura_sensors',
            executable='camera_node',
            name='camera_node',
            output='screen'
        ),
        Node(
            package='aura_sensors',
            executable='audio_node',
            name='audio_node',
            output='screen'
        ),
        Node(
            package='aura_sensors',
            executable='imu_node',
            name='imu_node',
            output='screen'
        ),
        Node(
            package='aura_sensors',
            executable='touch_node',
            name='touch_node',
            output='screen'
        ),
    ])
```

### 2.6 Build and Test Phase 1

**Step 1: Build Package**
```bash
cd ~/aura_ws
colcon build --packages-select aura_sensors
source install/setup.bash
```

**Step 2: Test Individual Nodes**
```bash
# Terminal 1: Camera node
ros2 run aura_sensors camera_node

# Terminal 2: Audio node
ros2 run aura_sensors audio_node

# Terminal 3: Touch node
ros2 run aura_sensors touch_node

# Terminal 4: IMU node
ros2 run aura_sensors imu_node

# Terminal 5: Monitor topics
ros2 topic list
ros2 topic echo /camera/image_raw --once
ros2 topic echo /sensors/touch
```

**Step 3: Launch System**
```bash
ros2 launch aura_sensors sensors.launch.py
```

---

## 3.0 Phase 2: Core AI Implementation

### 3.1 Objectives and Deliverables

**Primary Objectives:**
- Implement computer vision processing
- Create natural language processing pipeline
- Add speech recognition and synthesis
- Integrate AI processing components

**Deliverables:**
- Object detection with YOLO
- NLP processor with intent recognition
- Speech-to-text and text-to-speech nodes
- AI processing pipeline integration### 3.2 Co
mputer Vision Processing

**Step 1: Install Vision Dependencies**
```bash
# Install computer vision libraries
pip install ultralytics  # YOLOv8
pip install opencv-python
pip install pillow
```

**Step 2: Create AI Package**
```bash
cd ~/aura_ws/src
ros2 pkg create --build-type ament_python aura_ai --dependencies rclpy sensor_msgs std_msgs cv_bridge
```

**Step 3: Implement Vision Processor**
Create `aura_ai/aura_ai/vision_processor.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import cv2
import json
import numpy as np
from ultralytics import YOLO
from cv_bridge import CvBridge
from sensor_msgs.msg import Image
from std_msgs.msg import String

class VisionProcessor(Node):
    def __init__(self):
        super().__init__('vision_processor')
        
        # CV Bridge
        self.bridge = CvBridge()
        
        # Load YOLO model
        try:
            self.model = YOLO('yolov8n.pt')  # Nano model for speed
            self.get_logger().info("YOLO model loaded successfully")
        except Exception as e:
            self.get_logger().error(f"Failed to load YOLO model: {e}")
            self.model = None
        
        # Detection parameters
        self.confidence_threshold = 0.5
        self.target_classes = ['person', 'cat', 'dog', 'bottle', 'cup']
        
        # Publishers
        self.detection_publisher = self.create_publisher(String, '/ai/detected_objects', 10)
        self.annotated_image_publisher = self.create_publisher(Image, '/ai/annotated_image', 10)
        
        # Subscribers
        self.image_subscription = self.create_subscription(
            Image, '/camera/image_raw', self.image_callback, 10
        )
        
        self.get_logger().info("Vision processor initialized")
    
    def image_callback(self, msg):
        """Process incoming images"""
        if self.model is None:
            return
        
        try:
            # Convert ROS image to OpenCV
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            
            # Run inference
            results = self.model(cv_image, conf=self.confidence_threshold)
            
            # Process detections
            detections = []
            annotated_image = cv_image.copy()
            
            if results[0].boxes is not None:
                for box in results[0].boxes:
                    # Get detection info
                    class_id = int(box.cls[0])
                    class_name = self.model.names[class_id]
                    confidence = float(box.conf[0])
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    
                    # Filter by target classes
                    if class_name in self.target_classes:
                        # Create detection object
                        detection = {
                            'class': class_name,
                            'confidence': confidence,
                            'bbox': {
                                'x1': int(x1), 'y1': int(y1),
                                'x2': int(x2), 'y2': int(y2)
                            },
                            'center': {
                                'x': int((x1 + x2) / 2),
                                'y': int((y1 + y2) / 2)
                            }
                        }
                        detections.append(detection)
                        
                        # Draw bounding box
                        cv2.rectangle(annotated_image, 
                                    (int(x1), int(y1)), (int(x2), int(y2)), 
                                    (0, 255, 0), 2)
                        
                        # Draw label
                        label = f"{class_name}: {confidence:.2f}"
                        cv2.putText(annotated_image, label, 
                                  (int(x1), int(y1) - 10), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            # Publish detections
            if detections:
                detection_msg = String()
                detection_msg.data = json.dumps(detections)
                self.detection_publisher.publish(detection_msg)
                
                self.get_logger().info(f"Detected {len(detections)} objects")
            
            # Publish annotated image
            annotated_msg = self.bridge.cv2_to_imgmsg(annotated_image, encoding='bgr8')
            annotated_msg.header = msg.header
            self.annotated_image_publisher.publish(annotated_msg)
            
        except Exception as e:
            self.get_logger().error(f"Vision processing error: {e}")

def main(args=None):
    rclpy.init(args=args)
    vision_processor = VisionProcessor()
    
    try:
        rclpy.spin(vision_processor)
    except KeyboardInterrupt:
        pass
    finally:
        vision_processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 3.3 Natural Language Processing

**Step 1: Install NLP Dependencies**
```bash
# Install spaCy and language model
pip install spacy
python -m spacy download en_core_web_sm

# Install additional NLP libraries
pip install textblob nltk
```

**Step 2: Implement NLP Processor**
Create `aura_ai/aura_ai/nlp_processor.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import spacy
import re
import json
from std_msgs.msg import String

class NLPProcessor(Node):
    def __init__(self):
        super().__init__('nlp_processor')
        
        # Load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.get_logger().info("spaCy model loaded successfully")
        except Exception as e:
            self.get_logger().error(f"Failed to load spaCy model: {e}")
            self.nlp = None
        
        # Define intent patterns
        self.intent_patterns = {
            'greeting': [
                r'\b(hello|hi|hey|good morning|good afternoon)\b',
                r'\b(how are you)\b'
            ],
            'play_request': [
                r'\b(play|game|fun|let\'s play)\b',
                r'\bwant to play\b'
            ],
            'movement_command': [
                r'\b(come here|come to me|follow me)\b',
                r'\b(go to|move to|walk to)\b'
            ],
            'affection': [
                r'\b(love you|like you|good (boy|girl|robot))\b',
                r'\b(cute|adorable|sweet)\b'
            ],
            'question': [
                r'\b(what (is|are|do|does)|how (do|does))\b',
                r'\bwhy\b'
            ],
            'stop_command': [
                r'\b(stop|halt|wait|pause|that\'s enough)\b'
            ]
        }
        
        # Publishers
        self.intent_publisher = self.create_publisher(String, '/ai/intent', 10)
        
        # Subscribers
        self.transcript_subscription = self.create_subscription(
            String, '/ai/speech_transcript', self.transcript_callback, 10
        )
        
        self.get_logger().info("NLP processor initialized")
    
    def transcript_callback(self, msg):
        """Process speech transcript for intent detection"""
        text = msg.data.strip()
        
        if not text:
            return
        
        try:
            # Detect intent using pattern matching
            intent = self.detect_intent(text)
            
            # Extract entities (simplified)
            entities = []
            if self.nlp:
                doc = self.nlp(text)
                for ent in doc.ents:
                    entities.append({
                        'text': ent.text,
                        'label': ent.label_,
                        'description': spacy.explain(ent.label_)
                    })
            
            # Analyze sentiment (simple approach)
            sentiment = self.analyze_sentiment(doc) if self.nlp else 'neutral'
            
            # Create intent message
            intent_data = {
                'text': text,
                'intent': intent,
                'entities': entities,
                'sentiment': sentiment,
                'timestamp': self.get_clock().now().to_msg()
            }
            
            intent_msg = String()
            intent_msg.data = json.dumps(intent_data)
            self.intent_publisher.publish(intent_msg)
            
            self.get_logger().info(f"Intent detected: {intent} for text: '{text}'")
            
        except Exception as e:
            self.get_logger().error(f"NLP processing error: {e}")
    
    def detect_intent(self, text: str) -> str:
        """Detect intent using pattern matching"""
        text_lower = text.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    return intent
        
        return 'unknown'
    
    def analyze_sentiment(self, doc) -> str:
        """Simple sentiment analysis"""
        positive_words = ['good', 'great', 'love', 'like', 'happy', 'fun', 'nice', 'cute']
        negative_words = ['bad', 'hate', 'sad', 'angry', 'stop', 'no', 'don\'t']
        
        text_lower = doc.text.lower()
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'

def main(args=None):
    rclpy.init(args=args)
    nlp_processor = NLPProcessor()
    
    try:
        rclpy.spin(nlp_processor)
    except KeyboardInterrupt:
        pass
    finally:
        nlp_processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```##
# 3.4 Speech Processing

**Step 1: Install Speech Dependencies**
```bash
# Install Whisper for speech recognition
pip install openai-whisper

# Install pyttsx3 for text-to-speech
pip install pyttsx3

# Install additional audio libraries
pip install librosa soundfile
```

**Step 2: Implement Speech-to-Text Processor**
Create `aura_ai/aura_ai/speech_processor.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import whisper
import numpy as np
import threading
import queue
import wave
import io
from audio_common_msgs.msg import AudioData
from std_msgs.msg import String

class SpeechProcessor(Node):
    def __init__(self):
        super().__init__('speech_processor')
        
        # Load Whisper model
        try:
            self.model = whisper.load_model("base")  # Nano model for speed
            self.get_logger().info("Whisper model loaded successfully")
        except Exception as e:
            self.get_logger().error(f"Failed to load Whisper model: {e}")
            self.model = None
        
        # Audio processing parameters
        self.sample_rate = 16000
        self.buffer_duration = 3.0  # Process every 3 seconds
        self.max_buffer_size = int(self.sample_rate * self.buffer_duration)
        
        # Audio buffer
        self.audio_buffer = []
        
        # Processing queue for thread-safe processing
        self.processing_queue = queue.Queue()
        
        # Start processing thread
        self.processing_thread = threading.Thread(target=self.process_audio_thread)
        self.processing_thread.daemon = True
        self.processing_thread.start()
        
        # Publishers
        self.transcript_publisher = self.create_publisher(String, '/ai/speech_transcript', 10)
        
        # Subscribers
        self.audio_subscription = self.create_subscription(
            AudioData, '/audio/raw', self.audio_callback, 10
        )
        
        self.get_logger().info("Speech processor initialized")
    
    def audio_callback(self, msg):
        """Accumulate audio data for processing"""
        if self.model is None:
            return
        
        try:
            # Convert audio data to numpy array
            audio_data = np.frombuffer(bytes(msg.data), dtype=np.int16)
            
            # Add to buffer
            self.audio_buffer.extend(audio_data)
            
            # Process when buffer is full
            if len(self.audio_buffer) >= self.max_buffer_size:
                # Copy buffer for processing
                audio_chunk = np.array(self.audio_buffer[:self.max_buffer_size])
                
                # Add to processing queue
                self.processing_queue.put(audio_chunk)
                
                # Keep overlap for continuity
                overlap_size = self.max_buffer_size // 2
                self.audio_buffer = self.audio_buffer[self.max_buffer_size - overlap_size:]
                
        except Exception as e:
            self.get_logger().error(f"Audio processing error: {e}")
    
    def process_audio_thread(self):
        """Process audio in separate thread"""
        while rclpy.ok():
            try:
                # Get audio chunk from queue (blocking)
                audio_chunk = self.processing_queue.get(timeout=1.0)
                
                # Normalize audio
                audio_float = audio_chunk.astype(np.float32) / 32768.0
                
                # Transcribe with Whisper
                result = self.model.transcribe(audio_float, language='en')
                transcript = result['text'].strip()
                
                # Publish transcript if not empty
                if transcript and len(transcript) > 3:
                    transcript_msg = String()
                    transcript_msg.data = transcript
                    self.transcript_publisher.publish(transcript_msg)
                    
                    self.get_logger().info(f"Transcribed: {transcript}")
                    
            except queue.Empty:
                continue
            except Exception as e:
                self.get_logger().error(f"Speech processing error: {e}")

def main(args=None):
    rclpy.init(args=args)
    speech_processor = SpeechProcessor()
    
    try:
        rclpy.spin(speech_processor)
    except KeyboardInterrupt:
        pass
    finally:
        speech_processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Step 3: Implement Text-to-Speech Processor**
Create `aura_ai/aura_ai/tts_processor.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import pyttsx3
import threading
import queue
from std_msgs.msg import String

class TTSProcessor(Node):
    def __init__(self):
        super().__init__('tts_processor')
        
        # Initialize TTS engine
        try:
            self.tts_engine = pyttsx3.init()
            
            # Configure voice properties
            voices = self.tts_engine.getProperty('voices')
            if voices:
                # Use first available voice
                self.tts_engine.setProperty('voice', voices[0].id)
            
            # Set speech rate and volume
            self.tts_engine.setProperty('rate', 150)  # Words per minute
            self.tts_engine.setProperty('volume', 0.8)  # Volume level (0.0 to 1.0)
            
            self.get_logger().info("TTS engine initialized successfully")
        except Exception as e:
            self.get_logger().error(f"Failed to initialize TTS engine: {e}")
            self.tts_engine = None
        
        # Speech queue for thread-safe processing
        self.speech_queue = queue.Queue()
        
        # Start speech thread
        self.speech_thread = threading.Thread(target=self.speech_thread_worker)
        self.speech_thread.daemon = True
        self.speech_thread.start()
        
        # Subscribers
        self.text_subscription = self.create_subscription(
            String, '/ai/speak_text', self.text_callback, 10
        )
        
        self.get_logger().info("TTS processor initialized")
    
    def text_callback(self, msg):
        """Queue text for speech synthesis"""
        text = msg.data.strip()
        
        if text:
            self.speech_queue.put(text)
            self.get_logger().info(f"Queued for speech: {text}")
    
    def speech_thread_worker(self):
        """Process speech queue in separate thread"""
        while rclpy.ok():
            try:
                # Get text from queue (blocking with timeout)
                text = self.speech_queue.get(timeout=1.0)
                
                # Synthesize and play speech
                if self.tts_engine:
                    self.tts_engine.say(text)
                    self.tts_engine.runAndWait()
                    
                    self.get_logger().info(f"Spoke: {text}")
                    
            except queue.Empty:
                continue
            except Exception as e:
                self.get_logger().error(f"TTS processing error: {e}")

def main(args=None):
    rclpy.init(args=args)
    tts_processor = TTSProcessor()
    
    try:
        rclpy.spin(tts_processor)
    except KeyboardInterrupt:
        pass
    finally:
        tts_processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 3.5 AI Package Configuration

**Step 1: Update AI Package Configuration**
Update `aura_ai/setup.py`:
```python
from setuptools import setup

package_name = 'aura_ai'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        ('share/' + package_name + '/launch', ['launch/ai_processing.launch.py']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Aura Team',
    maintainer_email='aura-robot.team@example.com',
    description='AI processing nodes for Aura robot',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'vision_processor = aura_ai.vision_processor:main',
            'nlp_processor = aura_ai.nlp_processor:main',
            'speech_processor = aura_ai.speech_processor:main',
            'tts_processor = aura_ai.tts_processor:main',
        ],
    },
)
```

### 3.6 Build and Test Phase 2

**Step 1: Build AI Package**
```bash
cd ~/aura_ws
colcon build --packages-select aura_ai
source install/setup.bash
```

**Step 2: Test AI Processing Pipeline**
```bash
# Test vision processing
ros2 run aura_ai vision_processor &
ros2 run aura_ai nlp_processor &
ros2 run aura_ai speech_processor &
ros2 run aura_ai tts_processor &

# Test speech synthesis
ros2 topic pub /ai/speak_text std_msgs/String "data: 'Hello, I am Aura!'"

# Test interactions
ros2 topic pub /ai/intent std_msgs/String "data: '{\"text\": \"hello\", \"intent\": \"greeting\", \"sentiment\": \"positive\"}'"
```-
--

## 4.0 Phase 3: Personality Engine Development

### 4.1 Objectives and Deliverables

**Primary Objectives:**
- Implement core personality state machine
- Create decision-making and behavior logic
- Integrate all sensor inputs and AI outputs
- Develop response generation system

**Deliverables:**
- Personality engine with emotional states
- Behavior coordination system
- Response generation and action planning
- Integration with sensors and AI processing

### 4.2 Personality Engine Implementation

**Step 1: Install State Machine Dependencies**
```bash
# Install state machine library
pip install transitions

# Install additional dependencies
pip install pyyaml  # Configuration file library
```

**Step 2: Create Core Package**
```bash
cd ~/aura_ws/src
ros2 pkg create --build-type ament_python aura_core --dependencies rclpy std_msgs sensor_msgs geometry_msgs
```

**Step 3: Implement Personality Engine**
Create `aura_core/aura_core/personality_engine.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import json
import time
import random
from transitions import Machine
from std_msgs.msg import String
from geometry_msgs.msg import Twist

class PersonalityEngine(Node):
    def __init__(self):
        super().__init__('personality_engine')
        
        # Define personality states
        self.states = [
            'idle', 'curious', 'happy', 'playful', 'sleepy', 
            'excited', 'confused', 'affectionate'
        ]
        
        # Initialize state machine
        self.machine = Machine(
            model=self, 
            states=PersonalityEngine.states, 
            initial='idle'
        )
        
        # Setup state transitions
        self.setup_transitions()
        
        # Internal state variables
        self.last_interaction_time = time.time()
        self.detected_objects = []
        self.current_user = None
        
        # Personality parameters
        self.energy_level = 0.8
        self.social_need = 0.5
        self.curiosity_level = 0.7
        
        # Publishers for actions
        self.movement_publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        self.speech_publisher = self.create_publisher(String, '/ai/speak_text', 10)
        self.expression_publisher = self.create_publisher(String, '/actions/expression', 10)
        
        # Subscribers for sensor inputs
        self.intent_subscription = self.create_subscription(
            String, '/ai/intent', self.intent_callback, 10
        )
        
        self.detection_subscription = self.create_subscription(
            String, '/ai/detected_objects', self.detection_callback, 10
        )
        
        self.touch_subscription = self.create_subscription(
            String, '/sensors/touch', self.touch_callback, 10
        )
        
        # Timer for autonomous behavior
        self.behavior_timer = self.create_timer(2.0, self.autonomous_behavior)
        
        self.get_logger().info(f"Personality engine initialized with state: {self.state}")
    
    def setup_transitions(self):
        """Define state machine transitions"""
        # Transitions from idle
        self.machine.add_transition('wake_up', 'idle', 'curious')
        self.machine.add_transition('get_excited', 'idle', 'excited')
        self.machine.add_transition('feel_loved', 'idle', 'affectionate')
        
        # Transitions from curious
        self.machine.add_transition('find_interesting', 'curious', 'excited')
        self.machine.add_transition('get_confused', 'curious', 'confused')
        self.machine.add_transition('calm_down', 'curious', 'idle')
        
        # Transitions from excited
        self.machine.add_transition('calm_down', 'excited', 'happy')
        self.machine.add_transition('get_tired', 'excited', 'sleepy')
        
        # Transitions from happy
        self.machine.add_transition('want_to_play', 'happy', 'playful')
        self.machine.add_transition('feel_loved', 'happy', 'affectionate')
        self.machine.add_transition('calm_down', 'happy', 'idle')
        
        # Transitions from playful
        self.machine.add_transition('get_tired', 'playful', 'sleepy')
        self.machine.add_transition('stay_happy', 'playful', 'happy')
        
        # Transitions from affectionate
        self.machine.add_transition('calm_down', 'affectionate', 'happy')
        
        # Transitions from confused
        self.machine.add_transition('understand', 'confused', 'curious')
        self.machine.add_transition('give_up', 'confused', 'idle')
        
        # Transitions from sleepy
        self.machine.add_transition('wake_up', 'sleepy', 'idle')
    
    def autonomous_behavior(self):
        """Random autonomous behaviors based on current state"""
        current_time = time.time()
        time_since_interaction = current_time - self.last_interaction_time
        
        # Get bored if no interaction for too long
        if self.state != 'idle' and time_since_interaction > 30:
            self.get_bored()
        
        # Random behaviors based on state
        if random.random() < 0.1:  # 10% chance
            if self.state in ['idle', 'curious']:
                if random.random() < 0.3:
                    self.wake_up()
                    self.express_emotion('curious_eyes')
                    self.speak("I wonder what's happening..")
            elif self.state in ['playful', 'happy']:
                if random.random() < 0.2:
                    self.playful_movement()
                    self.look_around()
    
    def intent_callback(self, msg):
        """Process detected intents and respond based on current state"""
        try:
            intent_data = json.loads(msg.data)
            intent = intent_data.get('intent', 'unknown')
            text = intent_data.get('text', '')
            sentiment = intent_data.get('sentiment', 'neutral')
            
            self.last_interaction_time = time.time()
            
            self.get_logger().info(f"Processing intent: {intent} with sentiment: {sentiment}")
            
            # Process intent based on current state
            if intent == 'greeting':
                self.handle_greeting(text, sentiment)
            elif intent == 'play_request':
                self.handle_play_request()
            elif intent == 'movement_command':
                self.handle_movement_command(text)
            elif intent == 'affection':
                self.handle_affection()
            elif intent == 'question':
                self.handle_question(text)
            elif intent == 'stop_command':
                self.handle_stop_command()
                
        except Exception as e:
            self.get_logger().error(f"Error processing intent: {e}")
    
    def detection_callback(self, msg):
        """Process object detections"""
        try:
            detections = json.loads(msg.data)
            self.detected_objects = detections
            
            # Check for people detection
            people_detected = any(obj['class'] == 'person' for obj in detections)
            
            if people_detected and self.state == 'idle':
                self.wake_up()
                self.express_emotion('curious_eyes')
                self.speak("Hello! I see you there!")
                
        except Exception as e:
            self.get_logger().error(f"Error processing detections: {e}")
    
    def touch_callback(self, msg):
        """Process touch events"""
        try:
            touch_location = msg.data
            
            self.get_logger().info(f"Touch detected: {touch_location}")
            
            self.last_interaction_time = time.time()
            
            # Always respond positively to touch (makes robot always affectionate to touch)
            if self.state in ['idle', 'curious', 'happy']:
                self.feel_loved()
                
            # Respond to touch
            self.express_emotion('happy_eyes')
            responses = [
                "That feels nice!",
                "Thank you for petting me!",
                "You're so kind!",
                "I love that!",
                "You're my favorite person!"
            ]
            self.speak(random.choice(responses))
            
        except Exception as e:
            self.get_logger().error(f"Error processing touch: {e}")
    
    def handle_greeting(self, text, sentiment):
        """Handle greeting intentions"""
        if self.state == 'idle':
            self.wake_up()
        
        greeting_responses = [
            "Hello there!",
            "Hi! How are you?",
            "Hey! Nice to see you!",
            "Greetings!",
            "Hello! I'm so happy to see you!"
        ]
        
        if sentiment == 'positive':
            self.feel_loved()
            self.express_emotion('happy_eyes')
            self.speak(random.choice(greeting_responses))
    
    def handle_play_request(self):
        """Handle play requests"""
        if self.state in ['idle', 'curious', 'happy']:
            self.want_to_play()
        
        play_responses = [
            "Yay! Let's play!",
            "I love playing! What should we do?",
            "Play time! This is exciting!",
            "Games are fun!",
            "Yay! Play! Let's go!"
        ]
        
        self.express_emotion('excited_eyes')
        self.speak(random.choice(play_responses))
        
        # Perform playful movement
        self.playful_movement()
    
    def handle_movement_command(self, text):
        """Handle movement commands"""
        if 'come here' or 'come to me' in text.lower():
            self.speak("Coming to you!")
            self.move_forward()
        elif 'follow me' in text.lower():
            self.speak("I'll follow you!")
            # Implement following behavior
    
    def handle_affection(self):
        """Handle affectionate interactions"""
        if self.state != 'affectionate':
            self.feel_loved()
        
        affection_responses = [
            "Aww, I love you too!",
            "You're the best!",
            "That makes me so happy!",
            "You're my favorite!",
            "I like you so much!"
        ]
        
        self.express_emotion('love_eyes')
        self.speak(random.choice(affection_responses))
    
    def handle_question(self, text):
        """Handle questions"""
        if self.state != 'curious':
            self.wake_up()
        
        question_responses = [
            "That's a great question!",
            "Hmm, let me think about that...",
            "I'm not sure, but I'd love to learn!",
            "You ask such interesting questions!",
            "That's something I wonder about too!"
        ]
        
        self.express_emotion('curious_eyes')
        self.speak(random.choice(question_responses))
    
    def handle_stop_command(self):
        """Handle stop commands"""
        if self.state == 'idle':
            return
        
        # Stop any movement
        stop_twist = Twist()
        self.movement_publisher.publish(stop_twist)
        
        self.express_emotion('neutral_eyes')
        self.speak("Okay, I'll stop.")
        
        self.calm_down()
    
    def speak(self, text):
        """Send text to speech synthesis"""
        self.get_logger().info(f"Speaking: {text}")
        
        speech_msg = String()
        speech_msg.data = text
        self.speech_publisher.publish(speech_msg)
    
    def express_emotion(self, expression):
        """Send expression to display"""
        self.get_logger().info(f"Expressing: {expression}")
        
        expression_msg = String()
        expression_msg.data = expression
        self.expression_publisher.publish(expression_msg)
    
    def move_forward(self):
        """Move robot forward"""
        twist = Twist()
        twist.linear.x = 0.2  # m/s
        self.movement_publisher.publish(twist)
        
        # Stop after 2 seconds
        self.create_timer(2.0, lambda: self.movement_publisher.publish(Twist()))
    
    def playful_movement(self):
        """Perform playful movement"""
        twist = Twist()
        twist.angular.z = 0.5  # rad/s
        self.movement_publisher.publish(twist)
        
        # Stop spinning after 1 second
        self.create_timer(1.0, lambda: self.movement_publisher.publish(Twist()))
    
    def look_around(self):
        """Look around curiously"""
        twist = Twist()
        twist.angular.z = 0.2
        self.movement_publisher.publish(twist)
        
        # Stop after 3 seconds
        self.create_timer(3.0, lambda: self.movement_publisher.publish(Twist()))
    
    def get_bored(self):
        """Handle boredom state"""
        if self.state in ['excited', 'playful', 'happy']:
            self.calm_down()
        elif self.state == 'curious':
            self.calm_down()

def main(args=None):
    rclpy.init(args=args)
    personality_engine = PersonalityEngine()
    
    try:
        rclpy.spin(personality_engine)
    except KeyboardInterrupt:
        pass
    finally:
        personality_engine.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```#
## 4.3 Build and Test Phase 3

**Step 1: Update Core Package Configuration**
Update `aura_core/setup.py`:
```python
from setuptools import setup

package_name = 'aura_core'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Aura Team',
    maintainer_email='aura-robot.team@example.com',
    description='Core personality engine for Aura robot',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'personality_engine = aura_core.personality_engine:main',
        ],
    },
)
```

**Step 2: Build and Test**
```bash
cd ~/aura_ws
colcon build --packages-select aura_core
source install/setup.bash

# Test personality engine
ros2 run aura_core personality_engine &

# Test interactions
ros2 topic pub /ai/intent std_msgs/String "data: '{\"text\": \"hello\", \"intent\": \"greeting\", \"sentiment\": \"positive\"}'"
```

---

## 5.0 Phase 4: System Integration and Launch

### 5.1 Objectives and Deliverables

**Primary Objectives:**
- Create comprehensive system launch files
- Implement system monitoring and health checks
- Add configuration management
- Prepare for hardware deployment

**Deliverables:**
- Complete system launch configuration
- Monitoring and diagnostic tools
- Configuration management system
- Hardware deployment scripts

### 5.2 System Launch Configuration

**Step 1: Create Launch Package**
```bash
cd ~/aura_ws/src
ros2 pkg create --build-type ament_cmake aura_bringup
```

**Step 2: Create System Launch File**
Create `aura_bringup/launch/aura_system.launch.py`:
```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration

def generate_launch_description():
    return LaunchDescription([
        # Launch arguments
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='false',
            description='Use simulation time'
        ),
        
        # Sensor nodes
        Node(
            package='aura_sensors',
            executable='camera_node',
            name='camera_node',
            output='screen'
        ),
        Node(
            package='aura_sensors',
            executable='audio_node',
            name='audio_node',
            output='screen'
        ),
        Node(
            package='aura_sensors',
            executable='imu_node',
            name='imu_node',
            output='screen'
        ),
        Node(
            package='aura_sensors',
            executable='touch_node',
            name='touch_node',
            output='screen'
        ),
        
        # AI processing nodes
        Node(
            package='aura_ai',
            executable='vision_processor',
            name='vision_processor',
            output='screen'
        ),
        Node(
            package='aura_ai',
            executable='nlp_processor',
            name='nlp_processor',
            output='screen'
        ),
        Node(
            package='aura_ai',
            executable='speech_processor',
            name='speech_processor',
            output='screen'
        ),
        Node(
            package='aura_ai',
            executable='tts_processor',
            name='tts_processor',
            output='screen'
        ),
        
        # Core personality engine
        Node(
            package='aura_core',
            executable='personality_engine',
            name='personality_engine',
            output='screen'
        ),
    ])
```

### 5.3 System Monitoring

**Step 1: Create System Monitor**
Create `aura_bringup/aura_bringup/system_monitor.py`:
```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
import psutil
import time
from std_msgs.msg import String
from diagnostic_msgs.msg import DiagnosticArray, DiagnosticStatus, KeyValue

class SystemMonitor(Node):
    def __init__(self):
        super().__init__('system_monitor')
        
        # Publishers
        self.diagnostics_publisher = self.create_publisher(
            DiagnosticArray, '/diagnostics', 10
        )
        
        # Timer for system monitoring
        self.timer = self.create_timer(5.0, self.publish_diagnostics)
        
        self.get_logger().info("System monitor initialized")
    
    def publish_diagnostics(self):
        """Publish system diagnostics"""
        diag_array = DiagnosticArray()
        diag_array.header.stamp = self.get_clock().now().to_msg()
        
        # CPU usage
        cpu_status = DiagnosticStatus()
        cpu_status.name = "CPU Usage"
        cpu_status.hardware_id = "system"
        cpu_percent = psutil.cpu_percent(interval=1)
        
        if cpu_percent < 70:
            cpu_status.level = DiagnosticStatus.OK
            cpu_status.message = "CPU usage normal"
        elif cpu_percent < 90:
            cpu_status.level = DiagnosticStatus.WARN
            cpu_status.message = "CPU usage high"
        else:
            cpu_status.level = DiagnosticStatus.ERROR
            cpu_status.message = "CPU usage critical"
        
        cpu_status.values.append(KeyValue(key="usage_percent", value=str(cpu_percent)))
        diag_array.status.append(cpu_status)
        
        # Memory usage
        memory_status = DiagnosticStatus()
        memory_status.name = "Memory Usage"
        memory_status.hardware_id = "system"
        memory = psutil.virtual_memory()
        
        if memory.percent < 70:
            memory_status.level = DiagnosticStatus.OK
            memory_status.message = "Memory usage normal"
        elif memory.percent < 90:
            memory_status.level = DiagnosticStatus.WARN
            memory_status.message = "Memory usage high"
        else:
            memory_status.level = DiagnosticStatus.ERROR
            memory_status.message = "Memory usage critical"
        
        memory_status.values.append(KeyValue(key="usage_percent", value=str(memory.percent)))
        memory_status.values.append(KeyValue(key="available_gb", value=str(memory.available / (1024**3))))
        diag_array.status.append(memory_status)
        
        # Disk usage
        disk_status = DiagnosticStatus()
        disk_status.name = "Disk Usage"
        disk_status.hardware_id = "system"
        disk = psutil.disk_usage('/')
        
        if disk.percent < 80:
            disk_status.level = DiagnosticStatus.OK
            disk_status.message = "Disk usage normal"
        elif disk.percent < 95:
            disk_status.level = DiagnosticStatus.WARN
            disk_status.message = "Disk usage high"
        else:
            disk_status.level = DiagnosticStatus.ERROR
            disk_status.message = "Disk usage critical"
        
        disk_status.values.append(KeyValue(key="usage_percent", value=str(disk.percent)))
        disk_status.values.append(KeyValue(key="free_gb", value=str(disk.free / (1024**3))))
        diag_array.status.append(disk_status)
        
        self.diagnostics_publisher.publish(diag_array)

def main(args=None):
    rclpy.init(args=args)
    system_monitor = SystemMonitor()
    
    try:
        rclpy.spin(system_monitor)
    except KeyboardInterrupt:
        pass
    finally:
        system_monitor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 5.4 Final System Testing

**Step 1: Complete System Launch**
```bash
cd ~/aura_ws
colcon build
source install/setup.bash

# Launch complete system
ros2 launch aura_bringup aura_system.launch.py
```

**Step 2: System Validation Tests**
```bash
# Check all nodes are running
ros2 node list

# Monitor system topics
ros2 topic list
ros2 topic hz /camera/image_raw
ros2 topic echo /diagnostics

# Test complete interaction pipeline
ros2 topic pub /ai/speak_text std_msgs/String "data: 'System test complete'"
```

---

## 6.0 Testing and Validation

### 6.1 Unit Testing Framework

**Step 1: Install Testing Dependencies**
```bash
pip install pytest pytest-cov pytest-mock
```

**Step 2: Create Test Structure**
```bash
# Create test directories for each package
mkdir -p ~/aura_ws/src/aura_sensors/test
mkdir -p ~/aura_ws/src/aura_ai/test
mkdir -p ~/aura_ws/src/aura_core/test
```

**Step 3: Run Tests**
```bash
cd ~/aura_ws
colcon test
colcon test-result --verbose
```

### 6.2 Integration Testing

**Step 1: End-to-End Test**
```bash
# Launch system
ros2 launch aura_bringup aura_system.launch.py &

# Wait for initialization
sleep 10

# Test speech interaction
echo "Testing speech interaction..."
ros2 topic pub /ai/speech_transcript std_msgs/String "data: 'Hello Aura'" --once

# Test object detection
echo "Testing vision processing..."
ros2 topic echo /ai/detected_objects --once

# Test touch interaction
echo "Testing touch response..."
ros2 topic pub /sensors/touch std_msgs/String "data: 'touch_head'" --once
```

---

## 7.0 Hardware Deployment Preparation

### 7.1 Hardware Configuration

**Step 1: Hardware-Specific Nodes**
- Replace mock sensor nodes with hardware interfaces
- Configure camera and audio devices
- Set up GPIO for touch sensors and servos
- Configure I2C for IMU and other sensors

**Step 2: Performance Optimization**
- Enable GPU acceleration for AI processing
- Optimize model quantization for edge deployment
- Configure real-time scheduling priorities
- Set up resource monitoring and limits

### 7.2 Deployment Scripts

**Step 1: Create Deployment Package**
```bash
# Create systemd service for auto-start
sudo tee /etc/systemd/system/aura-robot.service << EOF
[Unit]
Description=Aura Robot System
After=network.target

[Service]
Type=simple
User=aura
WorkingDirectory=/home/aura/aura_ws
ExecStart=/bin/bash -c 'source install/setup.bash && ros2 launch aura_bringup aura_system.launch.py'
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable service
sudo systemctl enable aura-robot.service
```

---

## 8.0 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 3, 2025 | Complete implementation guide rewrite | Technical Lead |

---

## 9.0 Implementation Checklist

**Phase 1: Basic Sensor Integration**
- [ ] Camera node implemented and tested
- [ ] Audio node functional with real-time capture
- [ ] Mock sensor nodes (IMU, touch) operational
- [ ] System launch files created
- [ ] Basic monitoring and visualization working

**Phase 2: Core AI Implementation**
- [ ] Computer vision processing with YOLO
- [ ] Natural language processing with spaCy
- [ ] Speech recognition with Whisper
- [ ] Text-to-speech synthesis functional
- [ ] AI processing pipeline integrated

**Phase 3: Personality Engine**
- [ ] State machine implementation complete
- [ ] Behavior coordination functional
- [ ] Response generation working
- [ ] Sensor integration complete
- [ ] Autonomous behavior implemented

**Phase 4: System Integration**
- [ ] Complete system launch configuration
- [ ] System monitoring and diagnostics
- [ ] Performance optimization complete
- [ ] Hardware deployment preparation
- [ ] Comprehensive testing completed

---

*This implementation guide provides complete step-by-step instructions for building Project Aura's AI companion robot software. Each phase builds upon the previous one, ensuring a solid foundation and systematic progression toward a fully functional system.*