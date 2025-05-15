from typing import Dict, List, Optional, Any
from models.models import TaxResult, TaxBreakdown, FilingStatus, DeductionType

# Tax brackets for 2023 (simplified)
FEDERAL_TAX_BRACKETS = {
    FilingStatus.SINGLE: [
        (0, 10275, 0.10),
        (10276, 41775, 0.12),
        (41776, 89075, 0.22),
        (89076, 170050, 0.24),
        (170051, 215950, 0.32),
        (215951, 539900, 0.35),
        (539901, float('inf'), 0.37)
    ],
    FilingStatus.MARRIED_JOINT: [
        (0, 20550, 0.10),
        (20551, 83550, 0.12),
        (83551, 178150, 0.22),
        (178151, 340100, 0.24),
        (340101, 431900, 0.32),
        (431901, 647850, 0.35),
        (647851, float('inf'), 0.37)
    ],
    FilingStatus.MARRIED_SEPARATE: [
        (0, 10275, 0.10),
        (10276, 41775, 0.12),
        (41776, 89075, 0.22),
        (89076, 170050, 0.24),
        (170051, 215950, 0.32),
        (215951, 323925, 0.35),
        (323926, float('inf'), 0.37)
    ],
    FilingStatus.HEAD: [
        (0, 14650, 0.10),
        (14651, 55900, 0.12),
        (55901, 89050, 0.22),
        (89051, 170050, 0.24),
        (170051, 215950, 0.32),
        (215951, 539900, 0.35),
        (539901, float('inf'), 0.37)
    ]
}

# Standard deduction amounts for 2023
STANDARD_DEDUCTION = {
    FilingStatus.SINGLE: 12950,
    FilingStatus.MARRIED_JOINT: 25900,
    FilingStatus.MARRIED_SEPARATE: 12950,
    FilingStatus.HEAD: 19400
}

# State income tax rates (simplified)
STATE_INCOME_TAX_RATES = {
    "CA": 0.093,
    "NY": 0.085,
    "TX": 0.0,
    "FL": 0.0,
    "IL": 0.0495,
    "WA": 0.0,
    "NV": 0.0,
    "AZ": 0.045,
    "CO": 0.0455,
    "GA": 0.0575,
    "MA": 0.05,
    "MI": 0.0425,
    "OH": 0.0399,
    "PA": 0.0307,
    "VA": 0.0575
}

# Sales tax rates by state (simplified)
SALES_TAX_RATES = {
    "CA": 0.0725,
    "NY": 0.045,
    "TX": 0.0625,
    "FL": 0.06,
    "IL": 0.0625,
    "WA": 0.065,
    "NV": 0.0685,
    "AZ": 0.056,
    "CO": 0.029,
    "GA": 0.04,
    "MA": 0.0625,
    "MI": 0.06,
    "OH": 0.0575,
    "PA": 0.06,
    "VA": 0.053
}

# Property tax rates by state (simplified)
PROPERTY_TAX_RATES = {
    "CA": 0.0077,
    "NY": 0.0172,
    "TX": 0.0181,
    "FL": 0.0098,
    "IL": 0.0227,
    "WA": 0.0103,
    "NV": 0.0069,
    "AZ": 0.0077,
    "CO": 0.0055,
    "GA": 0.0092,
    "MA": 0.0123,
    "MI": 0.0158,
    "OH": 0.0157,
    "PA": 0.0158,
    "VA": 0.0080
}

def calculate_federal_income_tax(income: float, filing_status: FilingStatus, deduction: float) -> float:
    """
    Calculate federal income tax based on income, filing status, and deductions.
    """
    # Apply deduction
    taxable_income = max(0, income - deduction)
    
    # Get the appropriate tax brackets
    brackets = FEDERAL_TAX_BRACKETS[filing_status]
    
    # Calculate tax
    tax = 0
    for lower, upper, rate in brackets:
        if taxable_income > lower:
            bracket_income = min(taxable_income, upper) - lower
            tax += bracket_income * rate
            
            if taxable_income <= upper:
                break
    
    return tax

