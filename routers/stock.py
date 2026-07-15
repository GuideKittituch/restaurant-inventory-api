from fastapi import APIRouter
from pydantic import BaseModel
from db import supabase

router = APIRouter()

class StockTextInput(BaseModel):
    raw_text: str
    source: str = "text"

@router.post("/text")
def ingest_stock_text(payload: StockTextInput):
    # TODO ขั้นต่อไป: ส่ง payload.raw_text เข้า LLM ให้ extract
    # {ingredient, qty, unit} แล้ว fuzzy match กับตาราง ingredients
    # ตอนนี้ insert ดิบไปก่อนเพื่อทดสอบ pipeline
    result = supabase.table("stock_snapshots").insert({
        "raw_input": payload.raw_text,
        "source": payload.source,
        "counted_at": "now()"
    }).execute()
    return {"inserted": result.data}