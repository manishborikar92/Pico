# Free-Tier Technology Stack & API Analysis

This document outlines the software stack for the robot's core AI functions: **Speech-to-Text (STT)**, **Natural Language Processing (NLP)**, **Text-to-Speech (TTS)**, **Computer Vision**, and **Face Recognition**. The primary goal is to use free or generous free-tier services.

**Development Approach:** This project follows a **software-first methodology** where all AI capabilities are developed and tested in Python on a PC before porting to hardware.

We define two implementation approaches:

- **The Online Stack (Recommended):** Uses cloud APIs. Vastly more powerful, more accurate, and easier to implement, with generous free tiers sufficient for prototyping.
- **The Offline Stack (Advanced):** Uses on-device models. 100% free forever and works without Wi-Fi, but much less powerful and significantly more difficult to implement.

---

## 1. Comprehensive Online AI Stack (Research-Verified)

### 1.1 Cloud Services Analysis (Updated November 2024)

**IMPORTANT RESEARCH UPDATE:** API pricing and limitations have been thoroughly researched and verified.

| Service Category | Recommended Provider | Detailed Specifications | Free Tier Limits (Verified) | Cost After Free Tier |
|------------------|---------------------|------------------------|----------------------------|---------------------|
| **Speech-to-Text** | Google Cloud Speech-to-Text | 16kHz, 16-bit, multiple languages | **60 minutes/month** | $0.006/15-second increment |
| **Natural Language** | Google Gemini 1.5 Flash | 1M token context, multimodal | **15 RPM, 1,500 RPD** | $0.075/1M input tokens |
| **Text-to-Speech** | Google Cloud TTS | Neural voices, SSML support | **1M characters/month** | $4.00/1M characters |
| **Computer Vision** | OpenCV + MediaPipe | Real-time face detection/landmarks | **Completely free** | Open source |
| **Face Recognition** | face_recognition library | 128-dimensional face encodings | **Completely free** | Open source |
| **Voice Identification** | pyAudioAnalysis | Speaker recognition, emotion detection | **Completely free** | Open source |

### 1.2 Alternative Cloud Providers (Backup Options)

| Provider | Service | Free Tier | Advantages | Limitations |
|----------|---------|-----------|------------|-------------|
| **OpenAI** | GPT-4 Turbo | $5 credit (new users) | Superior reasoning | Limited free usage |
| **Microsoft Azure** | Cognitive Services | 5,000 transactions/month | Enterprise integration | Complex pricing |
| **Amazon AWS** | Polly/Transcribe | 12 months free tier | Robust infrastructure | AWS complexity |
| **IBM Watson** | Speech/Language | Lite plan available | Good accuracy | Limited features |

### 1.3 Detailed API Integration Specifications

#### Google Speech-to-Text Configuration

```python
import speech_recognition as sr
from google.cloud import speech

# Optimal configuration for robot use
config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    language_code="en-US",
    enable_automatic_punctuation=True,
    enable_word_time_offsets=True,
    model="latest_long"  # Best for conversational AI
)
```

#### Google Gemini API Integration

```python
import google.generativeai as genai

# Configure for robot personality
model = genai.GenerativeModel('gemini-1.5-flash')

# System prompt for robot behavior
system_prompt = """
You are Pico, a friendly AI companion robot. Respond in a warm, 
helpful manner. Keep responses concise (under 50 words) unless 
asked for detailed information. Show personality and emotion in 
your responses.
"""

response = model.generate_content(
    f"{system_prompt}\n\nUser: {user_input}",
    generation_config=genai.types.GenerationConfig(
        max_output_tokens=100,
        temperature=0.7
    )
)
```

#### Google Text-to-Speech Configuration

```python
from google.cloud import texttospeech

# Optimal voice settings for robot
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="en-US-Neural2-F",  # Friendly female voice
    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    speaking_rate=1.0,
    pitch=2.0  # Slightly higher pitch for friendliness
)
```

### 1.4 Enhanced Online Stack Workflow

1. **Vision System:** Camera continuously monitors for faces using OpenCV
2. **Face Recognition:** If face detected, identify if it's a known person using face_recognition library
3. **Personalized Greeting:** "Hello [Name]!" or "Hello there!" for unknown faces
4. **Voice Interaction:** User says "Pico, what's 5 multiply by 4?"
5. **STT (Google):** `[Audio Stream]` → `"What's 5 multiply by 4"` (Uses ~5 seconds of our 60-min/month quota)
6. **Voice Recognition:** Optionally identify the speaker's voice
7. **NLP/TTS (Gemini):** `"What's 5 multiply by 4"` → **(One API Call)** → Returns:
   - `Text:` "5 multiplied by 4 is 20" (to check for IoT commands)
   - `Audio:` `response_audio.mp3` (which we play directly on the speaker)
   - (Uses 1 of our 1,500 requests/day quota)

