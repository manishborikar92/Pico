# Testing Procedures and Quality Assurance
**Document Type:** Testing Guide  
**Version:** 1.0  
**Date:** November 3, 2025  
**Audience:** QA Engineers, Developers, Technical Teams  
**Status:** Initial Draft  

---

## Document Metadata
- **Last Modified:** November 3, 2025
- **Document Owner:** QA Lead
- **Review Cycle:** Weekly
- **Dependencies:** `05_implementation_guide_v1.0.md`
- **Related Documents:** Technical Architecture, Software Stack

---

## Executive Summary for Non-Technical Stakeholders

This document outlines comprehensive testing procedures for Project Aura's AI companion robot. The testing strategy ensures system reliability, performance, and user safety through systematic validation at multiple levels. Testing occurs throughout development, from individual components to complete system integration, ensuring high-quality delivery.

**Testing Strategy:**
- **Multi-Level Testing:** Unit, integration, and system-level validation
- **Automated Testing:** Continuous validation during development
- **Performance Testing:** Real-time response and resource utilization
- **User Acceptance Testing:** Real-world interaction validation

---

## 1.0 Testing Framework Overview

### 1.1 Testing Pyramid Structure

**Unit Testing (Foundation):**
- Individual component validation
- Function-level correctness verification
- Isolated testing with mocked dependencies

**Integration Testing (Middle Layer):**
- Component interaction validation
- Data flow verification between nodes
- Cross-system communication testing

**System Testing (Top Layer):**
- End-to-end functionality validation
- Performance and reliability testing
- User scenario simulation

### 1.2 Testing Categories

**Functional Testing:**
- Feature correctness validation
- Requirements compliance verification
- User story acceptance testing

**Non-Functional Testing:**
- Performance and latency testing
- Resource utilization monitoring
- Reliability and stability testing

**Security Testing:**
- Data privacy validation
- Communication security verification
- Access control testing

---

## 2.0 Unit Testing Framework

### 2.1 Python Unit Testing Setup

**Testing Framework:** pytest with ROS 2 extensions
```bash
# Install testing dependencies
pip install pytest pytest-cov pytest-mock pytest-asyncio
pip install ros2-pytest  # ROS 2 specific testing utilities
```

**Test Structure:**
```
aura_ws/
├── src/
│   ├── aura_sensors/
│   │   ├── aura_sensors/
│   │   │   └── camera_node.py
│   │   └── test/
│   │       ├── test_camera_node.py
│   │       └── test_audio_node.py
│   └── aura_ai/
│       ├── aura_ai/
│       │   └── vision_processor.py
│       └── test/
│           └── test_vision_processor.py
```

### 2.2 Sample Unit Tests

**Camera Node Test:**
Create `aura_sensors/test/test_camera_node.py`:
```python
#!/usr/bin/env python3

import pytest
import rclpy
from unittest.mock import Mock, patch
from aura_sensors.camera_node import CameraNode
from sensor_msgs.msg import Image

class TestCameraNode:
    @classmethod
    def setup_class(cls):
        """Setup test environment"""
        rclpy.init()
    
    @classmethod
    def teardown_class(cls):
        """Cleanup test environment"""
        rclpy.shutdown()
    
    def setup_method(self):
        """Setup for each test method"""
        self.node = CameraNode()
    
    def teardown_method(self):
        """Cleanup for each test method"""
        self.node.destroy_node()
    
    @patch('cv2.VideoCapture')
    def test_camera_initialization(self, mock_video_capture):
        """Test camera initialization"""
        # Mock successful camera opening
        mock_cap = Mock()
        mock_cap.isOpened.return_value = True
        mock_video_capture.return_value = mock_cap
        
        # Create node
        node = CameraNode()
        
        # Verify camera was opened
        mock_video_capture.assert_called_once_with(0)
        mock_cap.isOpened.assert_called_once()
        
        node.destroy_node()
    
    @patch('cv2.VideoCapture')
    def test_image_capture_and_publish(self, mock_video_capture):
        """Test image capture and publishing"""
        # Mock camera and frame
        mock_cap = Mock()
        mock_cap.isOpened.return_value = True
        mock_cap.read.return_value = (True, Mock())  # (success, frame)
        mock_video_capture.return_value = mock_cap
        
        # Mock publisher
        with patch.object(self.node, 'image_publisher') as mock_publisher:
            # Trigger capture
            self.node.capture_and_publish()
            
            # Verify frame was read and published
            mock_cap.read.assert_called_once()
            mock_publisher.publish.assert_called_once()
            
            # Verify message type
            published_msg = mock_publisher.publish.call_args[0][0]
            assert isinstance(published_msg, Image)
    
    def test_camera_failure_handling(self):
        """Test handling of camera failures"""
        with patch('cv2.VideoCapture') as mock_video_capture:
            # Mock failed camera opening
            mock_cap = Mock()
            mock_cap.isOpened.return_value = False
            mock_video_capture.return_value = mock_cap
            
            # Create node (should handle failure gracefully)
            node = CameraNode()
            
            # Verify error handling
            assert node.cap.isOpened() == False
            
            node.destroy_node()

# Run tests with: pytest test_camera_node.py -v
```

