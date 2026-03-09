import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const MODES = {
  filtration: { label: 'Filtration', description: 'Separates insoluble solids (sand) from liquids (water).' },
  evaporation: { label: 'Evaporation', description: 'Obtains soluble solids (salt) from solution by heating.' },
};

function Beaker({ position, fluidLevel = 0, fluidColor = "#3182ce", opacity = 0.5 }) {
  return (
    <group position={position}>
      <Cylinder args={[0.5, 0.5, 1.2, 32]} openEnded>
        <meshStandardMaterial color="#fff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Cylinder>
      {fluidLevel > 0 && (
        <Cylinder args={[0.48, 0.48, 1.2 * fluidLevel, 32]} position={[0, -0.6 + (0.6 * fluidLevel), 0]}>
          <meshStandardMaterial color={fluidColor} transparent opacity={opacity} />
        </Cylinder>
      )}
    </group>
  );
}

function Funnel({ position }) {
  return (
    <group position={position}>
      <Cylinder args={[0.5, 0.1, 0.6, 32]} openEnded position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.4, 32]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.3} />
      </Cylinder>
      {/* Filter Paper */}
      <Cylinder args={[0.45, 0.05, 0.4, 32]} openEnded position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#fff" side={THREE.DoubleSide} />
      </Cylinder>
    </group>
  );
}

function BunsenBurner({ position, isOn }) {
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.05, 0.6, 16]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#718096" />
      </Cylinder>
      <Cylinder args={[0.2, 0.25, 0.1, 16]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Cylinder>
      {isOn && (
        <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Sphere args={[0.08, 16, 16]} position={[0, 0.7, 0]}>
            <meshBasicMaterial color="#3182ce" transparent opacity={0.6} />
          </Sphere>
        </Float>
      )}
    </group>
  );
}

