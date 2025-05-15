from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class ReceiptItem(BaseModel):
    name: str
    price: float
    quantity: Optional[float] = 1.0

class ReceiptData(BaseModel):
    merchant: str
    date: datetime
    total: float
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    category: Optional[str] = None
    receipt_type: Optional[str] = "General"
    items: List[ReceiptItem] = []
    raw_text: Optional[str] = None

class TransactionCategory(str, Enum):
    FOOD_DINING = "Food & Dining"
    GROCERIES = "Groceries"
    TRANSPORTATION = "Transportation"
    UTILITIES = "Utilities"
    HOUSING = "Housing"
    ENTERTAINMENT = "Entertainment"
    SHOPPING = "Shopping"
    PERSONAL_CARE = "Personal Care"
    HEALTH_MEDICAL = "Health & Medical"
    EDUCATION = "Education"
    TRAVEL = "Travel"
    GIFTS_DONATIONS = "Gifts & Donations"
    BILLS_PAYMENTS = "Bills & Payments"
    INVESTMENTS = "Investments"
    INCOME = "Income"
    OTHER = "Other"

class FilingStatus(str, Enum):
    SINGLE = "single"
    MARRIED_JOINT = "married-joint"
    MARRIED_SEPARATE = "married-separate"
    HEAD = "head"

class DeductionType(str, Enum):
    STANDARD = "standard"
    ITEMIZED = "itemized"

class IncomeTaxRequest(BaseModel):
    annual_income: float
    filing_status: FilingStatus
    state: str
    deduction_type: DeductionType
    custom_deduction: Optional[float] = None

class SalesTaxRequest(BaseModel):
    purchase_amount: float
    state: str
    is_essential: bool = False

class PropertyTaxRequest(BaseModel):
    property_value: float
    state: str
    county: Optional[str] = None

class TaxBreakdown(BaseModel):
    name: str
    amount: float
    rate: float

class TaxResult(BaseModel):
    federal_tax: float = 0
    state_tax: float = 0
    total_tax: float
    effective_rate: float
    breakdown: List[TaxBreakdown]
    insights: Optional[str] = None

class UserSettings(BaseModel):
    theme: str = "light"  # light or dark
    currency: str = "INR"  # INR, USD, etc.
    privacy_mode: str = "private"  # private or public
    
    # Accessibility settings
    high_contrast: bool = False
    large_text: bool = False
    voice_commands: bool = False
    voice_explanation: bool = False
    vibration_feedback: bool = False
    simplified_ui: bool = False
    text_to_speech: bool = False
    font_type: str = "default"
    font_size: int = 100  # percentage
    
    # Notification settings
    email_notifications: bool = False
    push_notifications: bool = True
    sms_notifications: bool = False
    
    # Language settings
    language: str = "en"  # en, hi, etc.
    
    # Security settings
    two_factor_auth: bool = False
    biometric_login: bool = False
    
    # Display settings
    show_balance: bool = True
    default_view: str = "dashboard"  # dashboard, transactions, budget, etc.
