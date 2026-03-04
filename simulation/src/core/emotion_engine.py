"""
Emotion Engine — The core state machine for PICO's personality.

Manages transitions between emotional states based on sensory inputs
(touch, voice, vision, IMU). Each state defines the robot's visual
expression, audio reaction, and head movement behavior.

Usage:
    engine = EmotionEngine()
    engine.on_state_change(callback_fn)
    engine.process_trigger('touch_detected')
    print(engine.current_state)  # RobotState.HAPPY
"""

from enum import Enum, auto
from dataclasses import dataclass, field
from typing import Optional, Callable, List, Dict
import time
import threading
import logging

logger = logging.getLogger(__name__)


# ─── Robot States ───────────────────────────────────────────────────
class RobotState(Enum):
    """All possible emotional states for the PICO robot."""
    BOOTING     = "booting"
    IDLE        = "idle"
    HAPPY       = "happy"
    CURIOUS     = "curious"
    LISTENING   = "listening"
    THINKING    = "thinking"
    CONFUSED    = "confused"
    LOVED       = "loved"
    SURPRISED   = "surprised"
    SLEEPY      = "sleepy"
    ERROR       = "error"
    LOW_BATTERY = "low_battery"
    OBEDIENT    = "obedient"
    DIZZY       = "dizzy"
    ANGRY       = "angry"


# ─── State Metadata ─────────────────────────────────────────────────
@dataclass(frozen=True)
class StateConfig:
    """Configuration for a single emotional state."""
    audio_file: str = ""
    timeout_seconds: float = 0.0       # 0 = no auto-timeout
    idle_return: bool = True            # Whether this state returns to IDLE
    eye_expression: str = "idle"        # Maps to web EyeExpression shape key


# State configuration table (matches PicoFace_System.md spec)
STATE_CONFIGS: Dict[RobotState, StateConfig] = {
    RobotState.BOOTING:     StateConfig(audio_file="startup_beep.wav",       timeout_seconds=1.0,  idle_return=True,  eye_expression="booting"),
    RobotState.IDLE:        StateConfig(audio_file="",                       timeout_seconds=0.0,  idle_return=False, eye_expression="idle"),
    RobotState.HAPPY:       StateConfig(audio_file="happy_chirp_01.wav",     timeout_seconds=5.0,  idle_return=True,  eye_expression="happy"),
    RobotState.CURIOUS:     StateConfig(audio_file="curious_hum_01.wav",     timeout_seconds=5.0,  idle_return=True,  eye_expression="curious"),
    RobotState.LISTENING:   StateConfig(audio_file="listening_bing.wav",      timeout_seconds=10.0, idle_return=True,  eye_expression="listening"),
    RobotState.THINKING:    StateConfig(audio_file="thinking_hum.wav",       timeout_seconds=15.0, idle_return=True,  eye_expression="thinking"),
    RobotState.CONFUSED:    StateConfig(audio_file="error_buzz.wav",         timeout_seconds=3.0,  idle_return=True,  eye_expression="confused"),
    RobotState.LOVED:       StateConfig(audio_file="loved_purr_01.wav",      timeout_seconds=0.0,  idle_return=False, eye_expression="loved"),
    RobotState.SURPRISED:   StateConfig(audio_file="excited_whistle_01.wav", timeout_seconds=3.0,  idle_return=True,  eye_expression="surprised"),
    RobotState.SLEEPY:      StateConfig(audio_file="sleepy_yawn_01.wav",     timeout_seconds=0.0,  idle_return=False, eye_expression="sleepy"),
    RobotState.ERROR:       StateConfig(audio_file="error_buzz.wav",         timeout_seconds=5.0,  idle_return=True,  eye_expression="error"),
    RobotState.LOW_BATTERY: StateConfig(audio_file="sleepy_yawn_01.wav",     timeout_seconds=0.0,  idle_return=False, eye_expression="low_battery"),
    RobotState.OBEDIENT:    StateConfig(audio_file="acknowledgment_chirp.wav", timeout_seconds=2.0, idle_return=True, eye_expression="obedient"),
    RobotState.DIZZY:       StateConfig(audio_file="error_buzz.wav",         timeout_seconds=3.0,  idle_return=True,  eye_expression="dizzy"),
    RobotState.ANGRY:       StateConfig(audio_file="error_buzz.wav",         timeout_seconds=3.0,  idle_return=True,  eye_expression="angry"),
}


# ─── Transition Definition ──────────────────────────────────────────
@dataclass(frozen=True)
class Transition:
    """Defines a valid state transition triggered by an input event."""
    trigger: str
    from_state: Optional[RobotState]    # None = any state
    to_state: RobotState
    priority: int = 0                   # Higher = takes precedence