---

## 2. Offline Stack (No Wi-Fi Required)

This stack is for advanced users. It cannot answer "What is 5×4?" but it can understand "Turn on the light" locally and recognize faces.

### 2.1 Offline Technology Components

| Task | Service | Recommendation & Analysis |
|------|---------|--------------------------|
| **STT** (Ears) | Vosk or ESP-SR | **ESP-SR (Espressif Speech Recognition)** is the best choice. It's a library from the chip maker (Espressif) designed for the ESP32-S3. It can be trained to recognize a small set of commands (e.g., "turn on," "turn off," "light," "blue") 100% on the device. |
| **NLP** (Brain) | Hard-Coded `if/else` | There is no "AI" in this stack. Your code must manually parse the text from ESP-SR. **Example:** `if (text == "turn on" && text.contains("light")) { ... }` |
| **TTS** (Voice) | PicoTTS | **This is the best offline option.** There is a GitHub project that ports PicoTTS directly to the ESP32-S3. It uses ~1.1MB of RAM (which is why we need the PSRAM model). It will sound robotic, but it's 100% free and offline. |
| **Face Detection** (Eyes) | ESP-WHO | **Espressif's official solution.** The ESP-WHO library provides face detection models optimized for ESP32-S3. Runs entirely on-device with no internet required. |
| **Face Recognition** (Memory) | ESP-WHO + Custom Training | **Advanced but possible.** ESP-WHO can be trained to recognize specific faces and store the models on the device. Limited to a small number of faces due to memory constraints. |

### 2.2 Enhanced Offline Stack Workflow

1. **Vision System:** ESP-WHO continuously monitors camera for faces
2. **Face Recognition:** If face detected, check against stored face models
3. **Local Greeting:** Display appropriate eyes on OLED based on recognition result
4. **Voice Interaction:** User says "Pico, turn on the light."
5. **STT (ESP-SR):** `[Audio Stream]` → `"turn on light"` (Recognized from its limited vocabulary)
6. **NLP (Your Code):** `if (text == "turn on light") { ... }` → Triggers the IoT function
7. **TTS (PicoTTS):** Your code calls `pico.say("Okay")` → Generates robotic "Okay" audio and plays it

---

## 3. Complete Development Environment Setup

### 3.1 Python Development Stack (Detailed Installation Guide)

#### Core Development Environment

```bash
# Python 3.10+ installation verification
python --version  # Should be 3.10 or higher

# Create virtual environment for project isolation
python -m venv aibi_robot_env
source aibi_robot_env/bin/activate  # Linux/Mac
# OR
aibi_robot_env\Scripts\activate  # Windows

# Install core dependencies
pip install --upgrade pip setuptools wheel
```

#### Essential Libraries with Specific Versions

```bash
# Computer Vision & AI
pip install opencv-python==4.8.1.78
pip install face-recognition==1.3.0
pip install mediapipe==0.10.7

# Audio Processing
pip install sounddevice==0.4.6
pip install soundfile==0.12.1
pip install pyaudio==0.2.11
pip install librosa==0.10.1

# Google Cloud APIs
pip install google-cloud-speech==2.21.0
pip install google-cloud-texttospeech==2.16.3
pip install google-generativeai==0.3.2

# Utility Libraries
pip install requests==2.31.0
pip install numpy==1.24.3
pip install matplotlib==3.7.2
pip install pygame==2.5.2  # For audio playback alternatives
```

### 3.2 Advanced Computer Vision Setup

#### OpenCV Configuration for Face Detection

```python
import cv2
import numpy as np

class FaceDetectionSystem:
    def __init__(self):
        # Load multiple detection models for robustness
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        # DNN-based face detection (more accurate)
        self.net = cv2.dnn.readNetFromTensorflow(
            'opencv_face_detector_uint8.pb',
            'opencv_face_detector.pbtxt'
        )
        
    def detect_faces_cascade(self, frame):
        """Fast Haar cascade detection"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )
        return faces
        
    def detect_faces_dnn(self, frame):
        """Accurate DNN-based detection"""
        h, w = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), [104, 117, 123])
        self.net.setInput(blob)
        detections = self.net.forward()
        
        faces = []
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5:  # Confidence threshold
                x1 = int(detections[0, 0, i, 3] * w)
                y1 = int(detections[0, 0, i, 4] * h)
                x2 = int(detections[0, 0, i, 5] * w)
                y2 = int(detections[0, 0, i, 6] * h)
                faces.append((x1, y1, x2-x1, y2-y1))
        return faces
```

