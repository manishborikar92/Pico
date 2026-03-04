"""
Face Renderer — Console-based and programmatic face renderer for PICO.

Renders ASCII art eye expressions matching the web PicoFace component's
emotional states. Simulates what the 0.96" OLED display (128×64, SSD1306)
will show on the physical robot.

Usage:
    renderer = FaceRenderer()
    renderer.render(RobotState.HAPPY)

    # Or get raw face string
    face = renderer.get_face(RobotState.CURIOUS)
    print(face)
"""

import os
import sys
from typing import Optional

from simulation.src.core.emotion_engine import RobotState


# ─── ASCII Face Art ─────────────────────────────────────────────────
# Each face uses a consistent format:
#   - Top/bottom border with rounded corners
#   - Two "eyes" separated by a nose dot
#   - Expression-specific eye shapes
#
# The art is designed to be recognizable at 60-char width in a terminal.

FACE_ART = {
    RobotState.BOOTING: r"""
╭──────────────────────────────────╮
│                                  │
│       ──────     ──────          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.IDLE: r"""
╭──────────────────────────────────╮
│                                  │
│       ┌──┐         ┌──┐          │
│       │○ │    .    │○ │          │
│       └──┘         └──┘          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.HAPPY: r"""
╭──────────────────────────────────╮
│                                  │
│        ╱‾‾╲       ╱‾‾╲           │
│       ╱ ^^ ╲  .  ╱ ^^ ╲          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.CURIOUS: r"""
╭──────────────────────────────────╮
│                                  │
│       ╭────╮       ╭──╮          │
│       │ O  │   .   │o │          │
│       ╰────╯       ╰──╯          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.LISTENING: r"""
╭──────────────────────────────────╮
│                                  │
│       ╭──╮         ╭──╮          │
│       │@ │    .    │@ │          │
│       ╰──╯         ╰──╯          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.THINKING: r"""
╭──────────────────────────────────╮
│                                  │
│                                  │
│        · ·    .     · ·          │
│                                  │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.CONFUSED: r"""
╭──────────────────────────────────╮
│         ╱                        │
│       ╭──╮                       │
│       │? │    .      ─           │
│       ╰──╯                       │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.LOVED: r"""
╭──────────────────────────────────╮
│                                  │
│       ╱╲  ╱╲     ╱╲  ╱╲          │
│       ╲ ♥♥ ╱  .  ╲ ♥♥ ╱          │
│        ╲  ╱       ╲  ╱           │
│         ╲╱         ╲╱            │
╰──────────────────────────────────╯
""",

    RobotState.SURPRISED: r"""
╭──────────────────────────────────╮
│                                  │
│       ╭────╮     ╭────╮          │
│       │ OO │  .  │ OO │          │
│       ╰────╯     ╰────╯          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.SLEEPY: r"""
╭──────────────────────────────────╮
│                                  │
│                                  │
│       ─═══─   .   ─═══─          │
│                                  │
│                          Zzz     │
╰──────────────────────────────────╯
""",

    RobotState.ERROR: r"""
╭──────────────────────────────────╮
│                                  │
│         ┃             ┃          │
│         ┃      .      ┃          │
│         •             •          │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.LOW_BATTERY: r"""
╭──────────────────────────────────╮
│                                  │
│                                  │
│       ..___..  .  ..___..        │
│                                  │
│                  [▮░░░]  LOW    │
╰──────────────────────────────────╯
""",

    RobotState.OBEDIENT: r"""
╭──────────────────────────────────╮
│                                  │
│        ╱‾‾╲       ╱‾‾╲           │
│       ╱ ‿‿ ╲  .  ╱ ‿‿ ╲       │
│                                  │
╰──────────────────────────────────╯
""",

    RobotState.DIZZY: r"""
╭──────────────────────────────────╮
│                                  │
│       ╭──╮         ╭──╮          │
│       │@ │    ~    │@ │          │
│       ╰──╯         ╰──╯          │
│                    *   *         │
╰──────────────────────────────────╯
""",

    RobotState.ANGRY: r"""
╭──────────────────────────────────╮
│                                  │
│       ╲▔▔╲       ╱▔▔╱         │
│       ╱  o ╲  .  ╱ o  ╲          │
│        ‾‾‾        ‾‾‾            │
│                                  │
╰──────────────────────────────────╯
""",
}

# Short one-line face representations for compact logging
FACE_COMPACT = {
    RobotState.BOOTING:     "[ ── . ── ]",
    RobotState.IDLE:        "[ o  .  o ]",
    RobotState.HAPPY:       "[ ^  .  ^ ]",
    RobotState.CURIOUS:     "[ O  .  o ]",
    RobotState.LISTENING:   "[ @  .  @ ]",
    RobotState.THINKING:    "[ ·  .  · ]",
    RobotState.CONFUSED:    "[ ?  .  _ ]",
    RobotState.LOVED:       "[ ♥  .  ♥ ]",
    RobotState.SURPRISED:   "[ O  .  O ]",
    RobotState.SLEEPY:      "[ -  .  - ]",
    RobotState.ERROR:       "[ !  .  ! ]",
    RobotState.LOW_BATTERY: "[ _  .  _ ]",
    RobotState.OBEDIENT:    "[ ‿  .  ‿ ]",
    RobotState.DIZZY:       "[ @  .  @ ]",
    RobotState.ANGRY:       "[ ╲  .  ╱ ]",
}

# ANSI color codes for terminal output (matches rainbow palette from web)
STATE_COLORS = {
    RobotState.BOOTING:     "\033[90m",     # Gray
    RobotState.IDLE:        "\033[37m",     # White
    RobotState.HAPPY:       "\033[92m",     # Green
    RobotState.CURIOUS:     "\033[93m",     # Yellow
    RobotState.LISTENING:   "\033[96m",     # Cyan
    RobotState.THINKING:    "\033[94m",     # Blue
    RobotState.CONFUSED:    "\033[95m",     # Magenta
    RobotState.LOVED:       "\033[91m",     # Red/Pink
    RobotState.SURPRISED:   "\033[33m",     # Orange
    RobotState.SLEEPY:      "\033[36m",     # Dark Cyan
    RobotState.ERROR:       "\033[31m",     # Red
    RobotState.LOW_BATTERY: "\033[31m",     # Red
    RobotState.OBEDIENT:    "\033[34m",     # Blue
    RobotState.DIZZY:       "\033[33m",     # Orange
    RobotState.ANGRY:       "\033[91m",     # Bright Red
}

RESET = "\033[0m"


class FaceRenderer:
    """
    Renders PICO's face expressions to the terminal.

    Supports both full ASCII art mode and compact one-line mode.
    Uses ANSI color codes for colorful terminal output.
    """

    def __init__(self, use_color: bool = True, compact: bool = False):
        """
        Initialize the face renderer.

        Args:
            use_color: Enable ANSI color codes (disable for piping/logging)
            compact:   Use single-line face representation instead of full art
        """
        self.use_color = use_color and self._supports_color()
        self.compact = compact

    @staticmethod
    def _supports_color() -> bool:
        """Check if the terminal supports ANSI colors."""
        # Windows: check for modern terminal
        if sys.platform == "win32":
            return os.environ.get("TERM") is not None or os.environ.get("WT_SESSION") is not None
        # Unix: check if stdout is a terminal
        return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()

    def get_face(self, state: RobotState) -> str:
        """
        Get the face art string for a given state.

        Args:
            state: The robot's current emotional state

        Returns:
            ASCII art string representation of the face
        """
        if self.compact:
            face = FACE_COMPACT.get(state, FACE_COMPACT[RobotState.IDLE])
        else:
            face = FACE_ART.get(state, FACE_ART[RobotState.IDLE])

        if self.use_color:
            color = STATE_COLORS.get(state, "")
            return f"{color}{face}{RESET}"

        return face

    def get_compact_face(self, state: RobotState) -> str:
        """
        Get the compact one-line face for a given state.

        Args:
            state: The robot's current emotional state

        Returns:
            One-line string representation (e.g. "[ ^  .  ^ ]")
        """
        face = FACE_COMPACT.get(state, FACE_COMPACT[RobotState.IDLE])

        if self.use_color:
            color = STATE_COLORS.get(state, "")
            return f"{color}{face}{RESET}"

        return face

    def render(self, state: RobotState) -> None:
        """
        Print the face for a given state to stdout.

        Args:
            state: The robot's current emotional state
        """
        face = self.get_face(state)
        state_label = state.value.upper().replace("_", " ")

        if self.use_color:
            color = STATE_COLORS.get(state, "")
            label = f"{color}── {state_label} ──{RESET}"
        else:
            label = f"── {state_label} ──"

        print(label)
        print(face)

    def render_transition(self, from_state: RobotState, to_state: RobotState) -> None:
        """
        Print a transition visualization between two states.

        Args:
            from_state: The previous state
            to_state:   The new state
        """
        from_face = self.get_compact_face(from_state)
        to_face = self.get_compact_face(to_state)

        print(f"  {from_face}  →  {to_face}")
        print()
        self.render(to_state)

    def clear_screen(self) -> None:
        """Clear the terminal screen."""
        os.system("cls" if sys.platform == "win32" else "clear")
