import pytest
import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from tax.calculator import (
    calculate_income_tax,
    calculate_sales_tax,
    calculate_property_tax
)
from models.models import FilingStatus, DeductionType, TaxResult

def test_income_tax_calculation():
    """Test income tax calculation"""
    result = calculate_income_tax(
        annual_income=75000,
        filing_status=FilingStatus.SINGLE,
        state="CA",
        deduction_type=DeductionType.STANDARD,
        custom_deduction=None
    )
    
    assert isinstance(result, TaxResult)
    assert result.federal_tax > 0
    assert result.state_tax > 0
    assert result.total_tax > 0
    assert result.effective_rate > 0
    assert len(result.breakdown) == 4  # Federal, State, Social Security, Medicare

def test_sales_tax_calculation():
    """Test sales tax calculation"""
    result = calculate_sales_tax(
        purchase_amount=100,
        state="CA",
        is_essential=False
    )
    
    assert isinstance(result, TaxResult)
    assert result.federal_tax == 0
    assert result.state_tax > 0
    assert result.total_tax > 0
    assert result.effective_rate > 0
    assert len(result.breakdown) == 1  # State sales tax

def test_property_tax_calculation():
    """Test property tax calculation"""
    result = calculate_property_tax(
        property_value=500000,
        state="CA",
        county="Los Angeles"
    )
    
    assert isinstance(result, TaxResult)
    assert result.federal_tax == 0
    assert result.state_tax > 0
    assert result.total_tax > 0
    assert result.effective_rate > 0
    assert len(result.breakdown) == 1  # Property tax
