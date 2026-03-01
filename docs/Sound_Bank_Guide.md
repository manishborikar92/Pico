# PICO Sound Bank Guide

**Document Type:** Technical Implementation Guide  
**Version:** 1.0  
**Date:** December 5, 2025  
**Status:** Production-Ready  
**Purpose:** Complete guide for creating and managing PICO's non-verbal sound communication system

---

## Table of Contents

1. [Overview](#overview)
2. [Sound Bank Structure](#sound-bank-structure)
3. [Technical Specifications](#technical-specifications)
4. [Sound Design Philosophy](#sound-design-philosophy)
5. [Creation Methods](#creation-methods)
6. [Required Sounds List](#required-sounds-list)
7. [Processing Workflow](#processing-workflow)
8. [Testing & Quality Control](#testing--quality-control)
9. [Integration Guide](#integration-guide)
10. [Sound Mapping Configuration](#sound-mapping-configuration)

---

## Overview

PICO's personality is expressed entirely through non-verbal sounds. This guide provides comprehensive instructions for creating a complete sound library that makes PICO feel alive, expressive, and emotionally engaging.

**Goal:** Create 20-30 high-quality sound effects that convey emotion and personality without using human speech.

**Design Philosophy:** PICO is a non-verbal pet companion that communicates through pre-recorded sound effects (.wav files) like chirps, purrs, and whistles - similar to R2-D2, Wall-E, or Pokemon.

---

## Sound Bank Structure

### Complete Directory Structure

```
pico_robot/
├── assets/
│   └── sounds/
│       ├── README.md                    # Sound Bank documentation
│       ├── ATTRIBUTION.md               # Source credits for sounds
│       │
│       ├── emotional/                   # Emotional expression sounds
│       │   ├── happy_chirp_01.wav      # Primary happiness sound
│       │   ├── happy_chirp_02.wav      # Variation 1
│       │   ├── happy_chirp_03.wav      # Variation 2
│       │   ├── curious_hum_01.wav      # Questioning/investigation
│       │   ├── curious_hum_02.wav      # Variation
│       │   ├── sad_whimper_01.wav      # Disappointment
│       │   ├── excited_whistle_01.wav  # High energy
│       │   ├── excited_whistle_02.wav  # Variation
│       │   ├── loved_purr_01.wav       # Contentment (continuous)
│       │   ├── sleepy_yawn_01.wav      # Low energy/tired
│       │   ├── playful_giggle_01.wav   # During active play
│       │   ├── surprised_beep_01.wav   # Unexpected event
│       │   └── confused_warble_01.wav  # Didn't understand
│       │
│       ├── reactions/                   # System response sounds
│       │   ├── greeting_beep.wav       # Hello sound
│       │   ├── greeting_melody.wav     # Morning greeting variation
│       │   ├── acknowledgment_chirp.wav # "I heard you"
│       │   ├── success_ding.wav        # Command successful
│       │   ├── error_buzz.wav          # Something went wrong
│       │   ├── listening_bing.wav      # Wake word detected
│       │   ├── goodbye_chime.wav       # Farewell sound
│       │   ├── notification_ping.wav   # General alert
│       │   └── alert_urgent.wav        # Important notification
│       │
│       ├── ambient/                     # Background/continuous sounds
│       │   ├── startup_beep.wav        # Power-on sequence
│       │   ├── thinking_hum.wav        # Processing indicator
│       │   ├── idle_breathing.wav      # Subtle life presence
│       │   ├── working_hum.wav         # During long tasks
│       │   ├── night_lullaby.wav       # Bedtime sound
│       │   └── morning_chirp.wav       # Time-based greeting
│       │
│       └── test/                        # Test and calibration sounds
│           ├── test_tone_440hz.wav     # Calibration tone
│           ├── test_sweep.wav          # Frequency sweep test
│           └── volume_reference.wav    # Volume calibration
```

### Naming Conventions

**Pattern:** `emotion_type_variation.wav`

Examples:
- `happy_chirp_01.wav` - Happy emotion, chirp type, variation 1
- `curious_hum_01.wav` - Curious emotion, hum type, variation 1
- `success_ding.wav` - Success reaction, ding type (no variation number if only one)

**Rules:**
- All lowercase
- Underscore separated
- No spaces or special characters
- Variation numbers: 01, 02, 03 (zero-padded)
- Descriptive type (chirp, hum, beep, ding, buzz, whistle, purr, etc.)

---

## Technical Specifications

### Required Audio Format

All sounds MUST meet these specifications:

| Property | Value | Reason |
|----------|-------|--------|
| **Format** | WAV (uncompressed) | No decoding overhead, instant playback |
| **Sample Rate** | 16kHz | Optimal for ESP32, good quality, low file size |
| **Bit Depth** | 16-bit | Standard quality, efficient storage |
| **Channels** | Mono | Single speaker, reduces file size by 50% |
| **Duration** | 0.3 - 3.0 seconds | Quick responses, not too short/long |
| **Max File Size** | ~100KB per sound | Memory constraints on ESP32 |

### Why These Specs?

- **16kHz**: The ESP32-S3 can handle higher, but 16kHz is the sweet spot for:
  - Clear sound quality for beeps/chirps
  - Efficient memory usage (3 sec @ 16kHz = ~96KB)
  - Fast playback startup
  
- **Mono**: PICO has one speaker, stereo is wasted
- **WAV format**: No MP3 decoding lag, instant response

---

## Sound Design Philosophy

### What Makes a Good PICO Sound?

PICO sounds should be:

1. **Emotionally Clear**: Listeners should immediately understand the emotion
2. **Non-Human**: Should not sound like words or human vocalization
3. **Endearing**: Cute, lovable, not annoying or harsh
4. **Distinctive**: Each sound should be recognizable
5. **Varied**: Multiple variations of common sounds prevent monotony

### Inspiration Sources

- **R2-D2** (Star Wars): Electronic beeps with personality
- **Wall-E**: Expressive robotic sounds with emotional range
- **Pokemon**: Simple syllable-based communication
- **BB-8**: Rolling beeps and excited chirps
- **Portal Turrets**: Friendly mechanical sounds

### Emotional Sound Characteristics

| Emotion | Pitch | Speed | Complexity | Example Pattern |
|---------|-------|-------|------------|-----------------|
| **Happy** | High, rising | Fast | Simple | ↗️ "bee-beep!" |
| **Sad** | Low, falling | Slow | Simple | ↘️ "wooo-omp" |
| **Curious** | Medium, wavering | Medium | Rising question | ↗️? "bee?-oop?" |
| **Excited** | Very high | Very fast | Multiple notes | ↗️↗️↗️ "beepbeepbeep!" |
| **Confused** | Wobbly, uncertain | Variable | Dissonant | ~~ "woo-blee-orp?" |
| **Loved/Content** | Low, rumbling | Slow, steady | Warm, continuous | ~~~~ "purrrr" |
| **Sleepy** | Low, fading | Very slow | Descending | ↘️... "yaaawwwn" |

---

## Creation Methods

### Method 1: Software Synthesis (Easiest)

**Tools:**
- **Bfxr** (https://www.bfxr.net/) - Free, web-based, perfect for game sounds
- **ChipTone** (https://sfbgames.itch.io/chiptone) - Retro chiptune generator
- **Audacity** - Free audio editor with tone generator

**Bfxr Workflow for Happy Chirp:**
```
1. Open Bfxr in browser
2. Click "Pickup/Coin" preset
3. Adjust parameters:
   - Base Frequency: 800-1000 Hz
   - Slide: +0.3 (rising pitch)
   - Duration: 0.2-0.4 seconds
   - Wave Type: Square or Sawtooth
4. Preview until it sounds cheerful
5. Export as WAV
6. Post-process in Audacity (see Processing Workflow)
```

**Audacity Tone Generator for Beeps:**
```
1. Generate > Tone
2. Waveform: Sine (smooth) or Square (electronic)
3. Frequency: 440-880 Hz
4. Amplitude: 0.5
5. Duration: 0.3 seconds
6. Apply envelope (Attack: 0.01s, Decay: 0.02s)
```

### Method 2: Voice Modulation (Most Expressive)

**Tools:**
- **Audacity** with pitch shift
- **Adobe Audition** (paid, but powerful)
- **Your voice + effects**

**Workflow:**
```
1. Record yourself making sounds:
   - "Bee-boop!" (happy)
   - "Hmmmm?" (curious)
   - "Awwww" (sad)
   - "Wheeee!" (excited)

2. In Audacity:
   - Effect > Change Pitch: +800-1200% (makes it robotic/cute)
   - Effect > Change Speed: +25-50% (makes it snappier)
   - Effect > Equalization: Boost 800-2000Hz (electronic tone)
   - Effect > Reverb: Small room, 10% (adds space)

3. Trim to 0.5-1.5 seconds
4. Normalize to -3dB
```

**This method creates the most "alive" sounds** because they have natural human emotional inflection, just pitched up to sound robotic.

### Method 3: Sampling & Editing (Professional)

**Sources:**
- **Freesound.org** - Huge library of Creative Commons sounds
- **Zapsplat.com** - Free sound effects
- **BBC Sound Effects** - Public domain library
- **Field recording** - Record real objects

**Search terms:**
- "robot beep"
- "electronic chirp"
- "game pickup"
- "toy sound"
- "notification"

**Workflow:**
```
1. Download promising sounds
2. Import to Audacity
3. Cut to best 1-2 seconds
4. Remove background noise (Effect > Noise Reduction)
5. Adjust pitch/speed to fit PICO's character
6. Apply filters:
   - High-pass filter @ 200Hz (remove rumble)
   - Boost 1-2kHz (clarity)
7. Normalize to -3dB
8. Export as WAV
```

### Method 4: Hybrid Approach (Recommended)

Combine methods for best results:

```
Base Sound (Bfxr) + Voice Expression (Audacity) + Polish (Effects)

Example - Creating "Loved Purr":
1. Generate low sine wave in Bfxr (100-200Hz)
2. Record yourself making "prrrr" sound
3. Layer them in Audacity (50% each)
4. Add slight vibrato (Effect > Wahwah, Frequency: 4Hz)
5. Result: Warm, mechanical purr with organic feel
```

---

## Required Sounds List

### Priority 1: Essential Sounds (Must Have)

**Emotional Expressions:**
```
1. happy_chirp_01.wav       - Primary happiness sound
2. happy_chirp_02.wav       - Variation to avoid repetition
3. curious_hum_01.wav       - Questioning/investigation
4. sad_whimper_01.wav       - Disappointment/sadness
5. excited_whistle_01.wav   - High energy excitement
6. loved_purr_01.wav        - Contentment when petted
```

**System Responses:**
```
7. listening_bing.wav       - Wake word detected
8. acknowledgment_chirp.wav - "I heard you"
9. success_ding.wav         - Command executed successfully
10. error_buzz.wav          - Something went wrong
```

**Ambient:**
```
11. startup_beep.wav        - Power on sequence
12. thinking_hum.wav        - Processing indicator
```

### Priority 2: Enhanced Personality (Recommended)

**More Emotions:**
```
13. sleepy_yawn_01.wav      - Low battery/idle too long
14. confused_warble.wav     - Didn't understand
15. surprised_beep.wav      - Unexpected face detected
16. greeting_melody.wav     - Morning greeting
```

**Interactions:**
```
17. playful_giggle.wav      - During active interaction
18. goodbye_chime.wav       - User leaving
19. notification_ping.wav   - Alert sound
20. alert_urgent.wav        - Important notification
```

### Priority 3: Advanced Features (Optional)

**Contextual:**
```
21. morning_chirp.wav       - Time-based greeting
22. night_lullaby.wav       - Bedtime sound
23. working_hum.wav         - During long tasks
24. idle_breathing.wav      - Subtle life presence
```

---

## Processing Workflow

### Universal Processing Pipeline

Every sound should go through these steps in Audacity:

#### Step 1: Import & Trim
```
1. File > Import > Audio
2. Select the best 0.5-3 second segment
3. Edit > Remove Audio or Trim Audio
```

#### Step 2: Noise Reduction (if recorded)
```
1. Select silent part (if any)
2. Effect > Noise Reduction > Get Noise Profile
3. Select all (Ctrl+A)
4. Effect > Noise Reduction > OK (Reduction: 12dB)
```

#### Step 3: EQ (Frequency Shaping)
```
Effect > Filter Curve EQ:
- High-pass at 200Hz (remove rumble)
- Gentle boost at 800-2000Hz (clarity and presence)
- Roll-off above 8kHz (we're at 16kHz sample rate, focus on mids)

Presets:
- Happy sounds: Boost 1-2kHz (bright)
- Sad sounds: Boost 200-400Hz (warm, low)
- Electronic sounds: Notch at 1kHz, boost 2-4kHz (metallic)
```

#### Step 4: Dynamics
```
Effect > Compressor:
- Threshold: -12dB
- Ratio: 3:1
- Attack: 0.01s
- Release: 0.2s

This makes quiet parts louder and prevents clipping.
```

#### Step 5: Normalization
```
Effect > Normalize:
- Normalize peak amplitude to: -3.0 dB
- ✅ Normalize stereo channels independently (if stereo)

This ensures consistent volume across all sounds.
```

#### Step 6: Convert to Mono
```
Tracks > Mix > Mix Stereo Down to Mono
```

#### Step 7: Resample to 16kHz
```
Tracks > Resample:
- New sample rate: 16000 Hz
```

#### Step 8: Export
```
File > Export > Export Audio:
- Format: WAV (Microsoft) signed 16-bit PCM
- Filename: descriptive_name.wav
```

---

## Testing & Quality Control

### Listening Tests

Before finalizing sounds, test them:

1. **Emotional Clarity Test**
   - Play sound without context
   - Ask: "What emotion is this?"
   - Should be immediately obvious

2. **Volume Consistency Test**
   - Play all sounds in sequence
   - All should be roughly same loudness
   - Use loudness meter (Audacity: Analyze > Contrast)

3. **Speaker Test**
   - Test on small speaker (similar to PICO's)
   - Sounds that are too bass-heavy won't work
   - Laptop speakers are good reference

4. **Repetition Test**
   - Play same sound 10 times
   - Does it get annoying? (if yes, redesign)
   - Is there variation if applicable?

5. **Context Test**
   - Play in sequence: happy > sad > curious
   - Transitions should feel natural
   - Each should be distinct

### Technical Verification

```python
# verify_sounds.py
import soundfile as sf
import os

def verify_sound_files(sounds_dir='assets/sounds/'):
    """Verify all sound files meet specifications"""
    
    issues = []
    
    for root, dirs, files in os.walk(sounds_dir):
        for file in files:
            if file.endswith('.wav'):
                path = os.path.join(root, file)
                
                try:
                    data, samplerate = sf.read(path)
                    duration = len(data) / samplerate
                    channels = 1 if len(data.shape) == 1 else data.shape[1]
                    
                    # Check specifications
                    if samplerate != 16000:
                        issues.append(f"❌ {file}: Wrong sample rate ({samplerate}Hz, should be 16000Hz)")
                    
                    if channels != 1:
                        issues.append(f"❌ {file}: Not mono ({channels} channels)")
                    
                    if duration > 3.0:
                        issues.append(f"⚠️ {file}: Too long ({duration:.2f}s, max 3.0s)")
                    
                    if duration < 0.2:
                        issues.append(f"⚠️ {file}: Very short ({duration:.2f}s)")
                    
                    # Check for clipping
                    if abs(data).max() > 0.99:
                        issues.append(f"⚠️ {file}: Possible clipping detected")
                    
                    # Check for silence
                    if abs(data).max() < 0.01:
                        issues.append(f"❌ {file}: Too quiet or silent")
                    
                    if not issues:
                        print(f"✅ {file}: OK ({duration:.2f}s, {samplerate}Hz)")
                        
                except Exception as e:
                    issues.append(f"❌ {file}: Error reading file - {e}")
    
    if issues:
        print("\n⚠️ Issues Found:")
        for issue in issues:
            print(issue)
    else:
        print("\n✅ All sound files verified!")
```

---

## Integration Guide

### File Organization

Place all sound files in the appropriate category folders as shown in the Sound Bank Structure section above.

### Testing in Simulation

```python
# test_sounds.py
from sound_bank import SoundBank
import time

def test_all_sounds():
    """Play all sounds for review"""
    sb = SoundBank('assets/sounds/')
    
    print("🎵 Testing PICO Sound Bank\n")
    
    categories = sb.get_available_sounds()
    
    for category, sounds in categories.items():
        print(f"\n=== {category.upper()} ===")
        for sound in sorted(sounds):
            print(f"\nPlaying: {sound}")
            input("Press Enter to play...")
            sb.play(sound)
            time.sleep(2)
    
    print("\n✅ Sound bank test complete!")

if __name__ == "__main__":
    test_all_sounds()
```

### Adding New Sounds

1. Create sound following this guide
2. Save to appropriate category folder
3. Restart robot or call `sound_bank.load_all_sounds()`
4. Test in context
5. Document in sound_bank.py mapping if needed

---

## Sound Mapping Configuration

### emotion_sound_map.json

```json
{
  "emotions": {
    "happy": {
      "sounds": ["happy_chirp_01", "happy_chirp_02", "happy_chirp_03"],
      "selection": "random_variation",
      "category": "emotional"
    },
    "curious": {
      "sounds": ["curious_hum_01", "curious_hum_02"],
      "selection": "random_variation",
      "category": "emotional"
    },
    "sad": {
      "sounds": ["sad_whimper_01"],
      "selection": "single",
      "category": "emotional"
    },
    "excited": {
      "sounds": ["excited_whistle_01", "excited_whistle_02"],
      "selection": "random_variation",
      "category": "emotional"
    },
    "loved": {
      "sounds": ["loved_purr_01"],
      "selection": "continuous",
      "category": "emotional"
    },
    "sleepy": {
      "sounds": ["sleepy_yawn_01"],
      "selection": "single",
      "category": "emotional"
    }
  },
  "reactions": {
    "greeting": {
      "sounds": ["greeting_beep", "greeting_melody"],
      "selection": "context_based",
      "category": "reactions"
    },
    "acknowledgment": {
      "sounds": ["acknowledgment_chirp"],
      "selection": "single",
      "category": "reactions"
    },
    "success": {
      "sounds": ["success_ding"],
      "selection": "single",
      "category": "reactions"
    },
    "error": {
      "sounds": ["error_buzz"],
      "selection": "single",
      "category": "reactions"
    }
  },
  "ambient": {
    "startup": {
      "sounds": ["startup_beep"],
      "selection": "single",
      "category": "ambient"
    },
    "thinking": {
      "sounds": ["thinking_hum"],
      "selection": "looping",
      "category": "ambient"
    }
  }
}
```

---

## Resources

### Free Sound Creation Tools
- **Bfxr**: https://www.bfxr.net/
- **ChipTone**: https://sfbgames.itch.io/chiptone
- **Audacity**: https://www.audacityteam.org/
- **LMMS**: https://lmms.io/ (music production)

### Free Sound Libraries
- **Freesound**: https://freesound.org/
- **Zapsplat**: https://www.zapsplat.com/
- **BBC Sound Effects**: https://sound-effects.bbcrewind.co.uk/
- **Sonniss GDC**: https://sonniss.com/gameaudiogdc (annual free pack)

### Learning Resources
- **YouTube**: "How to make robot sounds"
- **YouTube**: "Chiptune sound design tutorial"
- **Game Audio 101**: Tutorials on game sound design
- **r/AudioPost**: Reddit community for audio questions

---

## Quick Start Checklist

Ready to create PICO's voice? Follow this:

- [ ] Install Audacity (or use Bfxr web app)
- [ ] Create Priority 1 sounds (12 essential sounds)
- [ ] Process all sounds through standard workflow
- [ ] Verify with verification script
- [ ] Test in simulation
- [ ] Create variations of frequently used sounds
- [ ] Add Priority 2 sounds for more personality
- [ ] Document any custom sounds in sound_bank.py
- [ ] Backup sound library

---

## Conclusion

Creating PICO's sound bank is where its personality truly comes alive. Take your time with this - good sounds make the difference between a robot that feels mechanical and one that feels like a living companion.

**Remember:** PICO doesn't need to speak words to communicate. A well-crafted chirp can convey more emotion and personality than any sentence ever could.

Happy sound designing! 🎵🤖✨
