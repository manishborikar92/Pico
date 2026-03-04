"""
Robot Core — Main orchestrator for PICO's simulation.

Ties together the EmotionEngine and FaceRenderer to create a complete
interactive simulation of PICO's behavior. This module is the entry
point for PC-based development, allowing developers to test the
full personality system before any hardware is involved.

Usage:
    from simulation.src.core.robot_core import PicoRobot

    robot = PicoRobot()
    robot.start()

    # Simulate inputs
    robot.trigger("touch_detected")
    robot.trigger("wake_word_detected")
    robot.trigger("speech_received")

    robot.shutdown()
"""

import time
import threading
import logging
from typing import Optional

from simulation.src.core.emotion_engine import EmotionEngine, RobotState, STATE_CONFIGS
from simulation.src.core.face_renderer import FaceRenderer

logger = logging.getLogger(__name__)


class PicoRobot:
    """
    Main robot orchestrator — connects the EmotionEngine with the
    FaceRenderer and provides a high-level API for simulation.

    Features:
        - Real-time face rendering on state changes
        - Interactive CLI mode for manual trigger testing
        - Idle behavior simulation (random blinking via logging)
        - Boot-up sequence animation
        - Thread-safe trigger processing
    """

    def __init__(
        self,
        use_color: bool = True,
        compact_mode: bool = False,
        auto_boot: bool = True,
    ):
        """
        Initialize the PICO robot simulation.

        Args:
            use_color:    Enable ANSI colors in terminal output
            compact_mode: Use one-line face rendering
            auto_boot:    Automatically run the boot-up sequence
        """
        self.engine = EmotionEngine(
            initial_state=RobotState.BOOTING if auto_boot else RobotState.IDLE
        )
        self.renderer = FaceRenderer(use_color=use_color, compact=compact_mode)
        self._running = False
        self._boot_completed = False

        # Register state change callback
        self.engine.on_state_change(self._on_state_change)

    def start(self) -> None:
        """Start the robot — run the boot-up sequence and enter IDLE."""
        self._running = True
        logger.info("PICO Robot starting up...")

        if self.engine.current_state == RobotState.BOOTING:
            self._run_boot_sequence()
        else:
            self._boot_completed = True
            self.renderer.render(self.engine.current_state)

    def _run_boot_sequence(self) -> None:
        """
        Simulate the boot-up animation sequence.
        Matches the web PicoFace boot timing:
            0ms   → Show booting eyes (dim lines)
            300ms → Left eye brightens
            500ms → Right eye brightens
            800ms → Blink
            1000ms→ Transition to IDLE
        """
        self.renderer.clear_screen()
        print("\n  ⚡ PICO Booting...\n")
        self.renderer.render(RobotState.BOOTING)

        time.sleep(0.3)
        print("  ▸ Left eye online")

        time.sleep(0.2)
        print("  ▸ Right eye online")

        time.sleep(0.3)
        print("  ▸ Systems check... ✓")

        time.sleep(0.2)
        self._boot_completed = True
        self.engine.process_trigger("boot_complete")

    def trigger(self, trigger_name: str) -> bool:
        """
        Process a sensory trigger.

        Args:
            trigger_name: Event name (e.g., 'touch_detected', 'wake_word_detected')

        Returns:
            True if a state transition occurred, False otherwise.
        """
        if not self._running:
            logger.warning("Robot is not running, ignoring trigger")
            return False

        logger.info(f"Trigger received: {trigger_name}")
        return self.engine.process_trigger(trigger_name)

    def _on_state_change(self, old_state: RobotState, new_state: RobotState) -> None:
        """Callback: render the face whenever the emotional state changes."""
        if not self._boot_completed and new_state != RobotState.IDLE:
            return

        print()
        self.renderer.render_transition(old_state, new_state)

        # Log the audio that would play
        config = STATE_CONFIGS.get(new_state)
        if config and config.audio_file:
            print(f"  🔊 Playing: {config.audio_file}")

    @property
    def state(self) -> RobotState:
        """Current emotional state."""
        return self.engine.current_state

    @property
    def expression(self) -> str:
        """Current eye expression string (matches web EyeExpression shape keys)."""
        return self.engine.state_config.eye_expression

    def shutdown(self) -> None:
        """Gracefully shut down the robot."""
        self._running = False
        self.engine.shutdown()
        logger.info("PICO Robot shut down")
        print("\n  ⚡ PICO shutting down... goodbye!\n")

    def __repr__(self) -> str:
        return f"PicoRobot(state={self.state.value}, running={self._running})"


