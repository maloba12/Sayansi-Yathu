import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

function SharpPivot({ position }) {
  return (
    <group position={position}>
      <Cylinder args={[0, 0.2, 0.4, 4]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#718096" />
      </Cylinder>
      <Box args={[0.5, 0.05, 0.5]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
    </group>
  );
}

function MeterRule({ pivotX, weightX, weightMass }) {
  const ref = useRef();
  
  // Calculate torque: T = r x F
  // Pivot is at pivotX (0 to 1m)
  // Rule weight is at 0.5m (mass 0.1kg)
  // Added weight is at weightX (0 to 1m)
  const ruleMass = 0.1;
  const g = 9.81;
  
  const torqueRule = (0.5 - pivotX) * ruleMass * g;
  const torqueWeight = (weightX - pivotX) * weightMass * g;
  const netTorque = torqueRule + torqueWeight;
  
  // Angle logic: if net torque != 0, it tilts
  const tiltAngle = THREE.MathUtils.clamp(netTorque * 5, -Math.PI / 4, Math.PI / 4);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -tiltAngle, 0.1);
    }
  });

  return (
    <group position={[0, 1, 0]}>
      <group ref={ref}>
        {/* Rule */}
        <Box args={[4, 0.1, 0.3]} position={[(0.5 - pivotX) * 4, 0, 0]}>
          <meshStandardMaterial color="#f6e05e" />
          {/* Markings */}
          {Array.from({ length: 11 }).map((_, i) => (
             <Box key={i} args={[0.01, 0.11, 0.32]} position={[-2 + i * 0.4, 0, 0]}>
                <meshStandardMaterial color="#2d3748" />
             </Box>
          ))}
        </Box>
        {/* Hanging Weight */}
        <group position={[(weightX - pivotX) * 4, -0.3, 0]}>
           <Cylinder args={[0.1, 0.14, 0.3, 32]}>
              <meshStandardMaterial color="#4a5568" metalness={0.7} />
           </Cylinder>
           <Box args={[0.01, 0.5, 0.01]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#1a202c" />
           </Box>
        </group>
      </group>
    </group>
  );
}

export default function CenterOfGravity3D() {
  const [pivotX, setPivotX] = useState(0.5); // 0 to 1
  const [weightX, setWeightX] = useState(0.8); // 0 to 1
  const [weightMass, setWeightMass] = useState(0.2); // kg

  const isBalanced = Math.abs((0.5 - pivotX) * 0.1 + (weightX - pivotX) * weightMass) < 0.01;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #f7fafc, #edf2f7)' }}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enableRotate={false} />

        <SharpPivot position={[0, 0.2, 0]} />
        <MeterRule pivotX={pivotX} weightX={weightX} weightMass={weightMass} />
        
        {/* Floor */}
        <Box args={[10, 0.1, 4]} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#e2e8f0" />
        </Box>
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 320, background: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px' }}>⚖️ Center of Gravity Lab</h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Pivot Position: { (pivotX * 100).toFixed(0) } cm</label>
          <input type="range" min="0" max="1" step="0.01" value={pivotX} onChange={(e) => setPivotX(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Weight Position: { (weightX * 100).toFixed(0) } cm</label>
          <input type="range" min="0" max="1" step="0.01" value={weightX} onChange={(e) => setWeightX(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold' }}>Hanging Mass: { weightMass.toFixed(2) } kg</label>
          <input type="range" min="0.01" max="1" step="0.01" value={weightMass} onChange={(e) => setWeightMass(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ padding: 15, background: isBalanced ? '#f0fff4' : '#fff5f5', border: isBalanced ? '1px solid #68d391' : '1px solid #fc8181', borderRadius: 8 }}>
           <p style={{ margin: 0, fontWeight: 'bold', color: isBalanced ? '#2f855a' : '#c53030' }}>
             {isBalanced ? "✅ Balanced (Net Torque ≈ 0)" : "❌ Unbalanced"}
           </p>
           <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
             Torque (Clockwise) ≈ { Math.max(0, (pivotX - weightX) * weightMass * 9.81).toFixed(2) } Nm<br/>
             Torque (Anti-clockwise) ≈ { Math.max(0, (weightX - pivotX) * weightMass * 9.81 + (0.5 - pivotX) * 0.1 * 9.81).toFixed(2) } Nm
           </p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 8, maxWidth: 350 }}>
        <h4 style={{ margin: '0 0 8px' }}>📖 Theory: Principle of Moments</h4>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          For an object to be in equilibrium, the sum of the clockwise moments about a pivot must equal the sum of the anti-clockwise moments.
          <strong> Torque (τ) = Force × Distance from pivot.</strong>
        </p>
      </div>
    </div>
  );
}
