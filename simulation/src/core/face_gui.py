"""
OLED Face GUI Simulator for PICO.

Provides a pixel-accurate visualization of the 128x64 SSD1306 screen,
simulating exactly how the robot will draw its face hardware-side.
By mapping the web SVG coordinates to a 128x64 grid (two 64x64 halves),
this provides a drop-in reference for the MicroPython hardware implementation.

Usage:
    from simulation.src.core.face_gui import launch_gui
    launch_gui()
"""

import math
import random
import time
import tkinter as tk
from typing import Callable

from simulation.src.core.emotion_engine import EmotionEngine, RobotState, STATE_CONFIGS

# Hardware screen dimensions and UI scaling factor for PC visibility
SCREEN_W: int = 128
SCREEN_H: int = 64
SCALE: int = 6

# Eye centre positions on the 128x64 grid
LEFT_EYE_X: int = 32
RIGHT_EYE_X: int = 96
EYE_Y: int = 32

# Key → (event trigger | None for special handling)
_KEY_BINDINGS: tuple[tuple[str, str, str | None], ...] = (
    ("T", "Touch (Happy)",          "touch_detected"),
    ("W", "Wake Word (Listen)",     "wake_word_detected"),
    ("S", "Speech (Think)",         "speech_received"),
    ("O", "Ok/Understood (Obedient)","command_understood"),
    ("X", "Error (Confused)",       "processing_error"),
    ("U", "Unknown Face (Curious)", "unknown_face_detected"),
    ("P", "Petting (Loved)",        "petting_detected"),
    ("L", "Lift/Surprise",          "picked_up"),
    ("D", "Shake (Dizzy)",          "shaken"),
    ("A", "Shake Hard (Angry)",     "shaken_aggressively"),
    ("E", "System Error",           "system_error"),
    ("B", "Low Battery",            "battery_low"),
    ("I", "Force IDLE",             None),
)


