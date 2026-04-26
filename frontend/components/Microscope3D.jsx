import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Float, Stage, Html } from '@react-three/drei';
import * as THREE from 'three';

const MICROSCOPE_PARTS = {
  eyepiece: { name: 'Eyepiece (Ocular Lens)', function: 'The lens you look through, usually 10x magnification.' },
  arm: { name: 'Arm', function: 'Supports the tube and connects it to the base.' },
  stage: { name: 'Stage', function: 'The flat platform where you place your slides.' },
  objective: { name: 'Objective Lens', function: 'The main lenses that provide various magnifications (4x, 10x, 40x).' },
  coarse: { name: 'Coarse Adjustment Knob', function: 'Moves the stage up and down for initial focusing.' },
  fine: { name: 'Fine Adjustment Knob', function: 'Moves the stage slightly to sharpen the image.' },
  base: { name: 'Base', function: 'The bottom of the microscope, used for support.' },
  light: { name: 'Light Source', function: 'Provides illumination to see the specimen.' },
};

function MicroscopeModel({ onSelect }) {
  return (
    <group>
      {/* Base */}
      <Box args={[1.5, 0.2, 2]} position={[0, -1.8, 0]} onClick={() => onSelect('base')}>
        <meshStandardMaterial color="#2d3748" />
      </Box>

      {/* Arm */}
      <group position={[-0.6, -0.8, 0]} onClick={() => onSelect('arm')}>
        <Box args={[0.3, 2, 0.4]} rotation={[0, 0, Math.PI / 8]}>
           <meshStandardMaterial color="#4a5568" />
        </Box>
      </group>

      {/* Stage */}
      <Box args={[1.2, 0.05, 1.2]} position={[0, -0.8, 0.2]} onClick={() => onSelect('stage')}>
        <meshStandardMaterial color="#1a202c" />
      </Box>

      {/* Light Source */}
      <Cylinder args={[0.2, 0.2, 0.3]} position={[0, -1.65, 0.2]} onClick={() => onSelect('light')}>
        <meshStandardMaterial color="#a0aec0" />
        <pointLight position={[0, 0.2, 0]} intensity={0.5} color="#fff" />
      </Cylinder>

      {/* Body Tube & Eyepiece */}
      <group position={[0, 0, 0]}>
        <Cylinder args={[0.2, 0.2, 1.5]} position={[0, 0.5, 0]} onClick={() => onSelect('eyepiece')}>
           <meshStandardMaterial color="#4a5568" />
        </Cylinder>
        <Cylinder args={[0.25, 0.25, 0.4]} position={[0, 1.3, 0]} onClick={() => onSelect('eyepiece')}>
           <meshStandardMaterial color="#2d3748" />
        </Cylinder>
      </group>

      {/* Objective Lenses (Revolving Nosepiece) */}
      <group position={[0, -0.2, 0]} rotation={[0, Math.PI/4, 0]}>
         <Cylinder args={[0.4, 0.4, 0.1]} onClick={() => onSelect('objective')}>
            <meshStandardMaterial color="#718096" />
         </Cylinder>
         <Cylinder args={[0.08, 0.08, 0.4]} position={[0.2, -0.2, 0.1]} rotation={[Math.PI/6, 0, 0]} onClick={() => onSelect('objective')}>
            <meshStandardMaterial color="#a0aec0" />
         </Cylinder>
         <Cylinder args={[0.08, 0.08, 0.5]} position={[-0.1, -0.3, -0.2]} rotation={[-Math.PI/8, 0, 0.2]} onClick={() => onSelect('objective')}>
            <meshStandardMaterial color="#4a5568" />
         </Cylinder>
      </group>

      {/* Knobs */}
      <Cylinder args={[0.25, 0.25, 0.1]} position={[-0.4, -1, -0.3]} rotation={[0, 0, Math.PI/2]} onClick={() => onSelect('coarse')}>
         <meshStandardMaterial color="#1a202c" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.1]} position={[-0.4, -1, -0.55]} rotation={[0, 0, Math.PI/2]} onClick={() => onSelect('fine')}>
         <meshStandardMaterial color="#2d3748" />
      </Cylinder>
    </group>
  );
}

function Viewfinder({ focus }) {
    const blur = Math.max(0, (1 - focus) * 10);
    return (
        <Html position={[2, 0.5, 0]} transform>
            <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: '8px solid #1a202c',
                overflow: 'hidden',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}>
                <div style={{
                    filter: `blur(${blur}px)`,
                    transition: 'filter 0.2s',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '40px' }}>🦠</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>E. coli specimen</div>
                </div>
            </div>
            <div style={{ color: '#fff', fontSize: '10px', textAlign: 'center', marginTop: '10px', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: '4px' }}>
                VIEWFINDER
            </div>
        </Html>
    );
}

export default function Microscope3D() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [focus, setFocus] = useState(0.2);

  const info = MICROSCOPE_PARTS[selectedPart];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0f172a' }}>
      <Canvas camera={{ position: [4, 2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="night" intensity={0.5} contactShadow={true}>
            <MicroscopeModel onSelect={setSelectedPart} />
          </Stage>
          <Viewfinder focus={focus} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={4} maxDistance={10} />
      </Canvas>

      {/* Control Panel */}
      <div style={{ position: 'absolute', left: 30, top: 30, width: 320, zIndex: 10 }}>
        <h2 style={{ color: '#63b3ed', margin: '0 0 5px' }}>Compound Microscope</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Click components to learn about them.</p>

        {selectedPart ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.9)', padding: 20, borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.1)', backdropFilter: 'blur(10px)' }}>
            <h4 style={{ color: '#63b3ed', margin: '0 0 8px' }}>{info.name}</h4>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>{info.function}</p>
          </div>
        ) : (
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: 15, borderRadius: 10, textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Click a part to see its function</p>
          </div>
        )}

        <div style={{ marginTop: '20px', background: 'rgba(30, 41, 59, 0.9)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '10px', textTransform: 'uppercase' }}>Focus Adjustment</label>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={focus} 
                onChange={(e) => setFocus(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyItems: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '10px', color: '#64748b', flex: 1 }}>Blurry</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Sharp</span>
            </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 30, right: 30, color: '#475569', fontSize: '0.8rem', textAlign: 'right' }}>
        <p style={{ margin: 0 }}>Sayansi Yathu Virtual Lab</p>
        <p style={{ margin: 0 }}>Biology Form 1 — Microscope Anatomy</p>
      </div>
    </div>
  );
}
