import pytest
import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from categorization.categorizer import categorize_transaction, get_all_categories

def test_categorize_grocery_transaction():
    """Test categorization of grocery transactions"""
    category = categorize_transaction("Kroger", 85.75, "Weekly grocery shopping")
    assert category == "Groceries"
    
    category = categorize_transaction("Whole Foods", 120.50, "")
    assert category == "Groceries"

def test_categorize_restaurant_transaction():
    """Test categorization of restaurant transactions"""
    category = categorize_transaction("Starbucks", 5.25, "Coffee")
    assert category == "Food & Dining"
    
    category = categorize_transaction("Chipotle", 12.99, "Lunch")
    assert category == "Food & Dining"

def test_categorize_utility_transaction():
    """Test categorization of utility transactions"""
    category = categorize_transaction("City Power & Light", 85.30, "Monthly electric bill")
    assert category == "Utilities"
    
    category = categorize_transaction("Comcast", 79.99, "Internet bill")
    assert category == "Utilities"

def test_categorize_income_transaction():
    """Test categorization of income transactions"""
    category = categorize_transaction("ACME Corp", 3500.00, "Direct Deposit - Salary")
    assert category == "Income"
    
    category = categorize_transaction("Payroll", 2800.00, "Bi-weekly deposit")
    assert category == "Income"

def test_get_all_categories():
    """Test getting all available categories"""
    categories = get_all_categories()
    assert isinstance(categories, list)
    assert len(categories) > 0
    assert "Groceries" in categories
    assert "Income" in categories
    assert "Other" in categories