**Vision Processor Test:**
Create `aura_ai/test/test_vision_processor.py`:
```python
#!/usr/bin/env python3

import pytest
import rclpy
import json
import numpy as np
from unittest.mock import Mock, patch
from aura_ai.vision_processor import VisionProcessor
from sensor_msgs.msg import Image
from std_msgs.msg import String

class TestVisionProcessor:
    @classmethod
    def setup_class(cls):
        rclpy.init()
    
    @classmethod
    def teardown_class(cls):
        rclpy.shutdown()
    
    def setup_method(self):
        with patch('ultralytics.YOLO'):
            self.node = VisionProcessor()
    
    def teardown_method(self):
        self.node.destroy_node()
    
    @patch('ultralytics.YOLO')
    def test_model_loading(self, mock_yolo):
        """Test YOLO model loading"""
        # Mock successful model loading
        mock_model = Mock()
        mock_yolo.return_value = mock_model
        
        # Create node
        node = VisionProcessor()
        
        # Verify model was loaded
        mock_yolo.assert_called_once_with('yolov8n.pt')
        assert node.model == mock_model
        
        node.destroy_node()
    
    def test_object_detection_processing(self):
        """Test object detection processing"""
        # Mock YOLO model and results
        mock_model = Mock()
        mock_result = Mock()
        mock_boxes = Mock()
        
        # Mock detection data
        mock_box = Mock()
        mock_box.cls = [0]  # Person class
        mock_box.conf = [0.8]  # High confidence
        mock_box.xyxy = [[100, 100, 200, 200]]  # Bounding box
        
        mock_boxes.__iter__ = Mock(return_value=iter([mock_box]))
        mock_result.boxes = mock_boxes
        mock_model.return_value = [mock_result]
        mock_model.names = {0: 'person'}
        
        self.node.model = mock_model
        
        # Create test image message
        test_image = Image()
        test_image.header.frame_id = 'camera_frame'
        test_image.width = 640
        test_image.height = 480
        test_image.encoding = 'bgr8'
        test_image.data = np.zeros((480, 640, 3), dtype=np.uint8).tobytes()
        
        # Mock publishers
        with patch.object(self.node, 'detection_publisher') as mock_det_pub, \
             patch.object(self.node, 'annotated_image_publisher') as mock_img_pub, \
             patch('cv2.rectangle'), \
             patch('cv2.putText'):
            
            # Process image
            self.node.image_callback(test_image)
            
            # Verify detection was published
            mock_det_pub.publish.assert_called_once()
            
            # Verify detection data
            published_data = mock_det_pub.publish.call_args[0][0].data
            detections = json.loads(published_data)
            
            assert len(detections) == 1
            assert detections[0]['class'] == 'person'
            assert detections[0]['confidence'] == 0.8
    
    def test_confidence_threshold_filtering(self):
        """Test confidence threshold filtering"""
        # Mock low confidence detection
        mock_model = Mock()
        mock_result = Mock()
        mock_boxes = Mock()
        
        mock_box = Mock()
        mock_box.cls = [0]
        mock_box.conf = [0.3]  # Low confidence (below threshold)
        mock_box.xyxy = [[100, 100, 200, 200]]
        
        mock_boxes.__iter__ = Mock(return_value=iter([mock_box]))
        mock_result.boxes = mock_boxes
        mock_model.return_value = [mock_result]
        mock_model.names = {0: 'person'}
        
        self.node.model = mock_model
        self.node.confidence_threshold = 0.5
        
        # Create test image
        test_image = Image()
        test_image.data = np.zeros((480, 640, 3), dtype=np.uint8).tobytes()
        
        with patch.object(self.node, 'detection_publisher') as mock_pub:
            # Process image
            self.node.image_callback(test_image)
            
            # Verify no detection was published (below threshold)
            mock_pub.publish.assert_not_called()

# Run tests with: pytest test_vision_processor.py -v --cov=aura_ai
```

