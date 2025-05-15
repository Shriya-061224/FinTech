import speech_recognition as sr
import pyttsx3
import threading
import queue
import json
import os
import time
from typing import Dict, List, Callable, Any

class VoiceCommandProcessor:
    """
    Processes voice commands for the FinTech application.
    Supports multiple languages including English and Indian languages.
    """
    def __init__(self, language="en-IN"):
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 4000
        self.recognizer.dynamic_energy_threshold = True
        
        # Initialize text-to-speech engine
        self.engine = pyttsx3.init()
        
        # Set language
        self.language = language
        
        # Set voice properties
        voices = self.engine.getProperty('voices')
        # Try to find a voice matching the language
        for voice in voices:
            if language[:2] in voice.id:
                self.engine.setProperty('voice', voice.id)
                break
        
        # Command queue and processing thread
        self.command_queue = queue.Queue()
        self.is_listening = False
        self.listen_thread = None
        
        # Command handlers
        self.command_handlers: Dict[str, Callable] = {}
        
        # Load command mappings for different languages
        self.load_command_mappings()
    
    def load_command_mappings(self):
        """Load command mappings for different languages from a JSON file."""
        try:
            # In a real app, this would be loaded from a file
            self.command_mappings = {
                "en-IN": {
                    "dashboard": ["dashboard", "home", "main screen"],
                    "transactions": ["transactions", "expenses", "spending"],
                    "budget": ["budget", "budgeting", "spending plan"],
                    "scan": ["scan", "scan receipt", "take photo"],
                    "settings": ["settings", "preferences", "options"],
                    "back": ["back", "go back", "previous"],
                    "next": ["next", "forward", "continue"],
                },
                "hi-IN": {
                    "dashboard": ["डैशबोर्ड", "होम", "मुख्य स्क्रीन"],
                    "transactions": ["लेनदेन", "खर्च", "व्यय"],
                    "budget": ["बजट", "बजटिंग", "खर्च योजना"],
                    "scan": ["स्कैन", "रसीद स्कैन", "फोटो लें"],
                    "settings": ["सेटिंग्स", "प्राथमिकताएं", "विकल्प"],
                    "back": ["वापस", "पीछे जाओ", "पिछला"],
                    "next": ["अगला", "आगे", "जारी रखें"],
                }
            }
        except Exception as e:
            print(f"Error loading command mappings: {e}")
            # Fallback to English commands
            self.command_mappings = {
                "en-IN": {
                    "dashboard": ["dashboard", "home", "main screen"],
                    "transactions": ["transactions", "expenses", "spending"],
                    "budget": ["budget", "budgeting", "spending plan"],
                    "scan": ["scan", "scan receipt", "take photo"],
                    "settings": ["settings", "preferences", "options"],
                    "back": ["back", "go back", "previous"],
                    "next": ["next", "forward", "continue"],
                }
            }
    
    def register_command_handler(self, command: str, handler: Callable):
        """Register a handler function for a specific command."""
        self.command_handlers[command] = handler
    
    def speak(self, text: str):
        """Convert text to speech."""
        self.engine.say(text)
        self.engine.runAndWait()
    
    def listen(self):
        """Listen for voice commands in a separate thread."""
        if self.is_listening:
            return
        
        self.is_listening = True
        self.listen_thread = threading.Thread(target=self._listen_loop)
        self.listen_thread.daemon = True
        self.listen_thread.start()
    
    def stop_listening(self):
        """Stop listening for voice commands."""
        self.is_listening = False
        if self.listen_thread:
            self.listen_thread.join(timeout=1)
    
    def _listen_loop(self):
        """Background thread that continuously listens for commands."""
        while self.is_listening:
            try:
                with sr.Microphone() as source:
                    self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    print("Listening for commands...")
                    audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
                
                try:
                    # Try to recognize in the primary language
                    text = self.recognizer.recognize_google(audio, language=self.language)
                    print(f"Recognized: {text}")
                    
                    # Process the command
                    self._process_command(text.lower())
                    
                except sr.UnknownValueError:
                    print("Could not understand audio")
                except sr.RequestError as e:
                    print(f"Could not request results; {e}")
            
            except Exception as e:
                print(f"Error in listen loop: {e}")
                time.sleep(1)
    
    def _process_command(self, text: str):
        """Process the recognized command text."""
        # Get the appropriate language mappings
        mappings = self.command_mappings.get(self.language, self.command_mappings["en-IN"])
        
        # Check each command category
        for command, phrases in mappings.items():
            if any(phrase in text for phrase in phrases):
                if command in self.command_handlers:
                    # Add to queue for processing
                    self.command_queue.put((command, text))
                    return
        
        # If no command matched, provide feedback
        self.speak("Sorry, I didn't understand that command.")
    
    def process_command_queue(self):
        """Process any pending commands in the queue."""
        while not self.command_queue.empty():
            command, text = self.command_queue.get()
            try:
                # Call the registered handler
                self.command_handlers[command](text)
            except Exception as e:
                print(f"Error processing command {command}: {e}")
            finally:
                self.command_queue.task_done()

