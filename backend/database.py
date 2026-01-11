from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. กำหนดที่อยู่ของ Database (Connection String)
# รูปแบบ: postgresql://user:password@localhost/db_name
# ถ้าคุณตั้งรหัสผ่านเป็นอย่างอื่น อย่าลืมแก้ตรงคำว่า "1234" นะครับ!
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:root@localhost/furniture_db"

# 2. สร้างเครื่องยนต์ (Engine) เพื่อใช้เชื่อมต่อ
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. สร้างโรงงานผลิต Session (SessionLocal)
# เอาไว้สร้าง "การเชื่อมต่อชั่วคราว" เวลาเราจะบันทึกหรือดึงข้อมูล
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. สร้าง Base Model
# เป็นแม่พิมพ์ให้ตารางต่างๆ สืบทอดไปใช้
Base = declarative_base()