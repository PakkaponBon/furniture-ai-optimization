from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware # <--- 1. เพิ่มบรรทัดนี้
from sqlalchemy.orm import Session # <--- เพิ่ม Session
from database import SessionLocal, engine # <--- import ตัวเชื่อมต่อที่เราเพิ่งเขียน
import models # <--- import ตารางข้อมูล
import math

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# <--- 2. เพิ่มบล็อกนี้ เพื่ออนุญาตให้ Frontend (Port 3000) เข้าถึงได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # อนุญาตเฉพาะเว็บเรา
    allow_credentials=True,
    allow_methods=["*"], # อนุญาตทุกคำสั่ง (GET, POST, etc.)
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

# แก้ไขฟังก์ชันคำนวณ ให้บันทึกลง Database ด้วย
@app.post("/calculate-wood")
def calculate_wood(
    width: float, 
    length: float, 
    height: float,
    db: Session = Depends(get_db)
):
    # 1. Logic การคำนวณวัสดุจริง (Engineering Logic)
    # สมมติขนาดไม้อัดมาตรฐาน (Plywood Sheet) = 1.2m x 2.4m
    sheet_width = 1.2
    sheet_length = 2.4
    sheet_area = sheet_width * sheet_length # 2.88 ตร.ม. ต่อแผ่น
    
    # คำนวณพื้นที่ผิวโต๊ะ (Top + 4 Legs)
    top_area = width * length
    leg_area = (0.1 * (height - 0.05)) * 4 * 4 # พื้นที่ผิวขาโต๊ะ 4 ด้าน 4 ขา (แบบคร่าวๆ)
    
    total_used_area = top_area + leg_area
    
    # ต้องใช้ไม้กี่แผ่น? (ปัดเศษขึ้นเสมอ)
    sheets_needed = math.ceil(total_used_area / sheet_area)
    
    # คำนวณ % การสูญเสีย (Waste)
    total_sheet_area = sheets_needed * sheet_area
    waste_percent = ((total_sheet_area - total_used_area) / total_sheet_area) * 100

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
            "sheets_needed": sheets_needed, # ไฮไลท์สำคัญ
            "waste_percent": round(waste_percent, 2)
        },
        "note": "Optimization Calculation Complete"
    }
@app.get("/orders")
def read_orders(db: Session = Depends(get_db)):
    # สั่งให้ Database ไปดึงข้อมูลในตาราง Order มาทั้งหมด
    all_orders = db.query(models.Order).all()
    return all_orders