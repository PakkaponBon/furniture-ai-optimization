from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import math

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Hello from Denso Project Backend!", "status": "Ready"}


@app.post("/calculate-wood")
def calculate_wood(
    width: float, 
    length: float, 
    height: float,
    db: Session = Depends(get_db)
):

    sheet_width = 1.2
    sheet_length = 2.4
    sheet_area = sheet_width * sheet_length # 2.88 ตร.ม. ต่อแผ่น
    
    # คำนวณพื้นที่ผิวโต๊ะ (Top + 4 Legs)
    top_area = width * length
    leg_area = (0.1 * (height - 0.05)) * 4 * 4 # พื้นที่ผิวขาโต๊ะ 4 ด้าน 4 ขา (แบบคร่าวๆ)
    
    total_used_area = top_area + leg_area
    
    # ต้องใช้ไม้กี่แผ่น?
    sheets_needed = math.ceil(total_used_area / sheet_area)
    
    # คำนวณ % การสูญเสีย
    total_sheet_area = sheets_needed * sheet_area
    waste_percent = ((total_sheet_area - total_used_area) / total_sheet_area) * 100
    yield_rate = 100 - waste_percent

    # 2. บันทึกข้อมูล
    new_order = models.Order(
        width=width, 
        length=length, 
        height=height,
        area=total_used_area, 
        volume=sheets_needed # ขอยืมช่อง volume มาเก็บ "จำนวนแผ่น" แทนชั่วคราว
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "id": new_order.id,
        "input": {"width": width, "length": length, "height": height},
        "usage": {
            "total_area": round(total_used_area, 2),
            "sheets_needed": sheets_needed,
            "waste_percent": round(waste_percent, 2),
            "yield_rate": round(yield_rate, 2)
        },
        "note": "Optimization Calculation Complete"
    }
@app.get("/orders")
def read_orders(db: Session = Depends(get_db)):
    all_orders = db.query(models.Order).all()
    return all_orders