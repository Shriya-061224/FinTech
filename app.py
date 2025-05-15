from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from datetime import datetime
import json

# Import our custom modules
from ocr.receipt_processor import process_receipt_image
from tax.calculator import calculate_income_tax, calculate_sales_tax, calculate_property_tax
from models.models import (
    ReceiptData, 
    TransactionCategory,
    IncomeTaxRequest,
    SalesTaxRequest,
    PropertyTaxRequest,
    TaxResult,
    UserSettings
)
from accessibility.voice_commands import VoiceCommandProcessor, VoiceExplanation
from accessibility.haptic_feedback import HapticFeedbackManager, VibrationPattern

app = FastAPI(
    title="FinTech Backend API",
    description="Backend services for OCR receipt processing, tax calculations, and accessibility features",
    version="1.0.0"
)

# Configure CORS to allow requests from our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize accessibility services
voice_command_processor = VoiceCommandProcessor()
voice_explanation = VoiceExplanation()
haptic_feedback = HapticFeedbackManager()

# Mock user settings (in a real app, this would be stored in a database)
user_settings = UserSettings()

@app.get("/")
async def root():
    return {"message": "FinTech Backend API is running"}

# OCR Endpoints
@app.post("/api/ocr/process-receipt", response_model=ReceiptData)
async def process_receipt(file: UploadFile = File(...)):
    """
    Process a receipt image using OCR and extract relevant information.
    """
    try:
        # Ensure the file is an image
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read the file content
        contents = await file.read()
        
        # Process the image with our OCR module
        receipt_data = process_receipt_image(contents)
        
        # Provide haptic feedback for successful processing
        if user_settings.vibration_feedback:
            haptic_feedback.success()
        
        # Provide voice explanation if enabled
        if user_settings.voice_explanation:
            voice_explanation.explain("receipt_upload")
            voice_explanation.explain_screen("receipt_details", ["merchant", "date", "total", "category"])
        
        return receipt_data
    except Exception as e:
        # Provide haptic feedback for error
        if user_settings.vibration_feedback:
            haptic_feedback.error()
        
        raise HTTPException(status_code=500, detail=f"Error processing receipt: {str(e)}")

@app.post("/api/ocr/categorize-transaction")
async def categorize_transaction(transaction_data: Dict[str, Any] = Body(...)):
    """
    Automatically categorize a transaction based on its details.
    """
    try:
        # Extract transaction details
        merchant = transaction_data.get("merchant", "")
        amount = transaction_data.get("amount", 0)
        description = transaction_data.get("description", "")
        
        # Use our categorization logic
        from categorization.categorizer import categorize_transaction
        category = categorize_transaction(merchant, amount, description)
        
        # Provide haptic feedback for successful categorization
        if user_settings.vibration_feedback:
            haptic_feedback.success()
        
        return {"category": category}
    except Exception as e:
        # Provide haptic feedback for error
        if user_settings.vibration_feedback:
            haptic_feedback.error()
        
        raise HTTPException(status_code=500, detail=f"Error categorizing transaction: {str(e)}")

# Tax Calculation Endpoints
@app.post("/api/tax/income", response_model=TaxResult)
async def calculate_income_tax_endpoint(request: IncomeTaxRequest):
    """
    Calculate income tax based on provided information.
    """
    try:
        result = calculate_income_tax(
            annual_income=request.annual_income,
            filing_status=request.filing_status,
            state=request.state,
            deduction_type=request.deduction_type,
            custom_deduction=request.custom_deduction
        )
        
        # Provide haptic feedback for successful calculation
        if user_settings.vibration_feedback:
            haptic_feedback.success()
        
        return result
    except Exception as e:
        # Provide haptic feedback for error
        if user_settings.vibration_feedback:
            haptic_feedback.error()
        
        raise HTTPException(status_code=500, detail=f"Error calculating income tax: {str(e)}")

@app.post("/api/tax/sales", response_model=TaxResult)
async def calculate_sales_tax_endpoint(request: SalesTaxRequest):
    """
    Calculate sales tax for a purchase.
    """
    try:
        result = calculate_sales_tax(
            purchase_amount=request.purchase_amount,
            state=request.state,
            is_essential=request.is_essential
        )
        
        # Provide haptic feedback for successful calculation
        if user_settings.vibration_feedback:
            haptic_feedback.success()
        
        return result
    except Exception as e:
        # Provide haptic feedback for error
        if user_settings.vibration_feedback:
            haptic_feedback.error()
        
        raise HTTPException(status_code=500, detail=f"Error calculating sales tax: {str(e)}")

@app.post("/api/tax/property", response_model=TaxResult)
async def calculate_property_tax_endpoint(request: PropertyTaxRequest):
    """
    Calculate property tax based on property value and location.
    """
    try:
        result = calculate_property_tax(
            property_value=request.property_value,
            state=request.state,
            county=request.county
        )
        
        # Provide haptic feedback for successful calculation
        if user_settings.vibration_feedback:
            haptic_feedback.success()
        
        return result
    except Exception as e:
        # Provide haptic feedback for error
        if user_settings.vibration_feedback:
            haptic_feedback.error()
        
        raise HTTPException(status_code=500, detail=f"Error calculating property tax: {str(e)}")

# User Settings Endpoints
@app.get("/api/settings", response_model=UserSettings)
async def get_user_settings():
    """
    Get the user's settings.
    """
    return user_settings

@app.post("/api/settings", response_model=UserSettings)
async def update_user_settings(settings: UserSettings):
    """
    Update the user's settings.
    """
    global user_settings
    user_settings = settings
    
    # Update accessibility services based on settings
    if settings.voice_commands:
        voice_command_processor.listen()
    else:
        voice_command_processor.stop_listening()
    
    # Update voice explanation language
    voice_explanation.language = settings.language
    
    # Update haptic feedback
    haptic_feedback.set_enabled(settings.vibration_feedback)
    
    # Provide haptic feedback for successful update
    if settings.vibration_feedback:
        haptic_feedback.success()
    
    return user_settings

# Accessibility Endpoints
@app.post("/api/accessibility/speak")
async def speak_text(text: str = Form(...), language: str = Form("en-IN")):
    """
    Convert text to speech.
    """
    try:
        # Update voice explanation language if different
        if voice_explanation.language != language:
            voice_explanation.language = language
        
        # Speak the text
        voice_explanation.engine.say(text)
        voice_explanation.engine.runAndWait()
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error speaking text: {str(e)}")

@app.post("/api/accessibility/vibrate")
async def trigger_vibration(pattern: str = Form("notification")):
    """
    Trigger haptic feedback.
    """
    try:
        # Convert string to enum
        vib_pattern = VibrationPattern(pattern)
        
        # Trigger vibration
        haptic_feedback.vibrate(vib_pattern)
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering vibration: {str(e)}")

@app.post("/api/accessibility/explain")
async def explain_element(element_id: str = Form(...), language: str = Form("en-IN")):
    """
    Provide voice explanation for a UI element.
    """
    try:
        # Update voice explanation language if different
        if voice_explanation.language != language:
            voice_explanation.language = language
        
        # Explain the element
        voice_explanation.explain(element_id)
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error explaining element: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
