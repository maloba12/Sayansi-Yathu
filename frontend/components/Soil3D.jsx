import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Cylinder, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const LAYERS = [
  { name: 'Humus & Organic Matter', height: 0.3, color: '#451a03', desc: 'Top layer containing decaying plant and animal remains. Rich in nutrients.' },
  { name: 'Water & Suspended Silt', height: 1.2, color: '#3b82f6', opacity: 0.4, desc: 'Water containing fine silt particles and dissolved minerals.' },
  { name: 'Clay', height: 0.5, color: '#a8a29e', desc: 'Fine-textured layer that holds water well.' },
  { name: 'Silt', height: 0.8, color: '#78716c', desc: 'Medium-textured particles between sand and clay.' },
  { name: 'Sand', height: 1.0, color: '#d6d3d1', desc: 'Coarse particles that allow for quick drainage.' },
  { name: 'Gravel & Stones', height: 0.4, color: '#57534e', desc: 'Larger, heavier fragments that settle first at the bottom.' },
];

function Jar() {
  let currentY = -2;
  return (
    <group>
        {/* Glass Cylinder */}
        <Cylinder args={[1.05, 1.05, 4.5, 32]} openEnded>
            <meshStandardMaterial color="#fff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </Cylinder>
        <Cylinder args={[1.05, 1.05, 0.1, 32]} position={[0, -2.25, 0]}>
            <meshStandardMaterial color="#fff" transparent opacity={0.3} />
        </Cylinder>

        {/* Layers */}
        {LAYERS.reverse().map((layer, i) => {
            const h = layer.height;
            const y = currentY + h/2;
            currentY += h;
            return (
                <Cylinder key={i} args={[1, 1, h, 32]} position={[0, y, 0]}>
                    <meshStandardMaterial color={layer.color} transparent={!!layer.opacity} opacity={layer.opacity || 1} />
                </Cylinder>
            );
        })}
    </group>
  );
}

export default function Soil3D() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111827' }}>
      <Canvas camera={{ position: [4, 2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={false}>
            <Jar />
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', left: 40, top: 40, width: 340 }}>
          <h1 style={{ color: 'white', margin: '0 0 10px' }}>Soil Composition</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>Analysis of soil sedimentation and fertility layers.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LAYERS.map((l, i) => (
                  <button 
                    key={i} 
                    onMouseEnter={() => setSelected(l)}
                    onMouseLeave={() => setSelected(null)}
                    style={{ 
                        padding: '12px 15px', 
                        background: selected?.name === l.name ? l.color : 'rgba(30, 41, 59, 0.5)', 
                        color: selected?.name === l.name ? 'white' : '#94a3b8', 
                        border: 'none', 
                        borderRadius: 8, 
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        transition: '0.2s',
                        cursor: 'default'
                    }}
                  >
                      {l.name}
                  </button>
              ))}
          </div>
      </div>

      {selected && (
          <div style={{ position: 'absolute', right: 40, bottom: 40, width: 300, background: 'rgba(30, 41, 59, 0.9)', padding: 25, borderRadius: 15, border: `2px solid ${selected.color}`, color: 'white', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ margin: '0 0 10px' }}>{selected.name}</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>{selected.desc}</p>
          </div>
      )}

      <div style={{ position: 'absolute', top: 40, right: 40, color: '#475569', textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.8rem' }}>Hover over layers to see details.</p>
      </div>
    </div>
  );
}