class FaceGui:
    """
    Tkinter simulation of the 128x64 OLED screen.

    Includes an animation loop and keyboard bindings for interactively
    testing every EmotionEngine state.
    """

    def __init__(self, engine: EmotionEngine) -> None:
        self.engine = engine

        self.root = tk.Tk()
        self.root.title("PICO - 128x64 OLED Simulator")
        self.root.configure(bg="#2c2c2c")

        self.canvas = tk.Canvas(
            self.root,
            width=SCREEN_W * SCALE,
            height=SCREEN_H * SCALE,
            bg="black",
            highlightthickness=0,
        )
        self.canvas.pack(padx=20, pady=20)

        self.hud_var = tk.StringVar()
        tk.Label(
            self.root,
            textvariable=self.hud_var,
            bg="#2c2c2c",
            fg="#999",
            font=("Courier", 10),
        ).pack(side=tk.BOTTOM, pady=(0, 10))

        self._build_controls_panel()

        # Animation state
        self.is_blinking: bool = False
        self.blink_factor: float = 1.0   # 1.0 = open, 0.05 = closed
        self.pupil_offset: list[float] = [0.0, 0.0]
        self.animation_step: int = 0

        self.engine.on_state_change(self._on_emotion_change)
        self._update_loop()
        self._render_loop()

    # ------------------------------------------------------------------ #
    #  Setup                                                               #
    # ------------------------------------------------------------------ #

    def _build_controls_panel(self) -> None:
        """Render the keyboard cheat-sheet and register all bindings."""
        panel = tk.Frame(self.root, bg="#2c2c2c")
        panel.pack(fill=tk.X, padx=20, pady=(0, 20))

        for idx, (key, label, _) in enumerate(_KEY_BINDINGS):
            tk.Label(
                panel,
                text=f"[{key}] {label}",
                bg="#2c2c2c",
                fg="#ccc",
                anchor="w",
                width=30,
            ).grid(row=idx // 3, column=idx % 3, sticky="w")

            for variant in (key.lower(), key.upper()):
                self.root.bind(f"<{variant}>", lambda e, k=key: self._handle_key(k))

    # ------------------------------------------------------------------ #
    #  Input handling                                                      #
    # ------------------------------------------------------------------ #

    def _handle_key(self, key: str) -> None:
        print(f"[KEY] {key}")
        if key == "I":
            self.engine.force_state(RobotState.IDLE, "user input")
            return

        trigger = next((t for k, _, t in _KEY_BINDINGS if k == key and t), None)
        if trigger:
            self.engine.process_trigger(trigger)

    # ------------------------------------------------------------------ #
    #  EmotionEngine callback                                              #
    # ------------------------------------------------------------------ #

    def _on_emotion_change(self, old_state: RobotState, new_state: RobotState) -> None:
        """Called from the EmotionEngine thread; defers all UI work to the main loop."""
        def _update() -> None:
            cfg = STATE_CONFIGS.get(new_state)
            self.hud_var.set(
                f"State: {new_state.value.upper()} | "
                f"Eye: {cfg.eye_expression} | "
                f"Audio: {cfg.audio_file or 'none'}"
            )
            self._trigger_blink()

        self.root.after(0, _update)

    # ------------------------------------------------------------------ #
    #  Framebuffer primitives                                              #
    # ------------------------------------------------------------------ #

    def _fill_ellipse(self, cx: float, cy: float, rx: float, ry: float, color: str = "white") -> None:
        s = SCALE
        self.canvas.create_oval(
            (cx - rx) * s, (cy - ry) * s,
            (cx + rx) * s, (cy + ry) * s,
            fill=color, outline=color,
        )

    def _draw_ellipse(self, cx: float, cy: float, rx: float, ry: float,
                      thickness: int = 2, color: str = "white") -> None:
        s = SCALE
        self.canvas.create_oval(
            (cx - rx) * s, (cy - ry) * s,
            (cx + rx) * s, (cy + ry) * s,
            outline=color, width=thickness * s,
        )

    def _draw_line(self, x1: float, y1: float, x2: float, y2: float,
                   thickness: int = 2, color: str = "white") -> None:
        s = SCALE
        self.canvas.create_line(
            x1 * s, y1 * s, x2 * s, y2 * s,
            fill=color, width=thickness * s, capstyle=tk.ROUND,
        )

    def _draw_arc(self, cx: float, cy: float, r: float,
                  start_deg: float, extent_deg: float,
                  thickness: int = 2, color: str = "white") -> None:
        s = SCALE
        self.canvas.create_arc(
            (cx - r) * s, (cy - r) * s,
            (cx + r) * s, (cy + r) * s,
            start=start_deg, extent=extent_deg,
            style=tk.ARC, outline=color, width=thickness * s,
        )

    def _fill_polygon(self, points: list[float], color: str = "white") -> None:
        self.canvas.create_polygon(
            [v * SCALE for v in points], fill=color, outline=color,
        )

    # ------------------------------------------------------------------ #
    #  Eye shape renderers                                                 #
    # ------------------------------------------------------------------ #

    def _render_eye_shape(self, cx: float, cy: float, shape: str, h_scale: float) -> None:
        """Dispatch to the per-shape renderer, passing a pre-built scale helper."""
        def ys(r: float) -> float:
            return max(1.0, r * h_scale)

        px, py = self.pupil_offset
        t = self.animation_step

        renderer = self._eye_renderers.get(shape)
        if renderer:
            renderer(self, cx, cy, px, py, t, ys)
        else:
            self._fill_ellipse(cx, cy, 20, ys(20))   # fallback: plain circle

    # Per-shape lambdas stored as a class-level dict to avoid the if-elif chain.
    # Signature: (self, cx, cy, px, py, t, ys) → None
    _eye_renderers: dict[str, Callable] = {
        "idle": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx, cy, 20, ys(20)),
            s._fill_ellipse(cx + px, cy + py, 8, ys(8), "black"),
        ),
        "happy": lambda s, cx, cy, px, py, t, ys:
            s._draw_arc(cx, cy + 10, 20, 30, 120, thickness=4),

        "curious-big": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx, cy, 22, ys(22)),
            s._fill_ellipse(cx + px, cy + py, 11, ys(11), "black"),
        ),
        "curious-small": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx, cy + 4, 14, ys(14)),
            s._fill_ellipse(cx + px, cy + py + 4, 6, ys(6), "black"),
        ),
        "sleepy": lambda s, cx, cy, px, py, t, ys:
            s._fill_ellipse(cx, cy + 6, 20, ys(8)),

        "listening": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx, cy, 20 + math.sin(t * 0.1) * 2, ys(20 + math.sin(t * 0.1) * 2)),
            s._draw_arc(cx, cy, 10, 0, 180, thickness=3, color="black"),
        ),
        "confused-raised": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx, cy, 18, ys(18)),
            s._fill_ellipse(cx + px, cy + py, 7, ys(7), "black"),
            s._draw_line(cx - 10, cy - 14, cx + 8, cy - 10, thickness=3),
        ),
        "confused-squint": lambda s, cx, cy, px, py, t, ys:
            s._fill_ellipse(cx, cy, 16, ys(6)),

        "loved": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx - 8, cy - 6, 10, ys(10)),
            s._fill_ellipse(cx + 8, cy - 6, 10, ys(10)),
            s._fill_polygon([cx - 18, cy - 4, cx + 18, cy - 4, cx, cy + 16]),
        ),
        "surprised": lambda s, cx, cy, px, py, t, ys: (
            s._fill_ellipse(cx, cy, 24, ys(24)),
            s._fill_ellipse(cx, cy, 4, ys(4), "black"),
        ),
        "booting": lambda s, cx, cy, px, py, t, ys:
            s._draw_line(cx - 20, cy, cx + 20, cy, thickness=2, color="#555"),

        "thinking": lambda s, cx, cy, px, py, t, ys: (
            lambda p: s._fill_ellipse(cx, cy, 6 + p, ys(6 + p))
        )(abs(math.sin(t * 0.15)) * 4),

        "error": lambda s, cx, cy, px, py, t, ys: (
            lambda dx: (
                s._draw_line(cx + dx, cy - 14, cx + dx, cy + 6, thickness=4),
                s._fill_ellipse(cx + dx, cy + 14, 3, ys(3)),
            )
        )(math.sin(t * 2.0) * 3),

        "low-battery": lambda s, cx, cy, px, py, t, ys:
            s._fill_ellipse(cx, cy + 8, 16, ys(6), "#777"),

        "obedient": lambda s, cx, cy, px, py, t, ys:
            s._draw_arc(cx, cy + 6, 16, 45, 90, thickness=3),

        "dizzy": lambda s, cx, cy, px, py, t, ys: (
            s._draw_ellipse(cx, cy, 18, ys(18), thickness=2),
            s._draw_ellipse(cx, cy, 8, ys(8), thickness=2),
        ),
        "angry-left": lambda s, cx, cy, px, py, t, ys: (
            s.canvas.create_arc(
                (cx - 16) * SCALE, (cy - 16) * SCALE,
                (cx + 16) * SCALE, (cy + 16) * SCALE,
                start=180 - 20, extent=180,
                style=tk.CHORD, fill="white", outline="white"
            ),
            s._fill_ellipse(cx + px, cy + py + 4, 5, ys(5), "black"),
        ),
        "angry-right": lambda s, cx, cy, px, py, t, ys: (
            s.canvas.create_arc(
                (cx - 16) * SCALE, (cy - 16) * SCALE,
                (cx + 16) * SCALE, (cy + 16) * SCALE,
                start=180 + 20, extent=180,
                style=tk.CHORD, fill="white", outline="white"
            ),
            s._fill_ellipse(cx + px, cy + py + 4, 5, ys(5), "black"),
        ),
    }

    # ------------------------------------------------------------------ #
    #  Blink helpers                                                       #
    # ------------------------------------------------------------------ #

    def _trigger_blink(self) -> None:
        self.is_blinking = True
        self.blink_factor = 0.05
        self.root.after(100, self._end_blink)

    def _end_blink(self) -> None:
        self.is_blinking = False

    # ------------------------------------------------------------------ #
    #  Animation & render loops (~30 fps)                                  #
    # ------------------------------------------------------------------ #

    def _update_loop(self) -> None:
        """Update physics, blinking, and animation step at ~30 fps."""
        self.animation_step += 1

        if self.engine.current_state == RobotState.IDLE:
            if not self.is_blinking and random.random() < 0.02:
                self._trigger_blink()

            now = time.time()
            self.pupil_offset = [math.sin(now) * 6, math.cos(now * 0.5) * 4]
        else:
            self.pupil_offset = [0.0, 0.0]

        target = 0.05 if self.is_blinking else 1.0
        self.blink_factor += (target - self.blink_factor) * 0.4

        self.root.after(33, self._update_loop)

    def _render_loop(self) -> None:
        """Redraw the canvas at ~30 fps."""
        self.canvas.delete("all")

        shape_key = self.engine.state_config.eye_expression

        # Resolve asymmetric eye pairs
        l_shape, r_shape = {
            "curious": ("curious-big", "curious-small"),
            "confused": ("confused-raised", "confused-squint"),
            "angry": ("angry-left", "angry-right"),
        }.get(shape_key, (shape_key, shape_key))

        self._render_eye_shape(LEFT_EYE_X,  EYE_Y, l_shape, self.blink_factor)
        self._render_eye_shape(RIGHT_EYE_X, EYE_Y, r_shape, self.blink_factor)

        self.root.after(33, self._render_loop)


# --------------------------------------------------------------------------- #
#  Entry point                                                                 #
# --------------------------------------------------------------------------- #

def launch_gui() -> None:
    """Create the EmotionEngine, boot the simulator, and enter the event loop."""
    engine = EmotionEngine()
    app = FaceGui(engine)

    app.engine.force_state(RobotState.BOOTING)
    app.root.after(500, lambda: app.engine.process_trigger("boot_complete"))

    app.root.mainloop()


if __name__ == "__main__":
    launch_gui()