def calculate_income_tax(
    annual_income: float,
    filing_status: FilingStatus,
    state: str,
    deduction_type: DeductionType,
    custom_deduction: Optional[float] = None
) -> TaxResult:
    """
    Calculate income tax based on provided information.
    """
    # Determine deduction amount
    if deduction_type == DeductionType.STANDARD:
        deduction = STANDARD_DEDUCTION[filing_status]
    else:  # Itemized
        deduction = custom_deduction if custom_deduction is not None else 0
    
    # Calculate federal tax
    federal_tax = calculate_federal_income_tax(annual_income, filing_status, deduction)
    
    # Calculate state tax (simplified)
    state_tax_rate = STATE_INCOME_TAX_RATES.get(state, 0.05)  # Default to 5% if state not found
    state_tax = annual_income * state_tax_rate
    
    # Calculate Social Security and Medicare
    social_security_tax = min(annual_income, 147000) * 0.062  # 6.2% up to wage base limit
    medicare_tax = annual_income * 0.0145  # 1.45% on all earnings
    
    # Calculate total tax and effective rate
    total_tax = federal_tax + state_tax + social_security_tax + medicare_tax
    effective_rate = (total_tax / annual_income) * 100 if annual_income > 0 else 0
    
    # Create breakdown
    breakdown = [
        TaxBreakdown(name="Federal Income Tax", amount=federal_tax, rate=(federal_tax / annual_income) * 100 if annual_income > 0 else 0),
        TaxBreakdown(name="State Income Tax", amount=state_tax, rate=state_tax_rate * 100),
        TaxBreakdown(name="Social Security", amount=social_security_tax, rate=6.2),
        TaxBreakdown(name="Medicare", amount=medicare_tax, rate=1.45)
    ]
    
    # Generate insights
    insights = generate_income_tax_insights(annual_income, federal_tax, state_tax, effective_rate, filing_status)
    
    return TaxResult(
        federal_tax=federal_tax,
        state_tax=state_tax,
        total_tax=total_tax,
        effective_rate=effective_rate,
        breakdown=breakdown,
        insights=insights
    )

def calculate_sales_tax(
    purchase_amount: float,
    state: str,
    is_essential: bool = False
) -> TaxResult:
    """
    Calculate sales tax for a purchase.
    """
    # Get base sales tax rate for the state
    base_rate = SALES_TAX_RATES.get(state, 0.06)  # Default to 6% if state not found
    
    # Adjust rate for essential items if applicable
    adjusted_rate = base_rate * 0.5 if is_essential else base_rate
    
    # Calculate tax amount
    tax_amount = purchase_amount * adjusted_rate
    
    # Create breakdown
    breakdown = [
        TaxBreakdown(name="State Sales Tax", amount=tax_amount, rate=adjusted_rate * 100)
    ]
    
    # Generate insights
    insights = generate_sales_tax_insights(purchase_amount, tax_amount, state, is_essential)
    
    return TaxResult(
        federal_tax=0,
        state_tax=tax_amount,
        total_tax=tax_amount,
        effective_rate=adjusted_rate * 100,
        breakdown=breakdown,
        insights=insights
    )

def calculate_property_tax(
    property_value: float,
    state: str,
    county: Optional[str] = None
) -> TaxResult:
    """
    Calculate property tax based on property value and location.
    """
    # Get base property tax rate for the state
    base_rate = PROPERTY_TAX_RATES.get(state, 0.01)  # Default to 1% if state not found
    
    # County adjustments would be applied here in a real implementation
    # For this example, we'll use a simple adjustment factor
    county_adjustment = 1.0
    if county:
        # This would be a lookup in a real implementation
        # For now, just a simple hash-based adjustment
        county_adjustment = 0.9 + (hash(county) % 3) / 10  # Between 0.9 and 1.1
    
    # Calculate adjusted rate
    adjusted_rate = base_rate * county_adjustment
    
    # Calculate tax amount
    tax_amount = property_value * adjusted_rate
    
    # Create breakdown
    breakdown = [
        TaxBreakdown(name="Property Tax", amount=tax_amount, rate=adjusted_rate * 100)
    ]
    
    # Generate insights
    insights = generate_property_tax_insights(property_value, tax_amount, state, county)
    
    return TaxResult(
        federal_tax=0,
        state_tax=tax_amount,
        total_tax=tax_amount,
        effective_rate=adjusted_rate * 100,
        breakdown=breakdown,
        insights=insights
    )