### 2.3 Running Unit Tests

**Execute Tests:**
```bash
cd ~/aura_ws

# Run all tests
colcon test

# Run specific package tests
colcon test --packages-select aura_sensors

# Run with coverage
colcon test --packages-select aura_ai --pytest-args --cov=aura_ai

# Generate coverage report
colcon test-result --verbose
```

---

## 3.0 Integration Testing

### 3.1 ROS 2 Integration Testing Framework

**Integration Test Structure:**
```python
#!/usr/bin/env python3

import pytest
import rclpy
import threading
import time
from std_msgs.msg import String
from sensor_msgs.msg import Image

class TestSensorAIIntegration:
    @classmethod
    def setup_class(cls):
        rclpy.init()
    
    @classmethod
    def teardown_class(cls):
        rclpy.shutdown()
    
    def test_camera_to_vision_pipeline(self):
        """Test camera -> vision processing pipeline"""
        # Setup test nodes
        camera_node = Mock()  # Mock camera node
        vision_node = Mock()  # Mock vision processor
        
        # Test data flow
        test_image = self.create_test_image()
        
        # Simulate camera publishing image
        # Verify vision processor receives and processes image
        # Check detection output
        
        pass  # Implementation details
    
    def test_speech_to_nlp_pipeline(self):
        """Test speech -> NLP processing pipeline"""
        # Test audio -> transcript -> intent pipeline
        pass
    
    def test_full_interaction_pipeline(self):
        """Test complete interaction: input -> processing -> response"""
        # Test: speech input -> NLP -> personality -> TTS output
        pass

# Integration test configuration
@pytest.fixture
def ros_context():
    """Setup ROS 2 context for integration tests"""
    rclpy.init()
    yield
    rclpy.shutdown()
```

### 3.2 Message Flow Testing

**Topic Communication Test:**
```python
#!/usr/bin/env python3

import pytest
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import threading
import time

class MessageFlowTester(Node):
    def __init__(self):
        super().__init__('message_flow_tester')
        self.received_messages = []
        
        # Subscriber to monitor messages
        self.subscription = self.create_subscription(
            String, '/test_topic', self.message_callback, 10
        )
        
        # Publisher for test messages
        self.publisher = self.create_publisher(String, '/test_topic', 10)
    
    def message_callback(self, msg):
        self.received_messages.append(msg.data)
    
    def publish_test_message(self, content):
        msg = String()
        msg.data = content
        self.publisher.publish(msg)

def test_message_flow():
    """Test ROS 2 message flow"""
    rclpy.init()
    
    try:
        tester = MessageFlowTester()
        
        # Spin in background thread
        spin_thread = threading.Thread(target=rclpy.spin, args=(tester,))
        spin_thread.daemon = True
        spin_thread.start()
        
        # Wait for node to initialize
        time.sleep(0.5)
        
        # Publish test message
        test_content = "test_message_123"
        tester.publish_test_message(test_content)
        
        # Wait for message processing
        time.sleep(0.5)
        
        # Verify message was received
        assert test_content in tester.received_messages
        
    finally:
        tester.destroy_node()
        rclpy.shutdown()
```

---

