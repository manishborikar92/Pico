"""
PICO Simulation — Core Module
Contains the emotion engine, face renderer, and robot orchestrator
for PC-based development and testing of PICO's personality.
"""

from simulation.src.core.emotion_engine import EmotionEngine, RobotState
from simulation.src.core.face_renderer import FaceRenderer

__all__ = ['EmotionEngine', 'RobotState', 'FaceRenderer']