export default function Separation3D() {
  const [mode, setMode] = useState('filtration');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useFrame((state, delta) => {
    if (isProcessing && progress < 1) {
      setProgress(p => Math.min(1, p + delta * 0.1));
    }
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #f7fafc, #edf2f7)' }}>
      <Canvas camera={{ position: [4, 3, 5], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <OrbitControls enablePan={false} />

        {/* Lab Bench */}
        <Box args={[10, 0.2, 6]} position={[0, -0.1, 0]} receiveShadow>
          <meshStandardMaterial color="#cbd5e0" />
        </Box>

        {mode === 'filtration' && (
          <group>
            {/* Top Beaker (Mixture: Sand + Water) */}
            <group position={[0, 2.5, 0]} rotation={[0, 0, progress > 0 ? -Math.PI / 4 : 0]}>
              <Beaker position={[0, 0, 0]} fluidLevel={1 - progress} fluidColor="#a0aec0" />
              {/* Sand dots */}
              {Array.from({ length: 10 }).map((_, i) => (
                <Sphere key={i} args={[0.03, 8, 8]} position={[(Math.random() - 0.5) * 0.6, -0.5 + Math.random() * (1 - progress), (Math.random() - 0.5) * 0.6]}>
                  <meshStandardMaterial color="#744210" />
                </Sphere>
              ))}
            </group>

            <Funnel position={[0, 1.2, 0]} />

            {/* Bottom Beaker (Filtrate: Clear Water) */}
            <Beaker position={[0, 0.6, 0]} fluidLevel={progress} fluidColor="#3182ce" />
            
            {/* Residue (Sand) on filter paper */}
            {progress > 0.5 && (
              <group position={[0, 1.5, 0]}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <Sphere key={i} args={[0.03, 8, 8]} position={[(Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4]}>
                    <meshStandardMaterial color="#744210" />
                  </Sphere>
                ))}
              </group>
            )}
            
            <Text position={[1.5, 1.8, 0]} fontSize={0.2} color="#2d3748">Residue (Sand)</Text>
            <Text position={[1.5, 0.5, 0]} fontSize={0.2} color="#2d3748">Filtrate (Water)</Text>
          </group>
        )}

        {mode === 'evaporation' && (
          <group>
            <BunsenBurner position={[0, 0, 0]} isOn={isProcessing} />
            <Box args={[1, 0.05, 1]} position={[0, 0.65, 0]}>
               <meshStandardMaterial color="#4a5568" />
            </Box>
            
            <group position={[0, 0.8, 0]}>
               {/* Evaporating Dish */}
               <Sphere args={[0.5, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} rotation={[Math.PI, 0, 0]}>
                  <meshStandardMaterial color="#fff" side={THREE.DoubleSide} />
               </Sphere>
               {/* Salt Solution / Remaining Salt */}
               {progress < 0.9 ? (
                 <Cylinder args={[0.4, 0.4, 0.1, 32]} position={[0, -0.1, 0]}>
                    <meshStandardMaterial color="#bee3f8" transparent opacity={0.6 * (1 - progress)} />
                 </Cylinder>
               ) : (
                 <group position={[0, -0.1, 0]}>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <Box key={i} args={[0.05, 0.05, 0.05]} position={[(Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6]}>
                        <meshStandardMaterial color="#fff" />
                      </Box>
                    ))}
                 </group>
               )}
               
               {/* Steam particles */}
               {isProcessing && progress < 0.9 && (
                 <Float speed={10} rotationIntensity={0} floatIntensity={2}>
                    <Sphere args={[0.02, 8, 8]} position={[(Math.random() - 0.5) * 0.4, 0.5, (Math.random() - 0.5) * 0.4]}>
                       <meshBasicMaterial color="#fff" transparent opacity={0.3} />
                    </Sphere>
                 </Float>
               )}
            </group>
            
            <Text position={[1.5, 1.2, 0]} fontSize={0.2} color="#2d3748">
              {progress > 0.9 ? "Salt Crystals" : "Salt Solution"}
            </Text>
          </group>
        )}
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 320, background: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px' }}>🧪 Separation Lab</h3>
        
        <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
           {Object.entries(MODES).map(([key, cfg]) => (
             <button key={key} onClick={() => {setMode(key); setProgress(0); setIsProcessing(false);}} 
               style={{ flex: 1, padding: 8, background: mode === key ? '#3182ce' : '#fff', color: mode === key ? '#fff' : '#2d3748', border: '1px solid #3182ce', borderRadius: 4, cursor: 'pointer' }}>
               {cfg.label}
             </button>
           ))}
        </div>

        <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: 20 }}>{MODES[mode].description}</p>
        
        <button onClick={() => setIsProcessing(!isProcessing)} 
          style={{ width: '100%', padding: 12, background: isProcessing ? '#e53e3e' : '#38a169', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
          {isProcessing ? 'PAUSE' : (progress > 0 ? 'RESUME' : 'START EXPERIMENT')}
        </button>

        <button onClick={() => {setProgress(0); setIsProcessing(false);}} 
          style={{ width: '100%', padding: 12, background: '#edf2f7', color: '#2d3748', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 10 }}>
          RESET
        </button>

        <div style={{ marginTop: 20 }}>
           <label style={{ fontSize: '0.8rem', color: '#718096' }}>Progress: {(progress * 100).toFixed(0)}%</label>
           <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, marginTop: 4 }}>
              <div style={{ width: `${progress * 100}%`, height: '100%', background: '#3182ce', borderRadius: 4, transition: 'width 0.2s' }} />
           </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 8, maxWidth: 350 }}>
        <h4 style={{ margin: '0 0 8px' }}>📖 Theory</h4>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          {mode === 'filtration' 
            ? "Filtration works because sand particles are too large to pass through the tiny pores of the filter paper, while water molecules pass through easily." 
            : "Evaporation uses heat to turn the liquid solvent (water) into vapor, leaving behind the solid solute (salt) which has a much higher boiling point."}
        </p>
      </div>
    </div>
  );
}