def generate_income_tax_insights(income: float, federal_tax: float, state_tax: float, effective_rate: float, filing_status: FilingStatus) -> str:
    """
    Generate insights and recommendations for income tax.
    """
    insights = []
    
    # Compare to national average
    national_avg_rate = 14.6  # Example national average effective tax rate
    if effective_rate > national_avg_rate * 1.2:
        insights.append("Your effective tax rate is significantly higher than the national average.")
    elif effective_rate < national_avg_rate * 0.8:
        insights.append("Your effective tax rate is lower than the national average.")
    
    # Retirement contribution recommendation
    if income > 50000 and effective_rate > 15:
        insights.append(f"Consider maximizing retirement contributions to reduce your taxable income. Contributing to a 401(k) or IRA could save you approximately ${(income * 0.05 * 0.22):.2f} in taxes.")
    
    # Deduction recommendations
    if filing_status == FilingStatus.MARRIED_JOINT:
        insights.append("As a married couple filing jointly, ensure you're taking advantage of all available deductions such as mortgage interest, charitable contributions, and medical expenses.")
    
    # State tax insights
    if state_tax > federal_tax * 0.3:
        insights.append("Your state tax burden is relatively high. Consider consulting a tax professional about state-specific deductions and credits.")
    
    return " ".join(insights)

def generate_sales_tax_insights(amount: float, tax: float, state: str, is_essential: bool) -> str:
    """
    Generate insights for sales tax.
    """
    insights = []
    
    # Compare to national average
    national_avg_rate = 6.57  # Example national average sales tax rate
    state_rate = SALES_TAX_RATES.get(state, 0.06) * 100
    
    if state_rate > national_avg_rate:
        insights.append(f"{state} has a higher sales tax rate than the national average of {national_avg_rate:.2f}%.")
    elif state_rate < national_avg_rate:
        insights.append(f"{state} has a lower sales tax rate than the national average of {national_avg_rate:.2f}%.")
    
    # Essential items insight
    if is_essential:
        insights.append("Essential items often qualify for reduced tax rates or exemptions in many states.")
    
    # Tax-free shopping days
    if state in ["TX", "FL", "MA", "CT"]:
        insights.append(f"{state} offers tax-free shopping days for certain items. Check your state's tax authority website for dates.")
    
    return " ".join(insights)

def generate_property_tax_insights(value: float, tax: float, state: str, county: Optional[str]) -> str:
    """
    Generate insights for property tax.
    """
    insights = []
    
    # Compare to national average
    national_avg_rate = 1.07  # Example national average property tax rate
    state_rate = PROPERTY_TAX_RATES.get(state, 0.01) * 100
    
    if state_rate > national_avg_rate * 1.2:
        insights.append(f"{state} has significantly higher property tax rates than the national average of {national_avg_rate:.2f}%.")
    elif state_rate < national_avg_rate * 0.8:
        insights.append(f"{state} has lower property tax rates than the national average of {national_avg_rate:.2f}%.")
    
    # Homestead exemption
    if state in ["FL", "TX", "GA", "SC"]:
        insights.append(f"{state} offers homestead exemptions that may reduce your property tax burden if this is your primary residence.")
    
    # Assessment appeals
    if tax > value * 0.015:
        insights.append("Your property tax rate is relatively high. Consider checking if your property assessment is accurate and appeal if necessary.")
    
    return " ".join(insights)
