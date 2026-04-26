import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float, Stage, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const DEFICIENCIES = {
  healthy: {
    name: 'Healthy Plant',
    symptoms: 'Optimal growth with bright green leaves and strong stems.',
    color: '#22c55e'
  },
  nitrogen: {
    name: 'Nitrogen Deficiency',
    symptoms: 'Stunted growth and yellowish leaves (chlorosis), starting from the bottom of the plant.',
    color: '#eab308'
  },
  phosphorus: {
    name: 'Phosphorus Deficiency',
    symptoms: 'Purple or dark green leaves. Poor root development and stunted growth.',
    color: '#7e22ce'
  },
  magnesium: {
    name: 'Magnesium Deficiency',
    symptoms: 'Yellowing between the leaf veins (interveinal chlorosis), while veins remain green.',
    color: '#a3e635'
  }
};

function Plant({ type }) {
  const data = DEFICIENCIES[type];
  
  return (
    <group>
      {/* Pot */}
      <Cylinder args={[0.6, 0.4, 1]} position={[0, -1.5, 0]}>
        <meshStandardMaterial color="#78350f" />
      </Cylinder>
      {/* Soil */}
      <Cylinder args={[0.55, 0.55, 0.1]} position={[0, -1.05, 0]}>
        <meshStandardMaterial color="#451a03" />
      </Cylinder>
      
      {/* Stem */}
      <Cylinder args={[0.05, 0.05, 2.5]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#14532d" />
      </Cylinder>
      
      {/* Leaves */}
      {[ [0.3, 0, 0.3], [-0.4, 0.4, -0.2], [0.5, 0.8, -0.4], [-0.3, 1.2, 0.5] ].map((pos, i) => (
         <group key={i} position={pos} rotation={[0, i * 2, 0.5]}>
            <Box args={[1, 0.02, 0.5]}>
                <meshStandardMaterial color={data.color} />
            </Box>
         </group>
      ))}

      <Text position={[0, 2.5, 0]} fontSize={0.3} color="white">{data.name}</Text>
    </group>
  );
}

export default function NutritionalDeficiency3D() {
  const [selected, setSelected] = useState('healthy');
  const data = DEFICIENCIES[selected];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#020617' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="forest" intensity={0.5}>
            <Plant type={selected} />
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      <div style={{ position: 'absolute', right: 40, top: 40, width: 320 }}>
          <h1 style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 10px' }}>Plant Nutrition</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>Study the effects of mineral deficiencies on plant growth.</p>
          
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: 25, borderRadius: 15, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#fbbf24', marginBottom: 10 }}>Analysis</h3>
              <p style={{ color: '#e2e8f0', lineHeight: 1.6 }}>{data.symptoms}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {Object.keys(DEFICIENCIES).map(key => (
                  <button 
                    key={key} 
                    onClick={() => setSelected(key)}
                    style={{ 
                        padding: '15px', 
                        background: selected === key ? '#166534' : '#1e293b', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 8, 
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        transition: '0.2s'
                    }}
                  >
                      {DEFICIENCIES[key].name}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
}
