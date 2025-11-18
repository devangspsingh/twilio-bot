from fastapi import APIRouter, Depends, Form, Response, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime
from pydantic import BaseModel
from twilio.twiml.messaging_response import MessagingResponse
from models import Review, get_db

router = APIRouter()

# --- In-Memory Conversation State Management ---
conversation_state: Dict[str, dict] = {}

STEPS = {
    "START": 0,
    "ASK_PRODUCT": 1,
    "ASK_NAME": 2,
    "ASK_REVIEW": 3,
    "FINISH": 4
}


class ReviewSchema(BaseModel):
    id: int
    contact_number: str
    user_name: str
    product_name: str
    product_review: str
    status: str
    created_at: datetime


    class Config:
        from_attributes = True


# Twilio status callback endpoint
@router.post("/twilio-status-callback")
async def twilio_status_callback(
    MessageSid: str = Form(...),
    MessageStatus: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Twilio will POST here with message status updates (delivered, failed, etc).
    """
    # Find the review by MessageSid if you store it, or update by other logic
    # For demo, update all reviews with status 'pending' to the new status
    reviews = db.query(Review).filter(Review.status == "pending").all()
    for review in reviews:
        review.status = MessageStatus
    db.commit()
    return {"status": "updated"}

@router.get("/api/reviews", response_model=List[ReviewSchema])
def get_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return reviews

@router.post("/webhook")
async def whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(...),
    db: Session = Depends(get_db)
):
    sender_id = From
    incoming_msg = Body.strip()
    resp = MessagingResponse()
    user_state = conversation_state.get(sender_id, {"step": STEPS["START"], "data": {}})
    current_step = user_state["step"]

    if current_step == STEPS["START"]:
        resp.message("Hi! Which product is this review for?")
        user_state["step"] = STEPS["ASK_NAME"]
    elif current_step == STEPS["ASK_NAME"]:
        user_state["data"]["product_name"] = incoming_msg
        resp.message(f"Okay, got it. What's your name?")
        user_state["step"] = STEPS["ASK_REVIEW"]
    elif current_step == STEPS["ASK_REVIEW"]:
        user_state["data"]["user_name"] = incoming_msg
        product = user_state["data"].get("product_name")
        resp.message(f"Please send your review for {product}.")
        user_state["step"] = STEPS["FINISH"]
    elif current_step == STEPS["FINISH"]:
        product = user_state["data"].get("product_name")
        name = user_state["data"].get("user_name")
        new_review = Review(
            contact_number=sender_id,
            user_name=name,
            product_name=product,
            product_review=incoming_msg
        )
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        resp.message(f"Thanks {name} -- your review for {product} has been recorded.")
        del conversation_state[sender_id]
        return Response(content=str(resp), media_type="application/xml")
    else:
        conversation_state[sender_id] = {"step": STEPS["START"], "data": {}}
        resp.message("Let's start over. Which product is this review for?")
    if sender_id in conversation_state or current_step != STEPS["FINISH"]:
        conversation_state[sender_id] = user_state
    return Response(content=str(resp), media_type="application/xml")