# ─── Interactive CLI ────────────────────────────────────────────────
# Available triggers for the interactive mode
AVAILABLE_TRIGGERS = [
    "known_face_detected",
    "unknown_face_detected",
    "touch_detected",
    "petting_detected",
    "picked_up",
    "wake_word_detected",
    "speech_received",
    "response_ready",
    "command_understood",
    "processing_error",
    "idle_timeout",
    "battery_low",
    "system_error",
    "shaken",
    "shaken_aggressively",
    "any_stimulus",
    "touch_stop",
    "face_lost",
    "error_resolved",
]


def interactive_mode():
    """
    Run an interactive CLI session for testing PICO's personality.

    Commands:
        - Type a trigger name to process it
        - 'list'  to see available triggers
        - 'state' to see current state info
        - 'faces' to preview all face expressions
        - 'quit'  to exit
    """
    logging.basicConfig(level=logging.WARNING)

    robot = PicoRobot(use_color=True, compact_mode=False, auto_boot=True)
    robot.start()

    print("\n" + "=" * 50)
    print("  🤖 PICO Interactive Simulator")
    print("=" * 50)
    print("  Commands:")
    print("    • Type a trigger name to test (e.g., 'touch_detected')")
    print("    • 'list'   — Show all available triggers")
    print("    • 'state'  — Show current state info")
    print("    • 'faces'  — Preview all face expressions")
    print("    • 'quit'   — Exit the simulator")
    print("=" * 50 + "\n")

    try:
        while True:
            try:
                user_input = input("  trigger> ").strip().lower()
            except EOFError:
                break

            if not user_input:
                continue

            if user_input in ("quit", "exit", "q"):
                break

            if user_input == "list":
                print("\n  Available triggers:")
                for i, t in enumerate(AVAILABLE_TRIGGERS, 1):
                    print(f"    {i:2d}. {t}")
                print()
                continue

            if user_input == "state":
                print(f"\n  Current state:    {robot.state.value}")
                print(f"  Previous state:   {robot.engine.previous_state.value}")
                print(f"  Duration:         {robot.engine.state_duration:.1f}s")
                print(f"  Eye expression:   {robot.expression}")
                config = robot.engine.state_config
                print(f"  Audio file:       {config.audio_file or '(none)'}")
                print(f"  Auto-timeout:     {config.timeout_seconds}s" if config.timeout_seconds else "  Auto-timeout:     (none)")
                print()
                continue

            if user_input == "faces":
                renderer = FaceRenderer(use_color=True, compact=False)
                for state in RobotState:
                    renderer.render(state)
                continue

            # Try numeric input (shortcut for trigger list)
            if user_input.isdigit():
                idx = int(user_input) - 1
                if 0 <= idx < len(AVAILABLE_TRIGGERS):
                    user_input = AVAILABLE_TRIGGERS[idx]
                else:
                    print(f"  ❌ Invalid number. Use 1-{len(AVAILABLE_TRIGGERS)}")
                    continue

            # Process the trigger
            if user_input in AVAILABLE_TRIGGERS:
                success = robot.trigger(user_input)
                if not success:
                    print(f"  ⚠  No transition for '{user_input}' in state '{robot.state.value}'")
            else:
                print(f"  ❌ Unknown trigger: '{user_input}'")
                print("  Type 'list' to see available triggers")

    except KeyboardInterrupt:
        print("\n")

    robot.shutdown()


if __name__ == "__main__":
    interactive_mode()
