from fastapi import FastAPI
from routers import stock, pos, forecast

app = FastAPI()

app.include_router(stock.router, prefix="/stock", tags=["stock"])
app.include_router(pos.router, prefix="/pos", tags=["pos"])
app.include_router(forecast.router, prefix="/forecast", tags=["forecast"])

@app.get("/health")
def health():
    return {"status": "ok"}