#### Face Recognition Training System

```python
import face_recognition
import pickle
import os

class FaceRecognitionTrainer:
    def __init__(self):
        self.known_encodings = []
        self.known_names = []
        
    def train_face(self, name, image_folder):
        """Train recognition for a specific person"""
        encodings = []
        
        for filename in os.listdir(image_folder):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(image_folder, filename)
                image = face_recognition.load_image_file(image_path)
                
                # Find face encodings
                face_encodings = face_recognition.face_encodings(image)
                
                if face_encodings:
                    encodings.append(face_encodings[0])
                    
        # Average multiple encodings for better accuracy
        if encodings:
            avg_encoding = np.mean(encodings, axis=0)
            self.known_encodings.append(avg_encoding)
            self.known_names.append(name)
            
    def save_model(self, filename):
        """Save trained model"""
        data = {
            'encodings': self.known_encodings,
            'names': self.known_names
        }
        with open(filename, 'wb') as f:
            pickle.dump(data, f)
            
    def recognize_face(self, frame):
        """Recognize faces in frame"""
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        
        names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(
                self.known_encodings, face_encoding, tolerance=0.6
            )
            name = "Unknown"
            
            if True in matches:
                match_index = matches.index(True)
                name = self.known_names[match_index]
                
            names.append(name)
            
        return list(zip(face_locations, names))
```

### 3.3 Audio Processing & Voice Recognition

#### Advanced Audio Recording System

```python
import sounddevice as sd
import soundfile as sf
import numpy as np
from scipy import signal

class AudioProcessor:
    def __init__(self, sample_rate=16000, channels=1):
        self.sample_rate = sample_rate
        self.channels = channels
        self.recording = False
        
    def record_audio(self, duration=5, auto_stop=True):
        """Record audio with noise reduction"""
        print("Recording... Speak now!")
        
        # Record with higher sample rate for better quality
        audio_data = sd.rec(
            int(duration * self.sample_rate),
            samplerate=self.sample_rate,
            channels=self.channels,
            dtype='float64'
        )
        sd.wait()  # Wait for recording to complete
        
        # Apply noise reduction
        audio_data = self.reduce_noise(audio_data)
        
        return audio_data
        
    def reduce_noise(self, audio_data):
        """Simple noise reduction using high-pass filter"""
        # Remove low-frequency noise
        sos = signal.butter(10, 300, btype='high', fs=self.sample_rate, output='sos')
        filtered_audio = signal.sosfilt(sos, audio_data.flatten())
        
        return filtered_audio.reshape(-1, 1)
        
    def detect_speech_activity(self, audio_data, threshold=0.01):
        """Voice Activity Detection (VAD)"""
        # Calculate RMS energy
        rms = np.sqrt(np.mean(audio_data**2))
        return rms > threshold
        
    def save_audio(self, audio_data, filename):
        """Save audio to file"""
        sf.write(filename, audio_data, self.sample_rate)
```

### 3.4 Integrated Robot Simulation Framework

#### Complete Robot Personality Simulator

