# Project Structure and Organization
**Document Type:** Organizational Guide  
**Version:** 1.0  
**Date:** November 3, 2025  
**Audience:** All Team Members, Project Managers  
**Status:** Initial Draft  

---

## Document Metadata
- **Last Modified:** November 3, 2025
- **Document Owner:** Project Manager
- **Review Cycle:** Monthly
- **Dependencies:** None (standalone document)
- **Related Documents:** All technical documentation

---

## Executive Summary for Non-Technical Stakeholders

This document defines the organizational structure for Project Aura's development. The project follows a monorepo approach, where all components (robot software, mobile app, cloud services, and website) are managed in a single repository. This structure enables coordinated development, shared code reuse, and simplified deployment processes.

**Key Organizational Benefits:**
- **Unified Development:** All components in one repository for easier coordination
- **Shared Resources:** Common code libraries reduce duplication and errors
- **Atomic Updates:** Changes across multiple components can be deployed together
- **Simplified CI/CD:** Single pipeline for all components with cross-component testing

---

## 1.0 Repository Structure Overview

### 1.1 Monorepo Architecture

Project Aura uses a monorepo structure to manage all system components in a single Git repository. This approach facilitates:

- **Cross-component coordination:** Changes affecting multiple components can be made atomically
- **Shared tooling and configuration:** Common build tools, linting, and testing frameworks
- **Simplified dependency management:** Internal dependencies are always in sync
- **Unified documentation:** All project documentation in one location

### 1.2 Top-Level Directory Structure

```
aura-project/
├── README.md                          # Project overview and quick start
├── LICENSE                            # Project license (Apache 2.0)
├── .gitignore                         # Git ignore patterns
├── .github/                           # GitHub workflows and templates
│   ├── workflows/                     # CI/CD pipeline definitions
│   ├── ISSUE_TEMPLATE/               # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md      # PR template
├── docs/                             # Complete project documentation
├── robot/                            # Robot software (ROS 2)
├── mobile/                           # Mobile application (Flutter)
├── cloud/                            # Cloud backend services
├── web/                              # Marketing website (Next.js)
├── shared/                           # Shared libraries and utilities
├── tools/                            # Development and deployment tools
├── scripts/                          # Build and deployment scripts
├── config/                           # Configuration files and templates
└── tests/                            # Integration and system tests
```

---

## 2.0 Robot Software Structure

### 2.1 ROS 2 Workspace Organization

The robot software follows ROS 2 conventions with a clear package hierarchy:

