from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base

# สร้างตารางชื่อ "orders"
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    width = Column(Float)
    length = Column(Float)
    height = Column(Float)  # <--- 1. เพิ่มความสูง
    area = Column(Float)    # พื้นที่ (กว้าง x ยาว)
    volume = Column(Float)  # <--- 2. เพิ่มปริมาตร (กว้าง x ยาว x สูง)
    created_at = Column(DateTime, default=datetime.utcnow)