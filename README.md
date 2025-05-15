# FinSmart Python Backend

This is the Python backend for the FinSmart personal finance application. It provides OCR processing for receipts and tax calculations.

## Features

- Receipt OCR processing using Tesseract
- Automatic transaction categorization
- Tax calculations (income, sales, property)
- RESTful API with FastAPI

## Setup

### Prerequisites

- Python 3.8+
- Tesseract OCR installed on your system

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`
3. Install Tesseract OCR:
   - On Ubuntu/Debian: `sudo apt-get install tesseract-ocr`
   - On macOS: `brew install tesseract`
   - On Windows: Download and install from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)

### Running the Server

\`\`\`
uvicorn app:app --reload
\`\`\`

The server will start at http://localhost:8000

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### OCR Endpoints

- `POST /api/ocr/process-receipt`: Process a receipt image and extract data
- `POST /api/ocr/categorize-transaction`: Categorize a transaction based on its details

### Tax Calculation Endpoints

- `POST /api/tax/income`: Calculate income tax
- `POST /api/tax/sales`: Calculate sales tax
- `POST /api/tax/property`: Calculate property tax

## Docker

You can also run the application using Docker:

\`\`\`
docker build -t finsmart-backend .
docker run -p 8000:8000 finsmart-backend
\`\`\`

## Integration with Frontend

This backend is designed to work with the FinSmart Next.js frontend. The frontend makes API calls to this backend for OCR processing and tax calculations.

## License

MIT
\`\`\`

```python file="tests/test_ocr.py"
import pytest
import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from ocr.receipt_processor import process_receipt_image, parse_receipt_text
from models.models import ReceiptData

def test_parse_receipt_text():
    """Test the receipt text parsing function"""
    sample_text = """
    GROCERY STORE
    123 Main St
    City, State 12345
    
    Date: 05/14/2025
    
    Milk                 4.99
    Bread                3.49
    Eggs                 5.99
    Apples               6.75
    
    Subtotal            21.22
    Tax                  1.28
    Total               22.50
    
    Thank you for shopping with us!
    """
    
    result = parse_receipt_text(sample_text)
    
    assert isinstance(result, ReceiptData)
    assert result.merchant == "GROCERY STORE"
    assert result.total == 22.50
    assert len(result.items) > 0
    assert result.category == "Groceries"

def test_empty_text():
    """Test parsing with empty text"""
    result = parse_receipt_text("")
    
    assert isinstance(result, ReceiptData)
    assert result.merchant == ""
    assert result.total == 0.0

def test_missing_total():
    """Test parsing when total is missing"""
    sample_text = """
    PHARMACY
    123 Main St
    
    Date: 05/14/2025
    
    Medicine             12.99
    Bandages              4.50
    """
    
    result = parse_receipt_text(sample_text)
    
    assert isinstance(result, ReceiptData)
    assert result.merchant == "PHARMACY"
    assert result.total == 0.0  # Default when no total is found
    assert result.category == "Health & Medical"