```
robot/
├── README.md                         # Robot software overview
├── aura_ws/                          # ROS 2 workspace
│   ├── src/                          # Source packages
│   │   ├── aura_sensors/             # Sensor integration package
│   │   │   ├── aura_sensors/         # Python package
│   │   │   │   ├── __init__.py
│   │   │   │   ├── camera_node.py    # Camera data acquisition
│   │   │   │   ├── audio_node.py     # Audio capture and processing
│   │   │   │   ├── imu_node.py       # IMU sensor interface
│   │   │   │   └── touch_node.py     # Touch sensor interface
│   │   │   ├── launch/               # Launch files
│   │   │   │   └── sensors.launch.py
│   │   │   ├── config/               # Configuration files
│   │   │   ├── test/                 # Unit tests
│   │   │   ├── package.xml           # Package metadata
│   │   │   └── setup.py              # Python package setup
│   │   │
│   │   ├── aura_ai/                  # AI processing package
│   │   │   ├── aura_ai/              # Python package
│   │   │   │   ├── __init__.py
│   │   │   │   ├── vision_processor.py    # Computer vision processing
│   │   │   │   ├── nlp_processor.py       # Natural language processing
│   │   │   │   ├── speech_processor.py    # Speech-to-text processing
│   │   │   │   └── tts_processor.py       # Text-to-speech synthesis
│   │   │   ├── models/               # AI model files
│   │   │   ├── launch/               # Launch files
│   │   │   ├── config/               # AI configuration
│   │   │   ├── test/                 # Unit tests
│   │   │   ├── package.xml
│   │   │   └── setup.py
│   │   │
│   │   ├── aura_core/                # Core personality engine
│   │   │   ├── aura_core/            # Python package
│   │   │   │   ├── __init__.py
│   │   │   │   ├── personality_engine.py  # Main personality logic
│   │   │   │   ├── behavior_tree.py       # Behavior coordination
│   │   │   │   ├── memory_manager.py      # Short-term memory
│   │   │   │   └── response_generator.py  # Response generation
│   │   │   ├── config/               # Personality configuration
│   │   │   │   ├── personality.yaml  # Personality parameters
│   │   │   │   └── behaviors.yaml    # Behavior definitions
│   │   │   ├── launch/
│   │   │   ├── test/
│   │   │   ├── package.xml
│   │   │   └── setup.py
│   │   │
│   │   ├── aura_navigation/          # Navigation and movement
│   │   │   ├── aura_navigation/      # Python package
│   │   │   │   ├── __init__.py
│   │   │   │   ├── slam_node.py      # SLAM implementation
│   │   │   │   ├── path_planner.py   # Path planning
│   │   │   │   └── motor_controller.py # Motor control
│   │   │   ├── maps/                 # Saved maps
│   │   │   ├── config/               # Navigation parameters
│   │   │   ├── launch/
│   │   │   ├── test/
│   │   │   ├── package.xml
│   │   │   └── setup.py
│   │   │
│   │   ├── aura_actuators/           # Actuator control package
│   │   │   ├── aura_actuators/       # Python package
│   │   │   │   ├── __init__.py
│   │   │   │   ├── servo_controller.py    # Servo motor control
│   │   │   │   ├── led_controller.py      # LED matrix control
│   │   │   │   └── expression_manager.py  # Facial expressions
│   │   │   ├── config/               # Actuator configurations
│   │   │   ├── launch/
│   │   │   ├── test/
│   │   │   ├── package.xml
│   │   │   └── setup.py
│   │   │
│   │   ├── aura_bringup/             # System launch package
│   │   │   ├── launch/               # System launch files
│   │   │   │   ├── aura_system.launch.py      # Complete system
│   │   │   │   ├── sensors_only.launch.py     # Sensors only
│   │   │   │   ├── ai_processing.launch.py    # AI components
│   │   │   │   └── simulation.launch.py       # Simulation mode
│   │   │   ├── config/               # System configurations
│   │   │   │   ├── robot_params.yaml # Robot parameters
│   │   │   │   └── system_config.yaml # System settings
│   │   │   ├── rviz/                 # RViz configurations
│   │   │   ├── package.xml
│   │   │   └── CMakeLists.txt
│   │   │
│   │   └── aura_msgs/                # Custom message definitions
│   │       ├── msg/                  # Message definitions
│   │       │   ├── PersonalityState.msg
│   │       │   ├── EmotionExpression.msg
│   │       │   └── InteractionEvent.msg
│   │       ├── srv/                  # Service definitions
│   │       ├── action/               # Action definitions
│   │       ├── package.xml
│   │       └── CMakeLists.txt
│   │
│   ├── build/                        # Build artifacts (gitignored)
│   ├── install/                      # Installation directory (gitignored)
│   └── log/                          # Build and runtime logs (gitignored)
│
├── simulation/                       # Simulation environments
│   ├── gazebo/                       # Gazebo simulation files
│   │   ├── worlds/                   # World files
│   │   ├── models/                   # Robot models
│   │   └── plugins/                  # Custom plugins
│   └── rviz/                         # RViz configurations
│
├── hardware/                         # Hardware-specific configurations
│   ├── raspberry_pi/                 # Raspberry Pi setup
│   ├── jetson/                       # NVIDIA Jetson setup
│   └── drivers/                      # Hardware drivers
│
└── deployment/                       # Deployment configurations
    ├── docker/                       # Docker configurations
    ├── systemd/                      # System service files
    └── scripts/                      # Deployment scripts
```

### 2.2 Package Dependencies

**Dependency Hierarchy:**
```
aura_bringup
├── aura_core
│   ├── aura_ai
│   ├── aura_sensors
│   └── aura_msgs
├── aura_navigation
│   └── aura_msgs
└── aura_actuators
    └── aura_msgs
```

---

## 3.0 Mobile Application Structure

### 3.1 Flutter Application Organization

