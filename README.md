## AI-Driven Furniture Design & Optimization System

## Overview
โปรเจกต์นี้คือระบบเว็บแอปพลิเคชันที่ช่วยแก้ปัญหาความยุ่งยากในการออกแบบเฟอร์นิเจอร์และการคำนวณวัสดุ โดยผู้ใช้สามารถกำหนดขนาดและรูปแบบที่ต้องการ ระบบจะทำการคำนวณการตัดไม้ (Cutting Optimization) ให้คุ้มค่าที่สุดเพื่อลดเศษวัสดุเหลือทิ้ง (Waste Reduction)

ระบบถูกออกแบบให้มีระบบหลังบ้านเป็น python เพื่อรองรับการพัฒนา Ai ในอนาคต

---

## Key Features
- **Custom Furniture Design**
- **Cutting Optimization Algorithm**
- **Real-time Processing**
- **Project Management**

---

## Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

### Backend & Logic
- **Core:** [Python](https://www.python.org/)
- **API Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Data Validation:** Pydantic (จัดการ Data Type)
- **Database:** PostgreSQL

---

## System Architecture

ระบบแบ่งการทำงานออกเป็น 2 ส่วนหลัก เชื่อมต่อกันผ่าน RESTful API:

1.  **Frontend (Next.js):** รับ Input จากผู้ใช้ (ขนาด, รูปแบบ) และแสดงผล Visualization
2.  **Backend (Python FastAPI):** รับผิดชอบ Logic การคำนวณทางคณิตศาสตร์ที่ซับซ้อน (Cutting Optimization) และเตรียมรองรับ NLP สำหรับฟีเจอร์ AI Prompting

```mermaid
graph LR
  A[User Client] -- Request --> B(Next.js Frontend)
  B -- JSON Payload --> C{Python FastAPI}
  C -- Optimization Logic --> D[(PostgreSQL)]
  C -- Response --> B


