# Project PICO — AI Desktop Companion

> **Internal Team Documentation** — This repository is private and intended for internal development use only.

An emotionally responsive AI desktop companion robot that sees, hears, and reacts like a pet. PICO communicates through expressive sounds, animated eyes on an OLED display, and head movements — creating a non-verbal, pet-like interaction experience similar to R2-D2 or Pokemon.

---

## 🎯 Project Overview

PICO is a desktop robot companion that combines computer vision, natural language processing, and emotional AI to create a living, breathing presence on your desk. Unlike traditional smart assistants that simply answer questions, PICO behaves like a pet with personality, emotions, and awareness.

### Key Characteristics

- **Non-Verbal Communication**: Chirps, purrs, and whistles instead of speech
- **Emotionally Aware**: Recognizes faces, understands voice, and responds to touch
- **Expressive**: Animated OLED "eyes" display emotions like happiness, curiosity, and sleepiness
- **Interactive**: 2-axis head movement for nodding, shaking, and tracking
- **Stationary**: Designed to sit on your desk, not mobile

### Target Cost

₹6,500–₹8,900 (realistic market-based estimate for Indian market)

---

## 📁 Repository Structure

```
pico-robot/
├── docs/                    # Complete project documentation
│   ├── Project_Description.md
│   ├── Development_Plan.md
│   ├── Technology_Stack.md
│   ├── Hardware.md
│   ├── Features.md
│   ├── Project_Structure.md
│   ├── Sound_Bank_Guide.md
│   └── Windows_Development_Guide.md
│
├── simulation/              # Phase 1: PC-based Python development
│   ├── src/
│   │   ├── core/           # Emotion engine & robot core
│   │   ├── ai/             # Cloud AI integration
│   │   ├── vision/         # Face detection & recognition
│   │   ├── audio/          # Voice processing
│   │   ├── iot/            # Smart home integration
│   │   └── utils/          # Utilities
│   ├── config/             # Configuration files
│   └── tests/              # Test suite
│
├── firmware/                # Phase 2: ESP32-S3 embedded code (C++)
│   └── esp32/              # ESP32-S3-EYE implementation
│
├── web/                     # Project website (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   └── components/     # React components
│   └── public/             # Static assets
│
└── hardware/                # Phase 3: Physical design files (future)
    ├── mechanical/         # 3D models & CAD files
    ├── electronics/        # Schematics & PCB designs
    └── assembly/           # Assembly instructions
```

---

## 🚀 Development Philosophy

### Software-First Methodology

PICO follows a revolutionary **software-first approach** that minimizes risk and cost:

1. **Phase 1 (Weeks 1-4)**: Develop complete AI personality in Python on your PC
   - Use laptop webcam, microphone, and speakers
   - Perfect all algorithms before hardware investment
   - Zero hardware costs during development

2. **Phase 2 (Weeks 5-7)**: Port Python code to ESP32-S3 hardware
   - Translate to C++/Arduino
   - Optimize for embedded systems
   - Test on development board

3. **Phase 3 (Weeks 8-9)**: Physical assembly and integration
   - 3D print enclosure
   - Assemble components
   - Final system testing

**Key Advantage**: Validate all concepts before spending ₹6,500+ on hardware.

---

## 🛠️ Technology Stack

### Development Environment (Phase 1)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Language** | Python 3.10+ | AI development & simulation |
| **Computer Vision** | OpenCV, face_recognition | Face detection & recognition |
| **Audio Processing** | sounddevice, soundfile | Voice recording & playback |
| **Speech-to-Text** | Google Cloud Speech-to-Text | Voice transcription (60 min/month free) |
| **AI/NLP** | Google Gemini 1.5 Flash | Natural language understanding (1,500 req/day free) |
| **Sound Effects** | Pre-recorded .wav files | Non-verbal pet-like communication |

### Hardware Platform (Phase 2)

| Component | Specification | Cost (₹) |
|-----------|--------------|----------|
| **Main Board** | ESP32-S3-EYE (dual-core 240MHz, 8MB PSRAM, 2MP camera) | 4,200-5,500 |
| **Display** | 0.96" OLED SSD1306 (128×64, I2C) | 280-420 |
| **Audio** | MAX98357A I2S amplifier + 28mm speaker | 300-470 |
| **Battery** | 3.7V 1000mAh LiPo + TP4056 USB-C charger | 570-830 |
| **Sensors** | MPU-6050 IMU + TTP223 touch sensor | 210-320 |
| **Enclosure** | 3D printed PLA (200g) | 600-1,200 |
| **Total** | | **6,500-8,900** |