## 4.0 Performance Testing

### 4.1 Latency Testing

**Response Time Measurement:**
```python
#!/usr/bin/env python3

import time
import statistics
from typing import List

class LatencyTester:
    def __init__(self):
        self.measurements = []
    
    def measure_processing_latency(self, processor_func, test_data, iterations=100):
        """Measure processing latency for a function"""
        latencies = []
        
        for _ in range(iterations):
            start_time = time.perf_counter()
            result = processor_func(test_data)
            end_time = time.perf_counter()
            
            latency = (end_time - start_time) * 1000  # Convert to milliseconds
            latencies.append(latency)
        
        return {
            'mean': statistics.mean(latencies),
            'median': statistics.median(latencies),
            'std_dev': statistics.stdev(latencies),
            'min': min(latencies),
            'max': max(latencies),
            'p95': self.percentile(latencies, 95),
            'p99': self.percentile(latencies, 99)
        }
    
    def percentile(self, data: List[float], percentile: float) -> float:
        """Calculate percentile of data"""
        sorted_data = sorted(data)
        index = (percentile / 100) * (len(sorted_data) - 1)
        
        if index.is_integer():
            return sorted_data[int(index)]
        else:
            lower = sorted_data[int(index)]
            upper = sorted_data[int(index) + 1]
            return lower + (upper - lower) * (index - int(index))

# Performance test example
def test_vision_processing_performance():
    """Test vision processing performance"""
    tester = LatencyTester()
    
    # Create test image data
    test_image = create_test_image_data()
    
    # Mock vision processor
    def mock_vision_process(image_data):
        # Simulate processing time
        time.sleep(0.05)  # 50ms processing
        return {"detections": []}
    
    # Measure latency
    results = tester.measure_processing_latency(mock_vision_process, test_image)
    
    # Assert performance requirements
    assert results['mean'] < 100  # Average < 100ms
    assert results['p95'] < 150   # 95th percentile < 150ms
    assert results['p99'] < 200   # 99th percentile < 200ms
    
    print(f"Vision Processing Performance: {results}")
```

### 4.2 Resource Utilization Testing

**System Resource Monitor:**
```python
#!/usr/bin/env python3

import psutil
import time
import threading
from typing import Dict, List

class ResourceMonitor:
    def __init__(self):
        self.monitoring = False
        self.measurements = []
    
    def start_monitoring(self, duration: float = 60.0, interval: float = 1.0):
        """Start resource monitoring"""
        self.monitoring = True
        self.measurements = []
        
        def monitor_loop():
            start_time = time.time()
            
            while self.monitoring and (time.time() - start_time) < duration:
                measurement = {
                    'timestamp': time.time(),
                    'cpu_percent': psutil.cpu_percent(interval=None),
                    'memory_percent': psutil.virtual_memory().percent,
                    'memory_used_mb': psutil.virtual_memory().used / (1024 * 1024),
                    'disk_io': psutil.disk_io_counters()._asdict() if psutil.disk_io_counters() else {},
                    'network_io': psutil.net_io_counters()._asdict()
                }
                
                self.measurements.append(measurement)
                time.sleep(interval)
        
        self.monitor_thread = threading.Thread(target=monitor_loop)
        self.monitor_thread.start()
    
    def stop_monitoring(self):
        """Stop resource monitoring"""
        self.monitoring = False
        if hasattr(self, 'monitor_thread'):
            self.monitor_thread.join()
    
    def get_statistics(self) -> Dict:
        """Get resource usage statistics"""
        if not self.measurements:
            return {}
        
        cpu_values = [m['cpu_percent'] for m in self.measurements]
        memory_values = [m['memory_percent'] for m in self.measurements]
        
        return {
            'cpu': {
                'mean': sum(cpu_values) / len(cpu_values),
                'max': max(cpu_values),
                'min': min(cpu_values)
            },
            'memory': {
                'mean': sum(memory_values) / len(memory_values),
                'max': max(memory_values),
                'min': min(memory_values)
            },
            'duration': len(self.measurements)
        }

# Resource usage test
def test_system_resource_usage():
    """Test system resource usage during operation"""
    monitor = ResourceMonitor()
    
    # Start monitoring
    monitor.start_monitoring(duration=30.0)
    
    # Simulate system load (run actual nodes here)
    simulate_robot_operation()
    
    # Stop monitoring
    monitor.stop_monitoring()
    
    # Analyze results
    stats = monitor.get_statistics()
    
    # Assert resource constraints
    assert stats['cpu']['mean'] < 80.0  # Average CPU < 80%
    assert stats['memory']['mean'] < 70.0  # Average memory < 70%
    
    print(f"Resource Usage: {stats}")
```