class VoiceExplanation:
    """
    Provides voice explanations for blind users.
    """
    def __init__(self, language="en-IN"):
        # Initialize text-to-speech engine
        self.engine = pyttsx3.init()
        
        # Set language
        self.language = language
        
        # Set voice properties
        voices = self.engine.getProperty('voices')
        # Try to find a voice matching the language
        for voice in voices:
            if language[:2] in voice.id:
                self.engine.setProperty('voice', voice.id)
                break
        
        # Load explanations for different UI elements
        self.load_explanations()
    
    def load_explanations(self):
        """Load explanations for different UI elements."""
        # In a real app, this would be loaded from a file
        self.explanations = {
            "en-IN": {
                "dashboard": "Dashboard page shows your financial overview including income, expenses, and savings.",
                "transactions": "Transactions page shows your recent financial activities.",
                "budget": "Budget page helps you plan and track your spending.",
                "scan": "Scan page allows you to scan receipts using your camera.",
                "settings": "Settings page lets you customize the app according to your preferences.",
                "receipt_upload": "Here you can upload a receipt image for processing.",
                "transaction_form": "This form allows you to enter transaction details manually.",
                "chart": "This chart shows your financial data graphically.",
                "balance": "This shows your current account balance.",
                "income": "This shows your income for the selected period.",
                "expenses": "This shows your expenses for the selected period.",
                "savings": "This shows your savings for the selected period.",
            },
            "hi-IN": {
                "dashboard": "डैशबोर्ड पेज आपके वित्तीय अवलोकन को दिखाता है, जिसमें आय, व्यय और बचत शामिल हैं।",
                "transactions": "लेनदेन पेज आपकी हाल की वित्तीय गतिविधियों को दिखाता है।",
                "budget": "बजट पेज आपको अपने खर्च की योजना बनाने और ट्रैक करने में मदद करता है।",
                "scan": "स्कैन पेज आपको अपने कैमरे का उपयोग करके रसीदें स्कैन करने की अनुमति देता है।",
                "settings": "सेटिंग्स पेज आपको अपनी प्राथमिकताओं के अनुसार ऐप को अनुकूलित करने देता है।",
                "receipt_upload": "यहां आप प्रोसेसिंग के लिए रसीद इमेज अपलोड कर सकते हैं।",
                "transaction_form": "यह फॉर्म आपको मैन्युअल रूप से लेनदेन विवरण दर्ज करने की अनुमति देता है।",
                "chart": "यह चार्ट आपके वित्तीय डेटा को ग्राफिक रूप से दिखाता है।",
                "balance": "यह आपका वर्तमान खाता शेष दिखाता है।",
                "income": "यह चयनित अवधि के लिए आपकी आय दिखाता है।",
                "expenses": "यह चयनित अवधि के लिए आपके खर्च दिखाता है।",
                "savings": "यह चयनित अवधि के लिए आपकी बचत दिखाता है।",
            }
        }
    
    def explain(self, element_id: str):
        """Provide voice explanation for a UI element."""
        # Get the appropriate language explanations
        explanations = self.explanations.get(self.language, self.explanations["en-IN"])
        
        # Get the explanation for the element
        explanation = explanations.get(element_id, f"No explanation available for {element_id}")
        
        # Speak the explanation
        self.engine.say(explanation)
        self.engine.runAndWait()
    
    def explain_screen(self, screen_id: str, elements: List[str]):
        """Provide a comprehensive explanation of a screen and its elements."""
        # First explain the screen
        self.explain(screen_id)
        
        # Then explain each element
        for element in elements:
            self.explain(element)
