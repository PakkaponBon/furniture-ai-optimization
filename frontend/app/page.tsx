"use client";

import { useState, useEffect } from "react";
import FurnitureViewer from "./components/FurnitureViewer";
import { 
  Box, 
  History, 
  LayoutDashboard, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Send,
  Bot,
  Settings2
} from "lucide-react";

interface CalculationResult {
  id: number;
  width: number;
  length: number;
  height?: number;
  area: number;
  volume?: number;
  created_at?: string;
  usage?: {
    total_area: number;
    sheets_needed: number;
    waste_percent: number;
    yield_rate: number;
  };
}

export default function Home() {
  // --- State สำหรับ AI Prompt ---
  const [prompt, setPrompt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- State สำหรับเก็บค่าที่ AI สกัดมาได้ (เอาไว้ส่งให้ 3D และ Backend) ---
  const [width, setWidth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(false);

  // ดึงประวัติการคำนวณ
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders");
      const data = await res.json();
      setHistory(data.reverse());
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 🧠 ฟังก์ชันจำลอง LLM (รอนำ API ของจริงมาเสียบแทนตรงนี้)
  const analyzePromptWithAI = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);

    try {
      // จำลองเวลาที่ LLM ประมวลผล (1.5 วินาที)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // --- Mockup NLP Extraction Logic ---
      // สมมติว่า AI คืนค่า JSON กลับมา (ในอนาคตเปลี่ยนเป็นเรียก API AI ของคุณ)
      let extractedJSON = { type: "table", w: 1.2, l: 0.6, h: 0.75 }; // Default

      // ดักจับ Keyword ง่ายๆ เพื่อจำลองว่า AI ทำงาน (เช่น พิมพ์ "1.5 เมตร")
      if (prompt.includes("1.5")) extractedJSON.w = 1.5;
      if (prompt.includes("2")) extractedJSON.w = 2.0;
      if (prompt.includes("เก้าอี้")) {
        extractedJSON.type = "chair";
        extractedJSON.w = 0.45;
        extractedJSON.l = 0.45;
        extractedJSON.h = 0.9;
      }

      // 1. อัปเดต State ให้ 3D เปลี่ยนรูปร่างทันที
      setWidth(extractedJSON.w);
      setLength(extractedJSON.l);
      setHeight(extractedJSON.h);

      // 2. ส่งค่าที่ AI แยกได้ ไปให้ Backend คำนวณตัดไม้ต่อทันที
      await calculateWood(extractedJSON.w, extractedJSON.l, extractedJSON.h);

    } catch (error) {
      console.error("AI Analysis Error:", error);
      alert("AI ไม่สามารถวิเคราะห์ข้อความได้");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🧮 ฟังก์ชันส่งข้อมูลไปคำนวณไม้ (Backend)
  const calculateWood = async (w: number, l: number, h: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calculate-wood?width=${w}&length=${l}&height=${h}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      
      setResult(data);
      fetchHistory();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar (คงเดิม) */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI-Driven Furniture Design System
            </h1>
            <p className="text-xs text-slate-500">Natural Language to 3D & Cut Plan</p>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- Left Column: AI Input & Results --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 🤖 1. AI Chat Input Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                <Bot size={20} className="text-blue-600" />
                <h2 className="font-semibold text-blue-900">สั่งงานออกแบบด้วย AI</h2>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="พิมพ์สั่งงาน เช่น 'อยากได้โต๊ะทำงานขนาด 1.5 เมตร'..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                    rows={4}
                  />
                  <MessageSquare size={16} className="absolute right-3 top-3 text-slate-300" />
                </div>

                <button
                  onClick={analyzePromptWithAI}
                  disabled={isAnalyzing || !prompt.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2 animate-pulse">
                      <Bot size={20} /> AI กำลังวิเคราะห์...
                    </span>
                  ) : (
                    <>
                      <Send size={18} /> สั่งเจนโมเดล 3D และแบบตัด
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ⚙️ 2. Parameter Adjustment (ปรับแต่งขนาดหลัง AI เจนเสร็จ) */}
            {(width > 0 || isAnalyzing) && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-fade-in-up">
                 <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Settings2 size={18} className="text-indigo-500" />
                      <h3 className="text-sm font-bold">ปรับแต่งขนาด (Fine-Tuning)</h3>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full border border-indigo-100">
                      Parametric 3D
                    </span>
                 </div>

                 {isAnalyzing ? (
                    <div className="h-24 bg-slate-100 rounded animate-pulse"></div>
                 ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {/* ช่องปรับ กว้าง */}
                        <div>
                          <label className="text-xs text-slate-500 mb-1.5 block font-medium">กว้าง (m)</label>
                          <input 
                            type="number" 
                            step="0.1" // ให้กดเพิ่มลดทีละ 10 ซม.
                            value={width} 
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-center font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                        {/* ช่องปรับ ยาว */}
                        <div>
                          <label className="text-xs text-slate-500 mb-1.5 block font-medium">ยาว (m)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={length} 
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-center font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                        {/* ช่องปรับ สูง */}
                        <div>
                          <label className="text-xs text-slate-500 mb-1.5 block font-medium">สูง (m)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={height} 
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-center font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* ปุ่มคำนวณวัสดุใหม่ หลังจาก User หมุนปรับขนาด */}
                      <button 
                        onClick={() => calculateWood(width, length, height)}
                        disabled={loading}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? "กำลังอัปเดตข้อมูล..." : "🔄 อัปเดตการคำนวณวัสดุ (Recalculate)"}
                      </button>
                    </div>
                 )}
              </div>
            )}

            {/* 📊 3. Result Card (ซ่อนไว้จนกว่าจะคำนวณเสร็จ) */}
            {result && result.usage && !isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden animate-fade-in-up">
                 <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <h2 className="font-semibold text-emerald-800">ผลการคำนวณวัสดุ</h2>
                 </div>
                <div className="p-6">
                 {/* โค้ดแสดงผล Yield, Waste, จำนวนแผ่น (เหมือนเดิม) */}
                 <div className="bg-slate-900 rounded-lg p-4 text-center text-white">
                    <p className="text-sm text-slate-400 mb-1">ไม้ที่ต้องใช้ (Plywood Sheets)</p>
                    <p className="text-3xl font-bold text-emerald-400">{result.usage.sheets_needed} <span className="text-lg font-normal text-white">แผ่น</span></p>
                 </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Right Column: Visualization --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3D Viewer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
               <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Box size={18} className="text-indigo-600" />
                   <h2 className="font-semibold text-slate-700">แบบจำลอง 3 มิติ</h2>
                </div>
              </div>
              <div className="p-1 bg-slate-100">
                 {isAnalyzing ? (
                   <div className="h-[400px] flex items-center justify-center bg-slate-900 rounded-lg">
                      <p className="text-white animate-pulse">กำลังประมวลผลโมเดล 3D...</p>
                   </div>
                 ) : (
                   <FurnitureViewer width={width} length={length} height={height} />
                 )}
              </div>
            </div>

            {/* History Table (คงเดิม) ... */}
            
          </div>
        </div>
      </main>
    </div>
  );
}