```
mobile/
├── README.md                         # Mobile app documentation
├── pubspec.yaml                      # Flutter dependencies
├── android/                          # Android-specific files
├── ios/                              # iOS-specific files
├── lib/                              # Dart source code
│   ├── main.dart                     # Application entry point
│   ├── app/                          # App-level configuration
│   │   ├── app.dart                  # App widget
│   │   ├── routes.dart               # Route definitions
│   │   └── theme.dart                # App theme
│   │
│   ├── core/                         # Core utilities and services
│   │   ├── constants/                # App constants
│   │   ├── errors/                   # Error handling
│   │   ├── network/                  # Network utilities
│   │   ├── storage/                  # Local storage
│   │   └── utils/                    # Utility functions
│   │
│   ├── features/                     # Feature modules
│   │   ├── authentication/           # User authentication
│   │   │   ├── data/                 # Data layer
│   │   │   ├── domain/               # Business logic
│   │   │   └── presentation/         # UI layer
│   │   │
│   │   ├── robot_control/            # Robot control interface
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │
│   │   ├── settings/                 # App settings
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │
│   │   └── monitoring/               # Robot monitoring
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   │
│   └── shared/                       # Shared components
│       ├── widgets/                  # Reusable widgets
│       ├── models/                   # Data models
│       └── services/                 # Shared services
│
├── test/                             # Unit and widget tests
├── integration_test/                 # Integration tests
└── assets/                           # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

### 3.2 Architecture Pattern

The mobile app follows **Clean Architecture** principles with **BLoC** state management:

- **Presentation Layer:** UI widgets and BLoC components
- **Domain Layer:** Business logic and use cases
- **Data Layer:** Repository pattern with local and remote data sources

---

## 4.0 Cloud Backend Structure

### 4.1 Microservices Architecture

```
cloud/
├── README.md                         # Cloud services documentation
├── docker-compose.yml               # Local development setup
├── kubernetes/                       # Kubernetes deployment manifests
│   ├── namespaces/
│   ├── deployments/
│   ├── services/
│   └── ingress/
│
├── services/                         # Microservices
│   ├── auth-service/                 # Authentication service
│   │   ├── src/                      # Source code
│   │   ├── tests/                    # Unit tests
│   │   ├── Dockerfile                # Container definition
│   │   ├── requirements.txt          # Python dependencies
│   │   └── README.md
│   │
│   ├── device-service/               # Device management
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   ├── ai-service/                   # AI processing service
│   │   ├── src/
│   │   ├── models/                   # ML models
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   ├── telemetry-service/            # Data collection
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   └── api-gateway/                  # API gateway
│       ├── src/
│       ├── tests/
│       ├── Dockerfile
│       ├── requirements.txt
│       └── README.md
│
├── shared/                           # Shared libraries
│   ├── database/                     # Database utilities
│   ├── messaging/                    # Message queue utilities
│   ├── auth/                         # Authentication utilities
│   └── monitoring/                   # Monitoring utilities
│
├── infrastructure/                   # Infrastructure as Code
│   ├── terraform/                    # Terraform configurations
│   ├── ansible/                      # Ansible playbooks
│   └── helm/                         # Helm charts
│
└── scripts/                          # Deployment and utility scripts
    ├── deploy.sh
    ├── migrate.sh
    └── backup.sh
```

### 4.2 Service Communication

**Communication Patterns:**
- **Synchronous:** REST APIs for request-response patterns
- **Asynchronous:** Message queues (Apache Kafka) for event-driven communication
- **Real-time:** WebSocket connections for live updates

---

## 5.0 Website Structure

### 5.1 Next.js Application

```
web/
├── README.md                         # Website documentation
├── package.json                      # Node.js dependencies
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── robots.txt
│
├── src/                              # Source code
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── about/                    # About page
│   │   ├── products/                 # Product pages
│   │   ├── support/                  # Support pages
│   │   └── api/                      # API routes
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # UI components
│   │   ├── layout/                   # Layout components
│   │   ├── forms/                    # Form components
│   │   └── marketing/                # Marketing components
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── utils.ts                  # Utility functions
│   │   ├── api.ts                    # API client
│   │   └── constants.ts              # Constants
│   │
│   ├── styles/                       # Styling
│   │   ├── globals.css               # Global styles
│   │   └── components.css            # Component styles
│   │
│   └── types/                        # TypeScript type definitions
│       ├── api.ts
│       └── components.ts
│
├── content/                          # Content management
│   ├── blog/                         # Blog posts (MDX)
│   ├── docs/                         # Documentation (MDX)
│   └── legal/                        # Legal pages
│
└── tests/                            # Tests
    ├── __tests__/                    # Jest tests
    └── e2e/                          # End-to-end tests