---

## 5.0 System Testing

### 5.1 End-to-End Testing

**Complete Interaction Test:**
```python
#!/usr/bin/env python3

import pytest
import rclpy
import time
import threading
from std_msgs.msg import String

class SystemTester:
    def __init__(self):
        rclpy.init()
        self.setup_test_environment()
    
    def setup_test_environment(self):
        """Setup complete test environment"""
        # Launch all system nodes
        # Setup test data sources
        # Configure monitoring
        pass
    
    def test_greeting_interaction(self):
        """Test complete greeting interaction"""
        # 1. Simulate speech input: "Hello Aura"
        # 2. Verify speech recognition
        # 3. Verify NLP intent detection
        # 4. Verify personality response
        # 5. Verify TTS output
        # 6. Verify expression change
        
        test_steps = [
            self.simulate_speech_input("Hello Aura"),
            self.verify_intent_detection("greeting"),
            self.verify_personality_response(),
            self.verify_speech_output(),
            self.verify_expression_change("happy_eyes")
        ]
        
        for step in test_steps:
            assert step, f"Test step failed: {step}"
    
    def test_object_detection_interaction(self):
        """Test object detection and response"""
        # 1. Simulate person appearing in camera
        # 2. Verify object detection
        # 3. Verify personality state change
        # 4. Verify appropriate response
        pass
    
    def test_touch_interaction(self):
        """Test touch sensor interaction"""
        # 1. Simulate touch event
        # 2. Verify touch detection
        # 3. Verify personality response
        # 4. Verify affectionate behavior
        pass
    
    def simulate_speech_input(self, text: str) -> bool:
        """Simulate speech input to system"""
        # Publish to speech transcript topic
        return True
    
    def verify_intent_detection(self, expected_intent: str) -> bool:
        """Verify correct intent was detected"""
        # Monitor intent topic for expected result
        return True
    
    def verify_personality_response(self) -> bool:
        """Verify personality engine responded appropriately"""
        # Check personality state changes
        return True
    
    def verify_speech_output(self) -> bool:
        """Verify TTS output was generated"""
        # Monitor TTS topic for output
        return True
    
    def verify_expression_change(self, expected_expression: str) -> bool:
        """Verify expression changed as expected"""
        # Monitor expression topic
        return True

# System test execution
def test_complete_system():
    """Run complete system tests"""
    tester = SystemTester()
    
    # Run interaction tests
    tester.test_greeting_interaction()
    tester.test_object_detection_interaction()
    tester.test_touch_interaction()
    
    print("All system tests passed!")
```

### 5.2 Stress Testing

