import platform
import subprocess
import time
import threading
from enum import Enum
from typing import Optional

class VibrationPattern(Enum):
    """Vibration patterns for different types of feedback."""
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"
    NOTIFICATION = "notification"
    BUTTON_PRESS = "button_press"

class HapticFeedback:
    """
    Provides haptic feedback for deaf users.
    Supports vibration on mobile devices and desktop computers.
    """
    def __init__(self):
        self.system = platform.system()
        self.patterns = {
            VibrationPattern.SUCCESS: [200, 100, 200],  # Two short vibrations
            VibrationPattern.ERROR: [500, 100, 500, 100, 500],  # Three long vibrations
            VibrationPattern.WARNING: [300, 100, 300],  # Two medium vibrations
            VibrationPattern.NOTIFICATION: [100, 50, 100, 50, 100],  # Three short vibrations
            VibrationPattern.BUTTON_PRESS: [50],  # Very short vibration
        }
    
    def vibrate(self, pattern: VibrationPattern = VibrationPattern.NOTIFICATION):
        """
        Trigger vibration with the specified pattern.
        
        Args:
            pattern: The vibration pattern to use
        """
        # Get the vibration pattern
        durations = self.patterns.get(pattern, [200])
        
        # Start vibration in a separate thread to avoid blocking
        threading.Thread(target=self._vibrate_thread, args=(durations,), daemon=True).start()
    
    def _vibrate_thread(self, durations):
        """
        Thread function to handle vibration.
        
        Args:
            durations: List of vibration durations in milliseconds
        """
        try:
            if self.system == "Linux":
                self._vibrate_linux(durations)
            elif self.system == "Darwin":  # macOS
                self._vibrate_macos(durations)
            elif self.system == "Windows":
                self._vibrate_windows(durations)
            else:
                print(f"Vibration not supported on {self.system}")
        except Exception as e:
            print(f"Error during vibration: {e}")
    
    def _vibrate_linux(self, durations):
        """
        Vibrate on Linux systems.
        
        Args:
            durations: List of vibration durations in milliseconds
        """
        try:
            # Check if this is an Android device (via adb)
            result = subprocess.run(["which", "adb"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if result.returncode == 0:
                # Use ADB to vibrate an Android device
                pattern_str = ",".join(map(str, durations))
                subprocess.run(["adb", "shell", f"am broadcast -a android.intent.action.VIBRATE -e pattern {pattern_str}"])
            else:
                # Try using Linux's input subsystem (requires root)
                for duration in durations:
                    subprocess.run(["sudo", "sh", "-c", f"echo 1 > /sys/class/leds/vibrator/activate"])
                    time.sleep(duration / 1000)
                    subprocess.run(["sudo", "sh", "-c", f"echo 0 > /sys/class/leds/vibrator/activate"])
                    if len(durations) > 1:
                        time.sleep(0.1)  # Pause between vibrations
        except Exception as e:
            print(f"Linux vibration error: {e}")
    
    def _vibrate_macos(self, durations):
        """
        Vibrate on macOS systems.
        
        Args:
            durations: List of vibration durations in milliseconds
        """
        try:
            # Use AppleScript to trigger haptic feedback
            for duration in durations:
                # macOS doesn't support variable duration, so we just trigger the feedback
                subprocess.run(["osascript", "-e", "tell application \"System Events\" to play sound \"Funk\""])
                time.sleep(duration / 1000)
                if len(durations) > 1:
                    time.sleep(0.1)  # Pause between vibrations
        except Exception as e:
            print(f"macOS vibration error: {e}")
    
    def _vibrate_windows(self, durations):
        """
        Vibrate on Windows systems.
        
        Args:
            durations: List of vibration durations in milliseconds
        """
        try:
            # Use PowerShell to trigger vibration (requires Windows 10+)
            for duration in durations:
                # Windows doesn't support variable duration directly
                ps_script = f"""
                Add-Type -AssemblyName System.Windows.Forms
                $form = New-Object System.Windows.Forms.Form
                $form.WindowState = 'Minimized'
                $form.ShowInTaskbar = $false
                $form.Show()
                [System.Windows.Forms.SystemSounds]::Exclamation.Play()
                Start-Sleep -Milliseconds {duration}
                $form.Close()
                """
                subprocess.run(["powershell", "-Command", ps_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                if len(durations) > 1:
                    time.sleep(0.1)  # Pause between vibrations
        except Exception as e:
            print(f"Windows vibration error: {e}")

class HapticFeedbackManager:
    """
    Manages haptic feedback for the application.
    """
    _instance: Optional['HapticFeedbackManager'] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HapticFeedbackManager, cls).__new__(cls)
            cls._instance.haptic = HapticFeedback()
            cls._instance.enabled = True
        return cls._instance
    
    def set_enabled(self, enabled: bool):
        """Enable or disable haptic feedback."""
        self.enabled = enabled
    
    def vibrate(self, pattern: VibrationPattern = VibrationPattern.NOTIFICATION):
        """Trigger vibration if enabled."""
        if self.enabled:
            self.haptic.vibrate(pattern)
    
    def success(self):
        """Trigger success vibration."""
        self.vibrate(VibrationPattern.SUCCESS)
    
    def error(self):
        """Trigger error vibration."""
        self.vibrate(VibrationPattern.ERROR)
    
    def warning(self):
        """Trigger warning vibration."""
        self.vibrate(VibrationPattern.WARNING)
    
    def notification(self):
        """Trigger notification vibration."""
        self.vibrate(VibrationPattern.NOTIFICATION)
    
    def button_press(self):
        """Trigger button press vibration."""
        self.vibrate(VibrationPattern.BUTTON_PRESS)