### Web Platform

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Next.js 15+ (App Router) | Static site generation & SEO |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Animation** | Framer Motion, Lenis | Smooth animations & interactions |
| **UI Components** | Radix UI, shadcn/ui | Accessible component primitives |
| **Documentation** | MDX (next-mdx-remote) | Markdown-based docs |

---

## 💻 Getting Started

### Prerequisites

- **Operating System**: Windows 11, macOS, or Linux
- **Python**: 3.10 or higher
- **Node.js**: 20+ (for web development)
- **Git**: For version control
- **IDE**: Visual Studio Code (recommended)

### Quick Start — Simulation Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pico-robot
   ```

2. **Set up Python environment**
   ```bash
   # Create virtual environment
   python -m venv pico_env
   
   # Activate (Windows)
   pico_env\Scripts\activate
   
   # Activate (macOS/Linux)
   source pico_env/bin/activate
   
   # Install dependencies
   cd simulation
   pip install -r requirements.txt
   ```

3. **Test hardware compatibility**
   ```bash
   python scripts/test-hardware.py
   ```

4. **Run the robot simulator**
   ```bash
   python src/main.py
   ```

### Quick Start — Web Development

1. **Navigate to web directory**
   ```bash
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📚 Core Features

### Vision System
- ✅ Real-time face detection using OpenCV
- ✅ Face recognition with training capability
- ✅ Personal identification with customized reactions
- ✅ Privacy-aware operation

### Voice Interaction
- ✅ Wake-word detection ("Pico")
- ✅ Speech-to-text via Google Cloud
- ✅ Natural language understanding via Gemini
- ✅ Non-verbal responses (sounds only, no TTS)

### Emotion Engine
- ✅ State machine with 11 emotional states
- ✅ Context-aware reactions
- ✅ Expressive OLED animations
- ✅ Sound bank with 12+ pet-like sounds

### Physical Interaction
- 🔄 Touch sensor for petting (hardware phase)
- 🔄 Motion detection via IMU (hardware phase)
- 🔄 2-axis head movement (hardware phase)
- 🔄 Battery monitoring (hardware phase)

### Smart Home Integration
- 🔄 MQTT support for IoT devices
- 🔄 Home Assistant integration
- 🔄 Custom API endpoints

**Legend**: ✅ Implemented | 🔄 Planned | ❌ Not planned for v1.0

---

## 🎨 Design System

### Color Palette

**Base Colors**
- Cream Base: `#FDFBF4` (primary background)
- Warm White: `#FFFEF9` (card surfaces)
- Ink: `#1C1917` (primary text)

**Rainbow Accents** (for emotional expression)
- Coral Red: `#FF6B6B` (error, warning)
- Warm Orange: `#FF9E40` (energy, hardware)
- Golden Yellow: `#FFCB47` (happy, success)
- Lime Green: `#7ED957` (success, online)
- Teal: `#4ECDC4` (AI features)
- Sky Blue: `#45B7D1` (vision, info)
- Periwinkle: `#8B9CF4` (primary actions)
- Lavender: `#C77DFF` (advanced AI)
- Pink Rose: `#FF85A1` (affection, loved)

### Typography

- **Display/Headings**: DM Sans (friendly, rounded)
- **Body Text**: Inter (excellent readability)
- **Code**: JetBrains Mono (clean monospace)

---

## 🧪 Testing

### Simulation Tests

```bash
cd simulation
pytest tests/
```

### Hardware Tests (Phase 2)

```bash
cd firmware/esp32
pio test
```

### Web Tests

```bash
cd web
npm run lint
npm run build
```

---

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Project Description](docs/Project_Description.md)**: Vision, goals, and target users
- **[Development Plan](docs/Development_Plan.md)**: Complete 9-week development roadmap
- **[Technology Stack](docs/Technology_Stack.md)**: Detailed API integration guide
- **[Hardware Guide](docs/Hardware.md)**: BOM, wiring diagrams, and assembly
- **[Features](docs/Features.md)**: Complete feature specifications
- **[PicoFace System](docs/PicoFace_System.md)**: Face animation system, emotional states, and component API
- **[Sound Bank Guide](docs/Sound_Bank_Guide.md)**: Creating PICO's voice
- **[Windows Guide](docs/Windows_Development_Guide.md)**: Windows-specific setup

