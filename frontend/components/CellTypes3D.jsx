import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float, Stage, Box, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

function ProkaryoticCell() {
  return (
    <group position={[-2, 0, 0]}>
      {/* Capsule */}
      <Cylinder args={[0.8, 0.8, 2, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#b91c1c" transparent opacity={0.4} />
      </Cylinder>
      {/* Cell Wall */}
      <Cylinder args={[0.7, 0.7, 2, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#dc2626" transparent opacity={0.6} />
      </Cylinder>
      {/* DNA (Circular/Nucleoid) */}
      <Torus args={[0.3, 0.05, 16, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Torus>
      {/* Flagellum */}
      <Cylinder args={[0.02, 0.02, 3]} position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#4b5563" />
      </Cylinder>
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="white">Prokaryotic</Text>
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#94a3b8">(Bacterium)</Text>
    </group>
  );
}

function EukaryoticCell() {
  return (
    <group position={[2, 0, 0]}>
      {/* Cell Membrane */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial color="#2563eb" transparent opacity={0.3} />
      </Sphere>
      {/* Nucleus */}
      <Sphere args={[0.4, 32, 32]}>
        <meshStandardMaterial color="#7c3aed" />
      </Sphere>
      {/* Mitochondria */}
      <Capsule position={[0.6, 0.4, 0.5]} rotation={[0.5, 0.5, 0]} scale={0.2} color="#ea580c" />
      <Capsule position={[-0.5, -0.6, 0.2]} rotation={[2, 1, 0]} scale={0.2} color="#ea580c" />
      
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="white">Eukaryotic</Text>
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="#94a3b8">(Animal Cell)</Text>
    </group>
  );
}

function Capsule({ position, rotation, scale, color }) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            <Cylinder args={[0.5, 0.5, 1, 32]}>
                <meshStandardMaterial color={color} />
            </Cylinder>
            <Sphere args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color={color} />
            </Sphere>
            <Sphere args={[0.5, 32, 32]} position={[0, -0.5, 0]}>
                <meshStandardMaterial color={color} />
            </Sphere>
        </group>
    );
}

export default function CellTypes3D() {
  const [highlight, setHighlight] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#020617' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ProkaryoticCell />
          <EukaryoticCell />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '80%' }}>
          <h1 style={{ color: 'white', margin: '0 0 10px', fontSize: '2rem' }}>Cell Types</h1>
          <p style={{ color: '#94a3b8' }}>Compare the core differences between Prokaryotic and Eukaryotic cells.</p>
      </div>

      <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: 20, borderRadius: 15, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#ef4444', marginBottom: 10 }}>Prokaryotic Cells</h3>
              <ul style={{ color: '#cbd5e0', fontSize: '0.9rem', paddingLeft: 20 }}>
                  <li>No true nucleus; DNA is in the nucleoid.</li>
                  <li>No membrane-bound organelles.</li>
                  <li>Smaller and simpler (e.g., Bacteria).</li>
                  <li>Contain 70S ribosomes.</li>
              </ul>
          </div>
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: 20, borderRadius: 15, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#3b82f6', marginBottom: 10 }}>Eukaryotic Cells</h3>
              <ul style={{ color: '#cbd5e0', fontSize: '0.9rem', paddingLeft: 20 }}>
                  <li>Have a distinct nucleus with a nuclear membrane.</li>
                  <li>Contain organelles (Mitochondria, Golgi, etc.).</li>
                  <li>Larger and more complex.</li>
                  <li>Found in plants, animals, fungi, and protists.</li>
              </ul>
          </div>
      </div>
    </div>
  );
}