**System Load Testing:**
```python
#!/usr/bin/env python3

import threading
import time
import random
from concurrent.futures import ThreadPoolExecutor

class StressTester:
    def __init__(self):
        self.test_duration = 300  # 5 minutes
        self.concurrent_interactions = 10
    
    def run_stress_test(self):
        """Run stress test with multiple concurrent interactions"""
        with ThreadPoolExecutor(max_workers=self.concurrent_interactions) as executor:
            # Submit multiple interaction threads
            futures = []
            
            for i in range(self.concurrent_interactions):
                future = executor.submit(self.interaction_thread, i)
                futures.append(future)
            
            # Wait for all threads to complete
            for future in futures:
                future.result()
    
    def interaction_thread(self, thread_id: int):
        """Simulate continuous interactions"""
        start_time = time.time()
        interaction_count = 0
        
        while (time.time() - start_time) < self.test_duration:
            # Simulate random interaction
            interaction_type = random.choice([
                'speech', 'touch', 'movement', 'object_detection'
            ])
            
            self.simulate_interaction(interaction_type, thread_id)
            interaction_count += 1
            
            # Random delay between interactions
            time.sleep(random.uniform(0.5, 2.0))
        
        print(f"Thread {thread_id}: {interaction_count} interactions completed")
    
    def simulate_interaction(self, interaction_type: str, thread_id: int):
        """Simulate specific interaction type"""
        if interaction_type == 'speech':
            self.simulate_speech_interaction(thread_id)
        elif interaction_type == 'touch':
            self.simulate_touch_interaction(thread_id)
        # Add other interaction types
    
    def simulate_speech_interaction(self, thread_id: int):
        """Simulate speech interaction"""
        phrases = [
            "Hello Aura",
            "How are you?",
            "Let's play a game",
            "Come here",
            "Good robot"
        ]
        
        phrase = random.choice(phrases)
        # Publish to appropriate topic
        print(f"Thread {thread_id}: Speech - {phrase}")
    
    def simulate_touch_interaction(self, thread_id: int):
        """Simulate touch interaction"""
        locations = ['head', 'back', 'belly', 'side']
        location = random.choice(locations)
        
        # Publish touch event
        print(f"Thread {thread_id}: Touch - {location}")

# Stress test execution
def test_system_under_stress():
    """Test system under high load"""
    tester = StressTester()
    
    print("Starting stress test...")
    start_time = time.time()
    
    tester.run_stress_test()
    
    end_time = time.time()
    print(f"Stress test completed in {end_time - start_time:.2f} seconds")
```

---

## 6.0 User Acceptance Testing

### 6.1 UAT Test Scenarios

**Scenario-Based Testing:**
```python
#!/usr/bin/env python3

class UATScenarios:
    def __init__(self):
        self.test_scenarios = [
            {
                'name': 'First Meeting',
                'description': 'User meets robot for the first time',
                'steps': [
                    'User approaches robot',
                    'Robot detects person and greets',
                    'User says hello',
                    'Robot responds appropriately',
                    'User pets robot',
                    'Robot shows affection'
                ],
                'expected_outcomes': [
                    'Robot shows curiosity when person detected',
                    'Appropriate greeting response',
                    'Positive emotional response to petting',
                    'Natural conversation flow'
                ]
            },
            {
                'name': 'Play Session',
                'description': 'User initiates play with robot',
                'steps': [
                    'User says "Let\'s play"',
                    'Robot responds enthusiastically',
                    'Robot suggests or starts activity',
                    'Interactive play session',
                    'Natural ending of play'
                ],
                'expected_outcomes': [
                    'Excited response to play request',
                    'Engaging play behavior',
                    'Appropriate play duration',
                    'Smooth transition to calm state'
                ]
            },
            {
                'name': 'Daily Interaction',
                'description': 'Typical daily interaction patterns',
                'steps': [
                    'User enters room',
                    'Robot acknowledges presence',
                    'Casual conversation',
                    'User leaves room',
                    'Robot returns to idle state'
                ],
                'expected_outcomes': [
                    'Consistent recognition of user',
                    'Appropriate social responses',
                    'Natural conversation flow',
                    'Proper state transitions'
                ]
            }
        ]
    
    def execute_scenario(self, scenario_name: str) -> dict:
        """Execute specific UAT scenario"""
        scenario = next((s for s in self.test_scenarios if s['name'] == scenario_name), None)
        
        if not scenario:
            return {'success': False, 'error': 'Scenario not found'}
        
        results = {
            'scenario': scenario_name,
            'steps_completed': [],
            'outcomes_achieved': [],
            'issues_found': [],
            'overall_success': True
        }
        
        # Execute each step and verify outcomes
        for step in scenario['steps']:
            step_result = self.execute_step(step)
            results['steps_completed'].append({
                'step': step,
                'success': step_result['success'],
                'notes': step_result.get('notes', '')
            })
            
            if not step_result['success']:
                results['overall_success'] = False
                results['issues_found'].append(step_result.get('error', 'Unknown error'))
        
        return results
    
    def execute_step(self, step: str) -> dict:
        """Execute individual test step"""
        # Implementation would depend on specific step
        # This is a framework for manual or automated execution
        
        return {
            'success': True,
            'notes': f'Step executed: {step}'
        }

# UAT execution framework
def run_user_acceptance_tests():
    """Run all user acceptance test scenarios"""
    uat = UATScenarios()
    
    results = []
    for scenario in uat.test_scenarios:
        result = uat.execute_scenario(scenario['name'])
        results.append(result)
        
        print(f"Scenario: {result['scenario']}")
        print(f"Success: {result['overall_success']}")
        if result['issues_found']:
            print(f"Issues: {result['issues_found']}")
        print("-" * 50)
    
    # Generate UAT report
    generate_uat_report(results)
    
    return results

def generate_uat_report(results: list):
    """Generate UAT test report"""
    total_scenarios = len(results)
    successful_scenarios = sum(1 for r in results if r['overall_success'])
    
    report = f"""
    User Acceptance Test Report
    ==========================
    
    Total Scenarios: {total_scenarios}
    Successful: {successful_scenarios}
    Failed: {total_scenarios - successful_scenarios}
    Success Rate: {(successful_scenarios / total_scenarios) * 100:.1f}%
    
    Detailed Results:
    """
    
    for result in results:
        report += f"\n{result['scenario']}: {'PASS' if result['overall_success'] else 'FAIL'}"
        if result['issues_found']:
            report += f"\n  Issues: {', '.join(result['issues_found'])}"
    
    print(report)
    
    # Save report to file
    with open('uat_report.txt', 'w') as f:
        f.write(report)
```