```python
import threading
import time
from enum import Enum

class RobotState(Enum):
    IDLE = "idle"
    LISTENING = "listening"
    THINKING = "thinking"
    RESPONDING = "responding"
    HAPPY = "happy"
    CURIOUS = "curious"
    SLEEPING = "sleeping"

class RobotSimulator:
    def __init__(self):
        self.state = RobotState.IDLE
        self.face_detector = FaceDetectionSystem()
        self.face_recognizer = FaceRecognitionTrainer()
        self.audio_processor = AudioProcessor()
        self.running = True
        
        # Load trained face recognition model if exists
        try:
            with open('face_model.pkl', 'rb') as f:
                data = pickle.load(f)
                self.face_recognizer.known_encodings = data['encodings']
                self.face_recognizer.known_names = data['names']
        except FileNotFoundError:
            print("No trained face model found. Train faces first.")
            
    def display_eyes(self, expression):
        """Simulate OLED display"""
        expressions = {
            "idle": "( -.- )",
            "happy": "( ^.^ )",
            "curious": "( o.O )",
            "listening": "( @.@ )",
            "thinking": "( ?.? )",
            "sleeping": "( _._ )"
        }
        print(f"[EYES]: {expressions.get(expression, expression)}")
        
    def play_sound(self, sound_type):
        """Simulate speaker output"""
        sounds = {
            "startup": "♪ Beep boop! ♪",
            "happy": "♪ Purr purr ♪",
            "curious": "♪ Hmm? ♪",
            "listening": "♪ Bing! ♪",
            "error": "♪ Womp womp ♪"
        }
        print(f"[AUDIO]: {sounds.get(sound_type, sound_type)}")
        
    def camera_loop(self):
        """Continuous camera monitoring"""
        cap = cv2.VideoCapture(0)
        
        while self.running:
            ret, frame = cap.read()
            if not ret:
                continue
                
            # Detect and recognize faces
            faces = self.face_detector.detect_faces_cascade(frame)
            
            if len(faces) > 0:
                recognized_faces = self.face_recognizer.recognize_face(frame)
                
                for (top, right, bottom, left), name in recognized_faces:
                    if name != "Unknown":
                        if self.state == RobotState.IDLE:
                            self.state = RobotState.HAPPY
                            self.display_eyes("happy")
                            self.play_sound("happy")
                            print(f"[RECOGNITION]: Hello, {name}!")
                    else:
                        if self.state == RobotState.IDLE:
                            self.state = RobotState.CURIOUS
                            self.display_eyes("curious")
                            self.play_sound("curious")
                            print("[RECOGNITION]: Hello there!")
                            
                # Draw rectangles around faces
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                    
            else:
                # No faces detected, return to idle
                if self.state in [RobotState.HAPPY, RobotState.CURIOUS]:
                    self.state = RobotState.IDLE
                    self.display_eyes("idle")
                    
            cv2.imshow('Robot Vision', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        cap.release()
        cv2.destroyAllWindows()
        
    def keyboard_input_loop(self):
        """Simulate hardware sensors with keyboard"""
        print("\n=== Robot Control ===")
        print("Commands:")
        print("  't' - Touch sensor")
        print("  's' - Shake sensor")
        print("  'v' - Voice command")
        print("  'q' - Quit")
        print("=====================\n")
        
        while self.running:
            try:
                cmd = input().lower().strip()
                
                if cmd == 't':
                    self.state = RobotState.HAPPY
                    self.display_eyes("happy")
                    self.play_sound("happy")
                    print("[TOUCH]: Pet detected!")
                    
                elif cmd == 's':
                    self.display_eyes("thinking")
                    self.play_sound("error")
                    print("[MOTION]: Shake detected!")
                    
                elif cmd == 'v':
                    self.handle_voice_command()
                    
                elif cmd == 'q':
                    self.running = False
                    break
                    
            except KeyboardInterrupt:
                self.running = False
                break
                
    def handle_voice_command(self):
        """Process voice interaction"""
        self.state = RobotState.LISTENING
        self.display_eyes("listening")
        self.play_sound("listening")
        
        # Record audio
        audio_data = self.audio_processor.record_audio(duration=3)
        
        self.state = RobotState.THINKING
        self.display_eyes("thinking")
        
        # Here you would integrate with Google APIs
        # For simulation, we'll use text input
        user_input = input("[VOICE]: What did you say? ")
        
        self.state = RobotState.RESPONDING
        response = f"I heard you say: {user_input}"
        print(f"[RESPONSE]: {response}")
        self.play_sound("happy")
        
        # Return to idle
        time.sleep(2)
        self.state = RobotState.IDLE
        self.display_eyes("idle")
        
    def run(self):
        """Start the robot simulation"""
        print("🤖 Pico Robot Simulator Starting...")
        self.display_eyes("idle")
        self.play_sound("startup")
        
        # Start camera monitoring in separate thread
        camera_thread = threading.Thread(target=self.camera_loop)
        camera_thread.daemon = True
        camera_thread.start()
        
        # Start keyboard input loop
        self.keyboard_input_loop()
        
        print("🤖 Pico Robot Simulator Stopped.")

# Usage
if __name__ == "__main__":
    robot = RobotSimulator()
    robot.run()
```

---

## 4. Summary & Final Recommendation

### Follow the Software-First Approach

#### Phase 1: PC Development (Recommended Start)

Use Python on your PC with the "Development Stack" above. This allows you to:

- Develop and test all AI logic without hardware investment
- Use your laptop's webcam for face detection/recognition development
- Use your laptop's mic and speakers for voice interaction
- Simulate all robot behaviors and test the complete personality engine

#### Phase 2: Hardware Implementation

After Phase 1 is complete, implement the "Online Stack" on ESP32-S3-EYE hardware.

### Hybrid Approach (Best of Both Worlds)

- **Offline:** Wake-word ("Pico"), face detection, and basic commands work instantly with no Wi-Fi
- **Online:** Complex questions and conversations connect to Google APIs
- **Personal Recognition:** Face and voice recognition work both online and offline

This hybrid approach provides the optimal balance between functionality, privacy, and reliability.