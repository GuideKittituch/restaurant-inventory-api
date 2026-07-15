from fastapi import APIRouter
from pydantic import BaseModel
from db import supabase

router = APIRouter()

class POSTransactionInput(BaseModel):
    pos_order_id: str
    menu_item_code: str
    qty: float
    transaction_time: str

@router.post("/transaction")
def ingest_pos_transaction(payload: POSTransactionInput):
    menu_item = supabase.table("menu_items").select("id").eq(
        "pos_item_code", payload.menu_item_code
    ).execute()
    if not menu_item.data:
        return {"error": "menu_item_code ไม่พบ ต้องเพิ่มใน menu_items ก่อน"}

    result = supabase.table("pos_transactions").insert({
        "pos_order_id": payload.pos_order_id,
        "menu_item_id": menu_item.data[0]["id"],
        "qty": payload.qty,
        "transaction_time": payload.transaction_time,
        "source": "manual"
    }).execute()
    return {"inserted": result.data}