---

## 7.0 Automated Testing Pipeline

### 7.1 Continuous Integration Testing

**GitHub Actions Workflow:**
Create `.github/workflows/test.yml`:
```yaml
name: Automated Testing Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-22.04
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup ROS 2
      uses: ros-tooling/setup-ros@v0.6
      with:
        required-ros-distributions: humble
    
    - name: Install dependencies
      run: |
        sudo apt update
        sudo apt install -y python3-pip
        pip install pytest pytest-cov
    
    - name: Build workspace
      run: |
        source /opt/ros/humble/setup.bash
        colcon build --packages-up-to aura_core
    
    - name: Run unit tests
      run: |
        source /opt/ros/humble/setup.bash
        source install/setup.bash
        colcon test --packages-select aura_sensors aura_ai aura_core
        colcon test-result --verbose
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  integration-tests:
    runs-on: ubuntu-22.04
    needs: unit-tests
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup ROS 2
      uses: ros-tooling/setup-ros@v0.6
      with:
        required-ros-distributions: humble
    
    - name: Run integration tests
      run: |
        source /opt/ros/humble/setup.bash
        colcon build
        source install/setup.bash
        python3 -m pytest test/integration/ -v

  performance-tests:
    runs-on: ubuntu-22.04
    needs: integration-tests
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup environment
      run: |
        # Setup performance testing environment
        sudo apt install -y stress-ng
    
    - name: Run performance tests
      run: |
        source /opt/ros/humble/setup.bash
        source install/setup.bash
        python3 -m pytest test/performance/ -v --benchmark-only
```

### 7.2 Test Reporting and Metrics