```

---

## 6.0 Shared Libraries and Utilities

### 6.1 Cross-Platform Shared Code

```
shared/
├── README.md                         # Shared libraries documentation
├── protocols/                        # Communication protocols
│   ├── mqtt/                         # MQTT message definitions
│   ├── websocket/                    # WebSocket protocols
│   └── rest/                         # REST API specifications
│
├── models/                           # Data models
│   ├── robot/                        # Robot-specific models
│   ├── user/                         # User models
│   └── telemetry/                    # Telemetry models
│
├── utils/                            # Utility functions
│   ├── validation/                   # Data validation
│   ├── encryption/                   # Encryption utilities
│   └── logging/                      # Logging utilities
│
└── constants/                        # Shared constants
    ├── api_endpoints.py              # API endpoint definitions
    ├── error_codes.py                # Error code definitions
    └── system_limits.py              # System limit constants
```

---

## 7.0 Development Tools and Scripts

### 7.1 Development Tooling

```
tools/
├── README.md                         # Tools documentation
├── build/                            # Build tools
│   ├── docker/                       # Docker utilities
│   ├── ci/                           # CI/CD tools
│   └── packaging/                    # Package creation tools
│
├── testing/                          # Testing utilities
│   ├── fixtures/                     # Test fixtures
│   ├── mocks/                        # Mock services
│   └── performance/                  # Performance testing
│
├── deployment/                       # Deployment tools
│   ├── ansible/                      # Ansible playbooks
│   ├── terraform/                    # Infrastructure scripts
│   └── kubernetes/                   # K8s utilities
│
└── monitoring/                       # Monitoring and observability
    ├── grafana/                      # Grafana dashboards
    ├── prometheus/                   # Prometheus configs
    └── logging/                      # Log aggregation
```

### 7.2 Build and Deployment Scripts

```
scripts/
├── README.md                         # Scripts documentation
├── setup/                            # Environment setup
│   ├── install_dependencies.sh       # Install all dependencies
│   ├── setup_development.sh          # Development environment
│   └── setup_production.sh           # Production environment
│
├── build/                            # Build scripts
│   ├── build_robot.sh                # Build robot software
│   ├── build_mobile.sh               # Build mobile app
│   ├── build_cloud.sh                # Build cloud services
│   └── build_all.sh                  # Build everything
│
├── test/                             # Testing scripts
│   ├── run_unit_tests.sh             # Run unit tests
│   ├── run_integration_tests.sh      # Run integration tests
│   └── run_e2e_tests.sh              # Run end-to-end tests
│
└── deploy/                           # Deployment scripts
    ├── deploy_robot.sh               # Deploy to robot hardware
    ├── deploy_cloud.sh               # Deploy cloud services
    └── deploy_website.sh             # Deploy website
```

---

## 8.0 Configuration Management

### 8.1 Configuration Structure

```
config/
├── README.md                         # Configuration documentation
├── environments/                     # Environment-specific configs
│   ├── development/                  # Development environment
│   │   ├── robot.yaml
│   │   ├── cloud.yaml
│   │   └── mobile.yaml
│   │
│   ├── staging/                      # Staging environment
│   │   ├── robot.yaml
│   │   ├── cloud.yaml
│   │   └── mobile.yaml
│   │
│   └── production/                   # Production environment
│       ├── robot.yaml
│       ├── cloud.yaml
│       └── mobile.yaml
│
├── templates/                        # Configuration templates
│   ├── robot_config.template.yaml
│   ├── cloud_config.template.yaml
│   └── mobile_config.template.yaml
│
└── secrets/                          # Secret management (gitignored)
    ├── development/
    ├── staging/
    └── production/