# ─── Transition Table ───────────────────────────────────────────────
# Defines all valid trigger → state transitions.
# from_state=None means the transition can occur from any state.
TRANSITIONS: List[Transition] = [
    # ── Sensor Triggers ──
    Transition(trigger="known_face_detected",   from_state=RobotState.IDLE,      to_state=RobotState.HAPPY,     priority=1),
    Transition(trigger="unknown_face_detected",  from_state=RobotState.IDLE,      to_state=RobotState.CURIOUS,   priority=1),
    Transition(trigger="touch_detected",         from_state=RobotState.IDLE,      to_state=RobotState.HAPPY,     priority=2),
    Transition(trigger="petting_detected",       from_state=None,                 to_state=RobotState.LOVED,     priority=3),
    Transition(trigger="picked_up",              from_state=None,                 to_state=RobotState.SURPRISED, priority=4),

    # ── Voice Triggers ──
    Transition(trigger="wake_word_detected",     from_state=RobotState.IDLE,      to_state=RobotState.LISTENING, priority=5),
    Transition(trigger="wake_word_detected",     from_state=RobotState.SLEEPY,    to_state=RobotState.LISTENING, priority=5),
    Transition(trigger="speech_received",        from_state=RobotState.LISTENING, to_state=RobotState.THINKING,  priority=5),
    Transition(trigger="response_ready",         from_state=RobotState.THINKING,  to_state=RobotState.HAPPY,     priority=5),
    Transition(trigger="command_understood",      from_state=RobotState.THINKING,  to_state=RobotState.OBEDIENT,  priority=5),
    Transition(trigger="processing_error",       from_state=RobotState.THINKING,  to_state=RobotState.CONFUSED,  priority=5),

    # ── System Triggers ──
    Transition(trigger="idle_timeout",           from_state=RobotState.IDLE,      to_state=RobotState.SLEEPY,    priority=0),
    Transition(trigger="battery_low",            from_state=None,                 to_state=RobotState.LOW_BATTERY, priority=6),
    Transition(trigger="system_error",           from_state=None,                 to_state=RobotState.ERROR,     priority=7),

    # ── IMU / Accelerometer Triggers ──
    Transition(trigger="shaken",                 from_state=None,                 to_state=RobotState.DIZZY,     priority=4),
    Transition(trigger="shaken_aggressively",    from_state=None,                 to_state=RobotState.ANGRY,     priority=5),

    # ── Global Return Triggers ──
    Transition(trigger="any_stimulus",           from_state=RobotState.SLEEPY,    to_state=RobotState.IDLE,      priority=1),
    Transition(trigger="touch_stop",             from_state=RobotState.LOVED,     to_state=RobotState.IDLE,      priority=1),
    Transition(trigger="face_lost",              from_state=RobotState.HAPPY,     to_state=RobotState.IDLE,      priority=0),
    Transition(trigger="face_lost",              from_state=RobotState.CURIOUS,   to_state=RobotState.IDLE,      priority=0),
    Transition(trigger="error_resolved",         from_state=RobotState.ERROR,     to_state=RobotState.IDLE,      priority=1),
    Transition(trigger="boot_complete",          from_state=RobotState.BOOTING,   to_state=RobotState.IDLE,      priority=10),
]


# ─── State Change Callback Type ─────────────────────────────────────
StateChangeCallback = Callable[[RobotState, RobotState], None]