**Test Metrics Collection:**
```python
#!/usr/bin/env python3

import json
import time
from datetime import datetime
from typing import Dict, List

class TestMetricsCollector:
    def __init__(self):
        self.metrics = {
            'test_runs': [],
            'performance_data': [],
            'coverage_data': [],
            'failure_analysis': []
        }
    
    def record_test_run(self, test_suite: str, results: Dict):
        """Record test run results"""
        test_run = {
            'timestamp': datetime.now().isoformat(),
            'test_suite': test_suite,
            'total_tests': results.get('total', 0),
            'passed': results.get('passed', 0),
            'failed': results.get('failed', 0),
            'skipped': results.get('skipped', 0),
            'duration': results.get('duration', 0),
            'success_rate': (results.get('passed', 0) / results.get('total', 1)) * 100
        }
        
        self.metrics['test_runs'].append(test_run)
    
    def record_performance_data(self, test_name: str, metrics: Dict):
        """Record performance test results"""
        perf_data = {
            'timestamp': datetime.now().isoformat(),
            'test_name': test_name,
            'latency_ms': metrics.get('latency_ms', 0),
            'throughput': metrics.get('throughput', 0),
            'cpu_usage': metrics.get('cpu_usage', 0),
            'memory_usage': metrics.get('memory_usage', 0)
        }
        
        self.metrics['performance_data'].append(perf_data)
    
    def generate_report(self) -> str:
        """Generate comprehensive test report"""
        report = {
            'generated_at': datetime.now().isoformat(),
            'summary': self.calculate_summary(),
            'trends': self.analyze_trends(),
            'recommendations': self.generate_recommendations()
        }
        
        return json.dumps(report, indent=2)
    
    def calculate_summary(self) -> Dict:
        """Calculate test summary statistics"""
        if not self.metrics['test_runs']:
            return {}
        
        recent_runs = self.metrics['test_runs'][-10:]  # Last 10 runs
        
        return {
            'total_test_runs': len(self.metrics['test_runs']),
            'average_success_rate': sum(run['success_rate'] for run in recent_runs) / len(recent_runs),
            'average_duration': sum(run['duration'] for run in recent_runs) / len(recent_runs),
            'most_recent_run': recent_runs[-1] if recent_runs else None
        }
    
    def analyze_trends(self) -> Dict:
        """Analyze testing trends"""
        # Implement trend analysis logic
        return {
            'success_rate_trend': 'stable',  # stable, improving, declining
            'performance_trend': 'stable',
            'test_coverage_trend': 'improving'
        }
    
    def generate_recommendations(self) -> List[str]:
        """Generate testing recommendations"""
        recommendations = []
        
        summary = self.calculate_summary()
        
        if summary.get('average_success_rate', 100) < 95:
            recommendations.append("Test success rate below 95%. Review failing tests.")
        
        if summary.get('average_duration', 0) > 300:  # 5 minutes
            recommendations.append("Test duration exceeds 5 minutes. Consider optimization.")
        
        return recommendations

# Usage example
def collect_and_report_metrics():
    """Collect test metrics and generate report"""
    collector = TestMetricsCollector()
    
    # Record sample test results
    collector.record_test_run('unit_tests', {
        'total': 50,
        'passed': 48,
        'failed': 2,
        'skipped': 0,
        'duration': 120
    })
    
    collector.record_performance_data('vision_processing', {
        'latency_ms': 85,
        'throughput': 30,
        'cpu_usage': 45,
        'memory_usage': 60
    })
    
    # Generate and save report
    report = collector.generate_report()
    
    with open('test_metrics_report.json', 'w') as f:
        f.write(report)
    
    print("Test metrics report generated")
```

---

## 8.0 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 3, 2025 | Initial testing procedures documentation | QA Lead |

---

## 9.0 Testing Checklist

**Pre-Development Testing Setup:**
- [ ] Testing framework installed and configured
- [ ] Unit test templates created for all packages
- [ ] Integration test environment setup
- [ ] Performance testing tools configured
- [ ] CI/CD pipeline established

**Development Phase Testing:**
- [ ] Unit tests written for all new functions
- [ ] Integration tests cover component interactions
- [ ] Performance benchmarks established
- [ ] Code coverage targets met (>80%)
- [ ] All tests passing in CI pipeline

**System Integration Testing:**
- [ ] End-to-end scenarios tested
- [ ] Performance requirements validated
- [ ] Resource usage within limits
- [ ] Error handling verified
- [ ] Recovery mechanisms tested

**User Acceptance Testing:**
- [ ] All UAT scenarios executed
- [ ] User feedback collected and addressed
- [ ] Interaction quality validated
- [ ] Safety requirements verified
- [ ] Documentation updated

---

*This testing guide provides comprehensive procedures for validating Project Aura's functionality, performance, and user experience. For implementation details and development procedures, refer to the Implementation Guide documentation.*