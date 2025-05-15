import re
from typing import List, Dict, Any, Optional

# Define category keywords
CATEGORY_KEYWORDS = {
    "Food & Dining": [
        "restaurant", "cafe", "diner", "bistro", "grill", "steakhouse", "pizzeria", 
        "sushi", "thai", "chinese", "mexican", "italian", "burger", "mcdonald", 
        "wendy", "taco bell", "kfc", "subway", "starbucks", "dunkin", "coffee"
    ],
    "Groceries": [
        "grocery", "supermarket", "market", "food", "produce", "kroger", "safeway", 
        "walmart", "target", "costco", "sam's club", "trader joe", "whole foods", 
        "aldi", "publix", "wegmans", "milk", "bread", "eggs", "meat", "vegetable"
    ],
    "Transportation": [
        "gas", "fuel", "petrol", "shell", "exxon", "chevron", "bp", "uber", "lyft", 
        "taxi", "cab", "transit", "subway", "metro", "bus", "train", "parking", 
        "toll", "car wash", "auto", "vehicle"
    ],
    "Utilities": [
        "electric", "water", "gas", "utility", "power", "energy", "sewage", "waste", 
        "garbage", "internet", "wifi", "broadband", "cable", "tv", "phone", "mobile", 
        "cell", "verizon", "at&t", "t-mobile", "sprint", "comcast", "xfinity"
    ],
    "Housing": [
        "rent", "mortgage", "lease", "apartment", "condo", "house", "home", "property", 
        "real estate", "hoa", "maintenance", "repair", "furniture", "decor", "ikea", 
        "home depot", "lowe's", "bed bath", "wayfair"
    ],
    "Entertainment": [
        "movie", "theater", "cinema", "concert", "show", "ticket", "netflix", "hulu", 
        "disney+", "spotify", "apple music", "amazon prime", "game", "playstation", 
        "xbox", "nintendo", "steam", "book", "kindle", "audible"
    ],
    "Shopping": [
        "amazon", "ebay", "etsy", "walmart", "target", "best buy", "apple", "microsoft", 
        "clothing", "apparel", "fashion", "shoes", "accessory", "jewelry", "watch", 
        "electronics", "gadget", "device"
    ],
    "Personal Care": [
        "salon", "spa", "hair", "nail", "barber", "beauty", "cosmetic", "makeup", 
        "skincare", "pharmacy", "cvs", "walgreens", "rite aid", "soap", "shampoo", 
        "toothpaste", "deodorant"
    ],
    "Health & Medical": [
        "doctor", "physician", "hospital", "clinic", "medical", "health", "dental", 
        "dentist", "vision", "eye", "optometrist", "prescription", "medicine", "drug", 
        "therapy", "counseling", "insurance"
    ],
    "Education": [
        "school", "college", "university", "tuition", "education", "course", "class", 
        "training", "workshop", "seminar", "book", "textbook", "supplies", "student", 
        "loan", "scholarship"
    ],
    "Bills & Payments": [
        "bill", "payment", "fee", "subscription", "membership", "due", "invoice", 
        "statement", "account", "service", "charge", "credit card", "loan", "debt"
    ]
}

def categorize_transaction(merchant: str, amount: float, description: str = "") -> str:
    """
    Automatically categorize a transaction based on merchant name, amount, and description.
    
    Args:
        merchant: The name of the merchant or store
        amount: The transaction amount
        description: Additional description or notes about the transaction
        
    Returns:
        The determined category as a string
    """
    # Combine merchant and description for better matching
    text = f"{merchant} {description}".lower()
    
    # Check for income (usually large deposits)
    if amount > 500 and any(word in text for word in ["salary", "deposit", "payroll", "income", "direct deposit"]):
        return "Income"
    
    # Check each category's keywords
    max_matches = 0
    best_category = "Other"  # Default category
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword.lower() in text)
        if matches > max_matches:
            max_matches = matches
            best_category = category
    
    # Special case for bills - check for common bill merchants
    if any(bill_word in text for bill_word in ["bill", "payment", "monthly", "subscription"]):
        if any(utility in text for utility in ["electric", "water", "gas", "power", "energy"]):
            return "Utilities"
        if any(housing in text for housing in ["rent", "mortgage", "lease", "hoa"]):
            return "Housing"
    
    return best_category

def get_all_categories() -> List[str]:
    """
    Get a list of all available transaction categories.
    
    Returns:
        List of category names
    """
    categories = list(CATEGORY_KEYWORDS.keys())
    categories.extend(["Income", "Other"])
    return categories
