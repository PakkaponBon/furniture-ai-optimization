"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, GridHelper } from "@react-three/drei";

interface Props {
  width: number;
  length: number;
  height: number;
}

export default function FurnitureViewer({ width, length, height }: Props) {
  const w = width > 0 ? width : 1;
  const l = length > 0 ? length : 1;
  const h = height > 0 ? height : 0.75; // ความสูงโต๊ะมาตรฐาน

  const legSize = 0.1; // ขนาดขาโต๊ะ 10cm
  const topThick = 0.05; // ความหนาท็อปโต๊ะ 5cm

  return (
    <div className="h-[400px] w-full bg-gray-900 rounded-lg overflow-hidden shadow-inner relative">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <gridHelper args={[20, 20]} position={[0, -0.01, 0]} />

        {/* --- 1. ท็อปโต๊ะ (Table Top) --- */}
        <mesh position={[0, h - topThick / 2, 0]}>
          <boxGeometry args={[w, topThick, l]} />
          <meshStandardMaterial color="#8B4513" roughness={0.5} />
        </mesh>

        {/* --- 2. ขาโต๊ะ 4 ข้าง (Legs) --- */}
        {/* คำนวณตำแหน่งขาให้อยู่มุมสุดเสมอ (Parametric Design) */}
        <GroupLegs w={w} l={l} h={h} legSize={legSize} topThick={topThick} />

        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/60 p-2 rounded">
        <strong>Mode:</strong> Furniture Parametric Design <br/>
        Display: {w} x {l} x {h} m.
      </div>
    </div>
  );
}

// แยกส่วนขาออกมาเพื่อให้โค้ดสะอาด
function GroupLegs({ w, l, h, legSize, topThick }: any) {
  const legHeight = h - topThick;
  const legY = legHeight / 2;
  const distW = w / 2 - legSize / 2;
  const distL = l / 2 - legSize / 2;

  return (
    <>
      <mesh position={[distW, legY, distL]}><boxGeometry args={[legSize, legHeight, legSize]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[-distW, legY, distL]}><boxGeometry args={[legSize, legHeight, legSize]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[distW, legY, -distL]}><boxGeometry args={[legSize, legHeight, legSize]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[-distW, legY, -distL]}><boxGeometry args={[legSize, legHeight, legSize]} /><meshStandardMaterial color="#333" /></mesh>
    </>
  );
}