```

### 8.2 Configuration Management Strategy

**Configuration Principles:**
- **Environment Separation:** Clear separation between dev, staging, and production
- **Secret Management:** Secrets stored separately and encrypted
- **Template-Based:** Use templates for consistent configuration structure
- **Version Control:** All non-secret configuration in version control

---

## 9.0 Testing Structure

### 9.1 Multi-Level Testing Strategy

```
tests/
├── README.md                         # Testing documentation
├── unit/                             # Unit tests (per component)
│   ├── robot/                        # Robot software unit tests
│   ├── mobile/                       # Mobile app unit tests
│   ├── cloud/                        # Cloud service unit tests
│   └── shared/                       # Shared library unit tests
│
├── integration/                      # Integration tests
│   ├── robot_ai_integration/         # Robot-AI integration
│   ├── mobile_cloud_integration/     # Mobile-Cloud integration
│   └── end_to_end_integration/       # Full system integration
│
├── performance/                      # Performance tests
│   ├── robot_performance/            # Robot performance tests
│   ├── cloud_load_tests/             # Cloud load testing
│   └── mobile_performance/           # Mobile app performance
│
├── security/                         # Security tests
│   ├── penetration_tests/            # Penetration testing
│   ├── vulnerability_scans/          # Vulnerability scanning
│   └── compliance_tests/             # Compliance validation
│
└── fixtures/                         # Test data and fixtures
    ├── sample_data/                  # Sample datasets
    ├── mock_responses/               # Mock API responses
    └── test_configurations/          # Test configurations
```

---

## 10.0 Documentation Structure

### 10.1 Comprehensive Documentation

```
docs/
├── README.md                         # Documentation index
├── 00_project_overview_v1.0.md       # Executive overview
├── 01_technical_architecture_v1.0.md # System architecture
├── 02_hardware_specifications_v1.0.md # Hardware requirements
├── 03_software_stack_v1.0.md         # Software components
├── 04_development_setup_v1.0.md      # Development environment
├── 05_implementation_guide_v1.0.md   # Implementation instructions
├── 06_testing_procedures_v1.0.md     # Testing framework
├── 07_project_structure_v1.0.md      # This document
│
├── api/                              # API documentation
│   ├── robot_api.md                  # Robot API reference
│   ├── cloud_api.md                  # Cloud API reference
│   └── mobile_api.md                 # Mobile API reference
│
├── deployment/                       # Deployment guides
│   ├── robot_deployment.md           # Robot deployment
│   ├── cloud_deployment.md           # Cloud deployment
│   └── mobile_deployment.md          # Mobile deployment
│
├── user_guides/                      # User documentation
│   ├── setup_guide.md                # Initial setup
│   ├── user_manual.md                # User manual
│   └── troubleshooting.md            # Troubleshooting guide
│
└── developer_guides/                 # Developer documentation
    ├── contributing.md               # Contribution guidelines
    ├── coding_standards.md           # Coding standards
    ├── architecture_decisions.md     # Architecture decisions
    └── release_process.md            # Release process
```

---

## 11.0 Version Control Strategy

### 11.1 Git Workflow

**Branching Strategy:**
- **main:** Production-ready code
- **develop:** Integration branch for features
- **feature/*:** Individual feature branches
- **release/*:** Release preparation branches
- **hotfix/*:** Critical bug fixes

**Commit Conventions:**
```
type(scope): description

feat(robot): add object detection capability
fix(mobile): resolve authentication timeout
docs(api): update robot API documentation
test(cloud): add integration tests for auth service
```

### 11.2 Release Management

**Semantic Versioning:**
- **Major (X.0.0):** Breaking changes
- **Minor (0.X.0):** New features, backward compatible
- **Patch (0.0.X):** Bug fixes, backward compatible

**Release Process:**
1. Feature development in feature branches
2. Integration testing in develop branch
3. Release candidate creation
4. Production deployment from main branch

---

## 12.0 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 3, 2025 | Complete project structure documentation | Project Manager |

---

## 13.0 Project Structure Checklist

**Repository Setup:**
- [ ] Monorepo structure established
- [ ] Git workflow and branching strategy defined
- [ ] CI/CD pipeline configuration complete
- [ ] Documentation structure implemented

**Component Organization:**
- [ ] Robot software packages properly structured
- [ ] Mobile application architecture defined
- [ ] Cloud services organized by domain
- [ ] Website structure follows Next.js best practices

**Development Infrastructure:**
- [ ] Shared libraries and utilities organized
- [ ] Configuration management system implemented
- [ ] Testing framework structure complete
- [ ] Development tools and scripts available

**Documentation and Standards:**
- [ ] Complete documentation structure
- [ ] Coding standards and guidelines defined
- [ ] API documentation framework established
- [ ] User and developer guides created

---

*This document provides the complete organizational structure for Project Aura's development. The monorepo approach ensures coordinated development across all components while maintaining clear separation of concerns and enabling efficient collaboration across teams.*