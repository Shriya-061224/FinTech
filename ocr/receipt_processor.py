import cv2
import numpy as np
import pytesseract
from PIL import Image
import io
import re
from datetime import datetime
import json
from models.models import ReceiptData, ReceiptItem
from categorization.categorizer import categorize_transaction

# Configure Tesseract path if needed
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows
# For Linux/Mac, ensure Tesseract is installed and in PATH

def preprocess_image(image_bytes):
    """
    Preprocess the image to improve OCR accuracy.
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                  cv2.THRESH_BINARY, 11, 2)
    
    # Noise removal
    kernel = np.ones((1, 1), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
    
    # Deskew image if needed
    coords = np.column_stack(np.where(opening > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    
    # Rotate the image to deskew it if angle is significant
    if abs(angle) > 0.5:
        (h, w) = opening.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        opening = cv2.warpAffine(opening, M, (w, h), flags=cv2.INTER_CUBIC, 
                                borderMode=cv2.BORDER_REPLICATE)
    
    return opening

def extract_text(preprocessed_image):
    """
    Extract text from the preprocessed image using Tesseract OCR.
    """
    # Convert numpy array to PIL Image
    pil_img = Image.fromarray(preprocessed_image)
    
    # Use Tesseract to extract text with improved configuration
    # PSM 4: Assume a single column of text of variable sizes
    # OEM 3: Default OCR engine mode (LSTM only)
    text = pytesseract.image_to_string(
        pil_img, 
        config='--psm 4 --oem 3 -l eng+hin+mar+tam+tel+kan+ben+guj'
    )
    
    return text

def parse_receipt_text(text):
    """
    Parse the extracted text to identify merchant, date, total, receipt type, and items.
    Enhanced for Indian receipts and currency.
    """
    lines = text.split('\n')
    lines = [line.strip() for line in lines if line.strip()]
    
    # Initialize receipt data
    merchant = ""
    date = None
    total = 0.0
    receipt_type = "General"
    items = []
    
    # Try to identify merchant (usually first few lines)
    if lines:
        merchant = lines[0]
        
        # If first line looks like a header, try the second line
        if len(merchant) < 3 or any(word in merchant.lower() for word in ['receipt', 'invoice', 'bill', 'cash memo']):
            if len(lines) > 1:
                merchant = lines[1]
    
    # Look for date with Indian formats
    date_patterns = [
        r'(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})',  # DD/MM/YYYY or MM/DD/YYYY
        r'(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})',  # DD Mon YYYY
        r'Date\s*:?\s*(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})',  # Date: DD/MM/YYYY
        r'Date\s*:?\s*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})',  # Date: DD Mon YYYY
    ]
    
    for line in lines:
        for pattern in date_patterns:
            date_match = re.search(pattern, line, re.IGNORECASE)
            if date_match:
                date_str = date_match.group(1)
                try:
                    # Try different date formats (Indian format is typically DD/MM/YYYY)
                    for fmt in ['%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y', '%d/%m/%y', '%d-%m-%y', '%d.%m.%y', 
                               '%d %b %Y', '%d %B %Y']:
                        try:
                            date = datetime.strptime(date_str, fmt)
                            break
                        except ValueError:
                            continue
                except:
                    # If parsing fails, use current date
                    date = datetime.now()
                break
        if date:
            break
    
    # If no date found, use current date
    if not date:
        date = datetime.now()
    
    # Identify receipt type
    receipt_type_keywords = {
        "Food": ["restaurant", "cafe", "food", "dining", "meal", "lunch", "dinner", "breakfast"],
        "Grocery": ["grocery", "supermarket", "mart", "store", "kirana", "provision"],
        "Medical": ["pharmacy", "medical", "medicine", "hospital", "clinic", "doctor", "healthcare"],
        "Utility": ["electricity", "water", "gas", "utility", "bill", "broadband", "internet", "phone"],
        "Transportation": ["travel", "transport", "fuel", "petrol", "diesel", "gas", "taxi", "uber", "ola"],
        "Entertainment": ["movie", "cinema", "theatre", "entertainment", "game", "play"],
        "Shopping": ["mall", "shop", "store", "retail", "clothing", "apparel", "electronics"],
        "Education": ["school", "college", "university", "tuition", "course", "class", "education"],
        "Investment": ["investment", "mutual fund", "stock", "share", "bond", "deposit", "fd", "rd"]
    }
    
    text_lower = text.lower()
    for type_name, keywords in receipt_type_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            receipt_type = type_name
            break
    
    # Look for total amount with Indian Rupee symbols and formats
    total_patterns = [
        r'total\s*(?:amount)?(?:\s*:)?\s*(?:Rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)',
        r'(?:grand|net|final)\s+total\s*(?:\s*:)?\s*(?:Rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)',
        r'amount\s*(?:payable|paid|due)(?:\s*:)?\s*(?:Rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)',
        r'(?:Rs\.?|₹)\s*(\d+(?:[.,]\d+)?)\s*(?:only|/-)?',
        r'(?:total|amount|sum)(?:\s|$).*?(?:Rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)',
    ]
    
    for line in lines:
        for pattern in total_patterns:
            total_match = re.search(pattern, line, re.IGNORECASE)
            if total_match:
                try:
                    # Handle Indian number format (e.g., 1,00,000.00)
                    amount_str = total_match.group(1).replace(',', '')
                    total = float(amount_str)
                    break
                except:
                    continue
        if total > 0:
            break
    
    # Extract items with Indian Rupee format
    # This pattern looks for item descriptions followed by quantities and prices
    item_patterns = [
        r'([A-Za-z0-9\s\&\-]+)\s+(?:\d+(?:\.\d+)?)?\s*(?:x\s*)?(?:Rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)',
        r'([A-Za-z0-9\s\&\-]+)\s+(?:Rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)',
    ]
    
    for line in lines:
        # Skip lines that are likely headers or totals
        if any(word in line.lower() for word in ['total', 'subtotal', 'tax', 'amount', 'change', 'cash', 'credit', 'card', 'gst', 'cgst', 'sgst']):
            continue
        
        for pattern in item_patterns:
            item_match = re.search(pattern, line)
            if item_match:
                item_name = item_match.group(1).strip()
                try:
                    item_price = float(item_match.group(2).replace(',', ''))
                    if item_price > 0 and len(item_name) > 1:
                        items.append(ReceiptItem(name=item_name, price=item_price))
                except:
                    continue
    
    # Determine category based on merchant, receipt type and items
    category = categorize_transaction(merchant, total, " ".join([item.name for item in items]))
    
    # Create and return receipt data
    receipt_data = ReceiptData(
        merchant=merchant,
        date=date,
        total=total,
        receipt_type=receipt_type,
        category=category,
        items=items,
        raw_text=text
    )
    
    return receipt_data

def process_receipt_image(image_bytes):
    """
    Process a receipt image and extract structured data.
    """
    # Preprocess the image
    preprocessed = preprocess_image(image_bytes)
    
    # Extract text using OCR
    text = extract_text(preprocessed)
    
    # Parse the text to extract structured data
    receipt_data = parse_receipt_text(text)
    
    return receipt_data
