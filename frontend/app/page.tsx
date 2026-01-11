"use client";

import { useState, useEffect } from "react";
import FurnitureViewer from "./components/FurnitureViewer";
import { 
  Box, 
  Ruler, 
  Calculator, 
  History, 
  LayoutDashboard, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react"; // ไอคอนสวยๆ

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
  };
}

export default function Home() {
  const [width, setWidth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders");
      const data = await res.json();
      setHistory(data.reverse()); // โชว์อันใหม่สุดขึ้นก่อน
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calculate-wood?width=${width}&length=${length}&height=${height}`,
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
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* --- Navbar --- */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Furniture OS</h1>
            <p className="text-xs text-slate-500">Smart Cutting Plan Optimization</p>
          </div>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          v1.0.0 (Demo Build)
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- Left Column: Controls (4 Columns) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Input Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Box size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-700">กำหนดขนาด (Dimensions)</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">ความกว้าง (Width)</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="0.00"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                    />
                    <Ruler size={16} className="absolute left-3 top-3 text-slate-400" />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">เมตร</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">ความยาว (Length)</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="0.00"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                    />
                    <Ruler size={16} className="absolute left-3 top-3 text-slate-400" />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">เมตร</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">ความสูง (Height)</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="0.00"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                    <Box size={16} className="absolute left-3 top-3 text-slate-400" />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">เมตร</span>
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "กำลังประมวลผล..."
                  ) : (
                    <>
                      <Calculator size={20} /> คำนวณวัสดุ (Optimize)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Card */}
            {result && result.usage && (
              <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden animate-fade-in-up">
                <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <h2 className="font-semibold text-emerald-800">ผลการวิเคราะห์ (Analysis)</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">พื้นที่ผิวรวม</p>
                      <p className="text-lg font-bold text-slate-800">{result.usage.total_area} <span className="text-xs font-normal text-slate-400">ตร.ม.</span></p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs text-red-500 mb-1">ของเสีย (Waste)</p>
                      <p className="text-lg font-bold text-red-600">{result.usage.waste_percent}%</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4 text-center text-white">
                    <p className="text-sm text-slate-400 mb-1">ต้องใช้ไม้อัด (1.2 x 2.4m)</p>
                    <p className="text-3xl font-bold text-emerald-400">{result.usage.sheets_needed} <span className="text-lg font-normal text-white">แผ่น</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- Right Column: Visualization (8 Columns) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3D Viewer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
               <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Box size={18} className="text-indigo-600" />
                   <h2 className="font-semibold text-slate-700">แบบจำลอง 3 มิติ (Simulation)</h2>
                </div>
                <div className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                  Interactive View
                </div>
              </div>
              <div className="p-1 bg-slate-100">
                 {/* ส่งค่าไปให้ Component 3D */}
                 <FurnitureViewer width={width} length={length} height={height} />
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <History size={18} className="text-slate-500" />
                <h2 className="font-semibold text-slate-700">ประวัติการคำนวณ (Recent Logs)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">ขนาด (กxยxส)</th>
                      <th className="px-6 py-3">พื้นที่ผิว</th>
                      <th className="px-6 py-3 text-center">จำนวนแผ่น</th>
                      <th className="px-6 py-3 text-right">เวลา</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.length > 0 ? (
                      history.slice(0, 5).map((item) => ( // โชว์แค่ 5 อันล่าสุด
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-mono text-slate-400">#{item.id}</td>
                          <td className="px-6 py-3 font-medium text-slate-700">
                            {item.width} x {item.length} x {item.height || '-'}
                          </td>
                          <td className="px-6 py-3">{item.area.toFixed(2)}</td>
                          <td className="px-6 py-3 text-center">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                              {/* เช็คก่อนว่ามี volume หรือ usage.sheets_needed ไหม เพื่อความชัวร์ */}
                              {item.usage?.sheets_needed || item.volume || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right text-slate-400">
                            {item.created_at ? new Date(item.created_at).toLocaleTimeString('th-TH') : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                          <AlertCircle size={24} className="opacity-20" />
                          ยังไม่มีข้อมูลประวัติ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}