# ─── Emotion Engine ─────────────────────────────────────────────────
class EmotionEngine:
    """
    Core state machine for PICO's personality system.

    Processes sensory triggers and manages transitions between emotional
    states. Supports auto-timeout (states that return to IDLE after a
    configurable duration) and observer callbacks for state changes.

    Thread-safe: uses a lock for state mutations to support concurrent
    sensor input processing.
    """

    def __init__(self, initial_state: RobotState = RobotState.BOOTING):
        self._state = initial_state
        self._previous_state = initial_state
        self._state_entered_at = time.time()
        self._callbacks: List[StateChangeCallback] = []
        self._timeout_timer: Optional[threading.Timer] = None
        self._lock = threading.Lock()
        self._idle_timer: Optional[threading.Timer] = None
        self._idle_timeout_seconds = 60.0   # Time before IDLE → SLEEPY

        logger.info(f"EmotionEngine initialized in state: {initial_state.value}")

        # Start timeout for initial state if applicable
        self._schedule_timeout()

    @property
    def current_state(self) -> RobotState:
        """Current emotional state of the robot."""
        return self._state

    @property
    def previous_state(self) -> RobotState:
        """The state before the current one."""
        return self._previous_state

    @property
    def state_duration(self) -> float:
        """How long (seconds) the robot has been in the current state."""
        return time.time() - self._state_entered_at

    @property
    def state_config(self) -> StateConfig:
        """Configuration for the current state."""
        return STATE_CONFIGS.get(self._state, STATE_CONFIGS[RobotState.IDLE])

    def on_state_change(self, callback: StateChangeCallback) -> None:
        """Register a callback invoked on every state change."""
        self._callbacks.append(callback)

    def remove_callback(self, callback: StateChangeCallback) -> None:
        """Remove a previously registered callback."""
        self._callbacks = [cb for cb in self._callbacks if cb is not callback]

    def process_trigger(self, trigger: str) -> bool:
        """
        Process a sensory trigger and transition to a new state if valid.

        Args:
            trigger: The event name (e.g., 'touch_detected', 'wake_word_detected')

        Returns:
            True if a transition occurred, False otherwise.
        """
        with self._lock:
            # Find matching transitions, sorted by priority (highest first)
            candidates = [
                t for t in TRANSITIONS
                if t.trigger == trigger and (t.from_state is None or t.from_state == self._state)
            ]
            candidates.sort(key=lambda t: t.priority, reverse=True)

            if not candidates:
                logger.debug(f"No transition for trigger '{trigger}' in state {self._state.value}")
                return False

            best = candidates[0]
            if best.to_state == self._state:
                logger.debug(f"Trigger '{trigger}' leads to same state, ignoring")
                return False

            self._transition_to(best.to_state, trigger)
            return True

    def force_state(self, state: RobotState, reason: str = "forced") -> None:
        """Force transition to a specific state, bypassing transition rules."""
        with self._lock:
            self._transition_to(state, reason)

    def _transition_to(self, new_state: RobotState, trigger: str) -> None:
        """Internal: perform the actual state transition."""
        old_state = self._state
        self._previous_state = old_state
        self._state = new_state
        self._state_entered_at = time.time()

        logger.info(
            f"State transition: {old_state.value} → {new_state.value} "
            f"(trigger: {trigger})"
        )

        # Cancel any existing timeout
        self._cancel_timeout()

        # Schedule timeout for new state
        self._schedule_timeout()

        # Notify observers
        for callback in self._callbacks:
            try:
                callback(old_state, new_state)
            except Exception as e:
                logger.error(f"Callback error: {e}")

    def _schedule_timeout(self) -> None:
        """Schedule auto-return to IDLE if the current state has a timeout."""
        config = STATE_CONFIGS.get(self._state)
        if config and config.timeout_seconds > 0 and config.idle_return:
            self._timeout_timer = threading.Timer(
                config.timeout_seconds,
                self._on_timeout,
            )
            self._timeout_timer.daemon = True
            self._timeout_timer.start()
            logger.debug(
                f"Timeout scheduled: {config.timeout_seconds}s for {self._state.value}"
            )

        # Schedule idle timeout if we're in IDLE state
        if self._state == RobotState.IDLE:
            self._cancel_idle_timer()
            self._idle_timer = threading.Timer(
                self._idle_timeout_seconds,
                self._on_idle_timeout,
            )
            self._idle_timer.daemon = True
            self._idle_timer.start()

    def _on_timeout(self) -> None:
        """Called when a state's timeout expires — returns to IDLE."""
        with self._lock:
            if STATE_CONFIGS.get(self._state, StateConfig()).idle_return:
                logger.info(f"State {self._state.value} timed out, returning to IDLE")
                self._transition_to(RobotState.IDLE, "timeout")

    def _on_idle_timeout(self) -> None:
        """Called when the IDLE state has been held too long — go SLEEPY."""
        self.process_trigger("idle_timeout")

    def _cancel_timeout(self) -> None:
        """Cancel the current state timeout timer."""
        if self._timeout_timer:
            self._timeout_timer.cancel()
            self._timeout_timer = None

    def _cancel_idle_timer(self) -> None:
        """Cancel the idle-to-sleepy timer."""
        if self._idle_timer:
            self._idle_timer.cancel()
            self._idle_timer = None

    def shutdown(self) -> None:
        """Clean up timers on shutdown."""
        self._cancel_timeout()
        self._cancel_idle_timer()
        logger.info("EmotionEngine shut down")

    def __repr__(self) -> str:
        return (
            f"EmotionEngine(state={self._state.value}, "
            f"duration={self.state_duration:.1f}s)"
        )