---

## 🌐 Website

The project website is built with Next.js and showcases PICO's capabilities:

- **Live Site**: https://pico.vaelix.in
- **Source**: `web/` directory
- **Features**:
  - Interactive PICO face animation
  - Comprehensive documentation
  - Hardware specifications
  - Development guides

### Website Development

```bash
cd web
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

---

## 🔐 API Keys & Configuration

### Required API Keys (Phase 1)

1. **Google Cloud Speech-to-Text**
   - Free tier: 60 minutes/month
   - Setup: https://cloud.google.com/speech-to-text

2. **Google Gemini API**
   - Free tier: 1,500 requests/day
   - Setup: https://ai.google.dev/

### Configuration Files

```bash
# Copy example configuration
cp simulation/config/settings.json.example simulation/config/settings.json

# Add your API keys
# Edit simulation/config/settings.json
```

**Important**: Never commit API keys to version control. All sensitive files are in `.gitignore`.

---

## 🤝 Team Workflow

### Branch Strategy

```
main              # Stable release branch
├── develop       # Integration branch
├── feature/*     # New features
├── bugfix/*      # Bug fixes
└── hotfix/*      # Critical fixes
```

### Commit Convention

```
feat(simulation): add emotion detection algorithm
fix(firmware): resolve camera initialization issue
docs(guides): update Windows setup instructions
test(ai): add face recognition unit tests
refactor(hardware): optimize power management
```

### Code Review Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Submit pull request to `develop`
4. Require 1 approval before merge
5. Squash and merge to keep history clean

---

## 🐛 Troubleshooting

### Common Issues

**Camera not working**
```bash
# Windows: Check privacy settings
# Settings > Privacy & Security > Camera
# Enable camera access for Python
```

**Microphone not detecting sound**
```bash
# Test audio input
python simulation/scripts/test-hardware.py
```

**Import errors**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r simulation/requirements.txt
```

**Web build fails**
```bash
# Clear Next.js cache
cd web
rm -rf .next
npm run build
```

---

## 📊 Project Status

### Current Phase: Phase 1 (Simulation Development)

- [x] Project structure established
- [x] Documentation complete
- [x] Website deployed
- [x] PicoFace web component (8 core expressions + boot-up + idle behaviors)
- [ ] Extended emotional states (thinking, error, dizzy, angry, obedient, low_battery)
- [ ] Emotion engine implementation (Python simulation)
- [ ] Face recognition training
- [ ] Voice interaction integration
- [ ] Sound bank creation
- [ ] Complete simulation testing

### Next Milestones

1. **Complete Phase 1** (Target: Week 4)
   - Fully functional Python simulation
   - Trained face recognition models
   - Complete sound bank
   - Comprehensive testing

2. **Begin Phase 2** (Target: Week 5)
   - ESP32-S3-EYE hardware acquisition
   - C++ code translation
   - Hardware testing

3. **Complete Phase 3** (Target: Week 9)
   - 3D printed enclosure
   - Full assembly
   - System integration
   - Final testing

---

## 📝 License

This project is private and proprietary. All rights reserved.

**Internal Use Only** — Not for public distribution or open-source release.

---

## 👥 Team

**Project Lead**: Vaelix  
**Website**: https://www.vaelix.in

---

## 📞 Support

For internal team support:

- **Documentation**: Check `docs/` directory first
- **Issues**: Use GitHub Issues for bug reports
- **Questions**: Team discussion channels

---

## 🎯 Project Goals

### Short-term (Phase 1)
- Complete Python simulation with all AI features
- Train face recognition for team members
- Create complete sound bank
- Validate all algorithms

### Medium-term (Phase 2-3)
- Port to ESP32-S3 hardware
- Assemble physical prototype
- Complete system integration
- Performance optimization

### Long-term (Future)
- Multi-user support
- Advanced emotion recognition
- Mobile app integration
- Community features

---

**Last Updated**: March 2, 2026  
**Version**: 1.0.0  
**Status**: Active Development
