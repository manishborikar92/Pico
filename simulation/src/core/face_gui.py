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

import tkinter as tk
import math
import time
import random
from typing import Tuple

from simulation.src.core.emotion_engine import EmotionEngine, RobotState, STATE_CONFIGS

# Hardware screen size
SCREEN_W = 128
SCREEN_H = 64
SCALE = 6 # UI scaling factor for PC visibility

class FaceGui:
    """
    Tkinter-based simulation of the 128x64 screen.
    Includes a built-in event loop and keyboard bindings to test the EmotionEngine.
    """

    def __init__(self, engine: EmotionEngine):
        self.engine = engine
        self.root = tk.Tk()
        self.root.title("PICO - 128x64 OLED Simulator")
        self.root.configure(bg="#2c2c2c")
        
        # Display area
        self.canvas = tk.Canvas(
            self.root, 
            width=SCREEN_W * SCALE, 
            height=SCREEN_H * SCALE,
            bg="black",
            highlightthickness=0
        )
        self.canvas.pack(padx=20, pady=20)
        
        # HUD for debugging
        self.hud_var = tk.StringVar()
        hud_label = tk.Label(
            self.root, 
            textvariable=self.hud_var, 
            bg="#2c2c2c", 
            fg="#999", 
            font=("Courier", 10)
        )
        hud_label.pack(side=tk.BOTTOM, pady=(0, 10))

        # Instructions
        self._create_controls_panel()

        # Animation state
        self.is_blinking = False
        self.blink_factor = 1.0  # 1.0 = open, 0.05 = closed
        self.pupil_offset = [0, 0]
        self.animation_step = 0

        # Bind EmotionEngine callback (safely trigger UI update)
        self.engine.on_state_change(self._on_emotion_change)

        # Start animation loop
        self._update_loop()
        self._render_loop()
        
    def _create_controls_panel(self):
        """Builds a cheat-sheet panel for interactive keyboard triggers."""
        panel = tk.Frame(self.root, bg="#2c2c2c")
        panel.pack(fill=tk.X, padx=20, pady=(0, 20))
        
        bindings = [
            ("T", "Touch (Happy)"),
            ("W", "Wake Word (Listen)"),
            ("S", "Speech (Think)"),
            ("O", "Ok/Understood (Obedient)"),
            ("X", "Error (Confused)"),
            ("U", "Unknown Face (Curious)"),
            ("P", "Petting (Loved)"),
            ("L", "Lift/Surprise"),
            ("D", "Shake (Dizzy)"),
            ("A", "Shake Hard (Angry)"),
            ("E", "System Error"),
            ("B", "Low Battery"),
            ("I", "Force IDLE"),
        ]
        
        # Create a 3-column grid for instructions
        for idx, (key, label) in enumerate(bindings):
            row = idx // 3
            col = idx % 3
            txt = f"[{key}] {label}"
            tk.Label(panel, text=txt, bg="#2c2c2c", fg="#ccc", anchor="w", width=30).grid(row=row, column=col, sticky="w")
            
            # Key bindings (case insensitive)
            self.root.bind(f"<{key.lower()}>", lambda e, k=key: self._handle_key(k))
            self.root.bind(f"<{key.upper()}>", lambda e, k=key: self._handle_key(k))

    def _handle_key(self, key: str):
        """Map keyboard inputs to EmotionEngine triggers."""
        mapping = {
            "T": "touch_detected",
            "W": "wake_word_detected",
            "S": "speech_received",
            "O": "command_understood",
            "X": "processing_error",
            "U": "unknown_face_detected",
            "P": "petting_detected",
            "L": "picked_up",
            "D": "shaken",
            "A": "shaken_aggressively",
            "E": "system_error",
            "B": "battery_low",
        }
        if key == "I":
            self.engine.force_state(RobotState.IDLE, "user input")
        elif key in mapping:
            self.engine.process_trigger(mapping[key])

    def _on_emotion_change(self, old_state: RobotState, new_state: RobotState):
        """Triggered by EmotionEngine thread."""
        state_config = STATE_CONFIGS.get(new_state)
        # Update HUD safely via tkinter main loop
        def update_hud():
            status = f"State: {new_state.value.upper()} | Eye: {state_config.eye_expression} | Audio: {state_config.audio_file or 'none'}"
            self.hud_var.set(status)
            
            # Force a blink on transition
            self.is_blinking = True
            self.blink_factor = 0.05
            self.root.after(100, lambda: setattr(self, 'is_blinking', False))
            
        self.root.after(0, update_hud)

    # ─── Framebuffer Equivalents ──────────────────────────────
    
    def _fill_ellipse(self, cx, cy, rx, ry, color="white"):
        self.canvas.create_oval(
            (cx - rx) * SCALE, (cy - ry) * SCALE,
            (cx + rx) * SCALE, (cy + ry) * SCALE,
            fill=color, outline=color
        )
        
    def _draw_ellipse(self, cx, cy, rx, ry, thickness=2, color="white"):
        self.canvas.create_oval(
            (cx - rx) * SCALE, (cy - ry) * SCALE,
            (cx + rx) * SCALE, (cy + ry) * SCALE,
            outline=color, width=thickness * SCALE
        )
        
    def _draw_line(self, x1, y1, x2, y2, thickness=2, color="white"):
        self.canvas.create_line(
            x1 * SCALE, y1 * SCALE,
            x2 * SCALE, y2 * SCALE,
            fill=color, width=thickness * SCALE, capstyle=tk.ROUND
        )
        
    def _draw_arc(self, cx, cy, r, start_deg, extent_deg, thickness=2, color="white"):
        # Tkinter arc: start=0 is 3 o'clock, moving counterclockwise
        self.canvas.create_arc(
            (cx - r) * SCALE, (cy - r) * SCALE,
            (cx + r) * SCALE, (cy + r) * SCALE,
            start=start_deg, extent=extent_deg,
            style=tk.ARC, outline=color, width=thickness * SCALE
        )
        
    def _fill_polygon(self, points, color="white"):
        scaled = [val * SCALE for val in points]
        self.canvas.create_polygon(scaled, fill=color, outline=color)

    # ─── Shape Renderers ──────────────────────────────────────

    def _render_eye_shape(self, cx, cy, shape, h_scale):
        y_scaled = lambda r: max(1, int(r * h_scale))
        px, py = self.pupil_offset
        t = self.animation_step

        if shape == "idle":
            self._fill_ellipse(cx, cy, 20, y_scaled(20))
            self._fill_ellipse(cx + px, cy + py, 8, y_scaled(8), color="black")
            
        elif shape == "happy":
            self._draw_arc(cx, cy + 10, 20, 30, 120, thickness=4)
            
        elif shape == "curious-big":
            self._fill_ellipse(cx, cy, 22, y_scaled(22))
            self._fill_ellipse(cx + px, cy + py, 11, y_scaled(11), color="black")
            
        elif shape == "curious-small":
            self._fill_ellipse(cx, cy + 4, 14, y_scaled(14))
            self._fill_ellipse(cx + px, cy + py + 4, 6, y_scaled(6), color="black")
            
        elif shape == "sleepy":
            self._fill_ellipse(cx, cy + 6, 20, y_scaled(8))
            
        elif shape == "listening":
            # Outer scale pulse
            pulse = math.sin(t * 0.1) * 2
            self._fill_ellipse(cx, cy, 20 + pulse, y_scaled(20 + pulse))
            # Inner squiggle
            self._draw_arc(cx, cy, 10, 0, 180, thickness=3, color="black")
            
        elif shape == "confused-raised":
            self._fill_ellipse(cx, cy, 18, y_scaled(18))
            self._fill_ellipse(cx + px, cy + py, 7, y_scaled(7), color="black")
            self._draw_line(cx - 10, cy - 14, cx + 8, cy - 10, thickness=3) # inner brow
            
        elif shape == "confused-squint":
            self._fill_ellipse(cx, cy, 16, y_scaled(6))
            
        elif shape == "loved":
            # Heart shape using a polygon mapping for hardware simplicity
            # For 128x64, an approximation using circles and a triangle
            self._fill_ellipse(cx - 8, cy - 6, 10, y_scaled(10))
            self._fill_ellipse(cx + 8, cy - 6, 10, y_scaled(10))
            self._fill_polygon([cx - 18, cy - 4, cx + 18, cy - 4, cx, cy + 16])
            
        elif shape == "surprised":
            self._fill_ellipse(cx, cy, 24, y_scaled(24))
            self._fill_ellipse(cx, cy, 4, y_scaled(4), color="black")
            
        elif shape == "booting":
            self._draw_line(cx - 20, cy, cx + 20, cy, thickness=2, color="#555")
            
        elif shape == "thinking":
            pulse = abs(math.sin(t * 0.15)) * 4
            self._fill_ellipse(cx, cy, 6 + pulse, y_scaled(6 + pulse))
            
        elif shape == "error":
            # Error shake
            dx = math.sin(t * 2.0) * 3
            self._draw_line(cx + dx, cy - 14, cx + dx, cy + 6, thickness=4)
            self._fill_ellipse(cx + dx, cy + 14, 3, y_scaled(3))
            
        elif shape == "low-battery":
            self._fill_ellipse(cx, cy + 8, 16, y_scaled(6), color="#777")
            
        elif shape == "obedient":
            self._draw_arc(cx, cy + 6, 16, 45, 90, thickness=3)
            
        elif shape == "dizzy":
            # Wobble rotation
            # For simplicity in framebuffer, draw concentric arcs or circles
            self._draw_ellipse(cx, cy, 18, y_scaled(18), thickness=2)
            self._draw_ellipse(cx, cy, 8, y_scaled(8), thickness=2)
            
        elif shape == "angry":
            self._draw_line(cx - 18, cy - 4, cx + 2, cy + 8, thickness=4)
            self._draw_line(cx + 2, cy + 8, cx + 22, cy - 4, thickness=4)
            
        else:
            self._fill_ellipse(cx, cy, 20, y_scaled(20)) # fallback

    # ─── Animation & Render Loops ─────────────────────────────

    def _update_loop(self):
        """Update physics, blinking, and animation step."""
        self.animation_step += 1
        
        # Determine target blink logic 
        # (Auto-blink if IDLE and not already transitions)
        if self.engine.current_state == RobotState.IDLE:
            if not self.is_blinking and (random.random() < 0.02 if hasattr(random, 'random') else False):
                self.is_blinking = True
                self.root.after(150, lambda: setattr(self, 'is_blinking', False))
                
        # Pupil random drift
        if self.engine.current_state == RobotState.IDLE:
            if time.time() % 3 < 0.1:
                self.pupil_offset = [math.sin(time.time()) * 6, math.cos(time.time() * 0.5) * 4]
        else:
            self.pupil_offset = [0, 0]
            
        # Smooth blink factor transition
        target_blink = 0.05 if self.is_blinking else 1.0
        self.blink_factor += (target_blink - self.blink_factor) * 0.4

        self.root.after(33, self._update_loop) # ~30fps 

    def _render_loop(self):
        """Draw everything to the canvas."""
        self.canvas.delete("all")
        
        state_config = self.engine.state_config
        shape_key = state_config.eye_expression
        
        # Left eye (center x=32), Right eye (center x=96)
        
        # Special case for curious asymmetric eyes
        l_shape = r_shape = shape_key
        if shape_key == "curious":
            l_shape, r_shape = "curious-big", "curious-small"
        elif shape_key == "confused":
            l_shape, r_shape = "confused-raised", "confused-squint"
            
        self._render_eye_shape(32, 32, l_shape, self.blink_factor)
        self._render_eye_shape(96, 32, r_shape, self.blink_factor)

        self.root.after(33, self._render_loop)

def launch_gui():
    """Entry point for the standalone GUI testing."""
    engine = EmotionEngine()
    app = FaceGui(engine)
    
    # Pre-warm state on HUD via after so we don't block
    app.engine.force_state(RobotState.BOOTING)
    app.root.after(500, lambda: app.engine.process_trigger("boot_complete"))
    
    app.root.mainloop()

if __name__ == "__main__":
    launch_gui()
