import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

function Candle({ position, isLit, burningProgress }) {
  const flameRef = useRef();
  
  useFrame((state) => {
    if (flameRef.current && isLit) {
      flameRef.current.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 10) * 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <Cylinder args={[0.1, 0.1, 0.6 - (burningProgress * 0.2), 32]} position={[0, (0.6 - (burningProgress * 0.2))/2, 0]}>
        <meshStandardMaterial color="#fff" />
      </Cylinder>
      {/* Wick */}
      <Cylinder args={[0.01, 0.01, 0.1, 16]} position={[0, 0.6 - (burningProgress * 0.2) + 0.05, 0]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      {/* Flame */}
      {isLit && (
        <group position={[0, 0.6 - (burningProgress * 0.2) + 0.15, 0]}>
          <Sphere ref={flameRef} args={[0.08, 16, 16]}>
            <meshBasicMaterial color="#ffcc33" transparent opacity={0.8} />
          </Sphere>
          <pointLight intensity={1} color="#ff9900" distance={2} />
        </group>
      )}
    </group>
  );
}

function WaterTrough({ width, depth, waterLevel }) {
  return (
    <group>
      {/* Trough Walls (Transparent Glass) */}
      <Box args={[width, 0.5, depth]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Box>
      {/* Water */}
      <Box args={[width - 0.05, 0.5 * waterLevel, depth - 0.05]} position={[0, (0.5 * waterLevel) / 2, 0]}>
        <meshStandardMaterial color="#3182ce" transparent opacity={0.4} />
      </Box>
    </group>
  );
}

function GasJar({ position, isDown, height, internalWaterLevel }) {
  return (
    <group position={position}>
      {/* Outer Glass */}
      <Cylinder args={[0.4, 0.4, height, 32, 1, true]} position={[0, height/2 + (isDown ? 0 : 1), 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </Cylinder>
      {/* Internal Water Level */}
      {isDown && (
        <Cylinder args={[0.39, 0.39, internalWaterLevel * height, 32]} position={[0, (internalWaterLevel * height)/2, 0]}>
          <meshStandardMaterial color="#3182ce" transparent opacity={0.5} />
        </Cylinder>
      )}
      {/* Top Cap */}
      <Cylinder args={[0.4, 0.4, 0.05, 32]} position={[0, height + (isDown ? 0 : 1), 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.3} />
      </Cylinder>
      
      {/* Scale Markings */}
      {isDown && Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} position={[0.45, (i + 1) * (height / 5), 0]} fontSize={0.1} color="#2d3748">
          {(i + 1) * 20}%
        </Text>
      ))}
    </group>
  );
}

function SimulationState({ isLit, jarDown, progress, setProgress, setOxygenConsumed, setIsLit }) {
  useFrame((state, delta) => {
    if (isLit && jarDown && progress < 1) {
      const nextProgress = Math.min(1, progress + delta * 0.2);
      setProgress(nextProgress);
      // Water level rises up to ~21%
      setOxygenConsumed(nextProgress * 0.21);
      if (nextProgress >= 0.95) {
        setIsLit(false); // Flame goes out
      }
    }
  });
  return null;
}

export default function AirCombustion3D() {
  const [isLit, setIsLit] = useState(false);
  const [jarDown, setJarDown] = useState(false);
  const [oxygenConsumed, setOxygenConsumed] = useState(0); // 0 to 1
  const [progress, setProgress] = useState(0);

  const reset = () => {
    setIsLit(false);
    setJarDown(false);
    setOxygenConsumed(0);
    setProgress(0);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#f7fafc' }}>
      <Canvas camera={{ position: [2, 2, 4], fov: 45 }} shadows>
        <SimulationState 
          isLit={isLit} 
          jarDown={jarDown} 
          progress={progress} 
          setProgress={setProgress} 
          setOxygenConsumed={setOxygenConsumed} 
          setIsLit={setIsLit} 
        />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 10, 5]} intensity={1} castShadow />
        <OrbitControls enablePan={false} />

        {/* Lab Support */}
        <Box args={[10, 0.1, 6]} position={[0, -0.05, 0]}>
           <meshStandardMaterial color="#cbd5e0" />
        </Box>

        <WaterTrough width={3} depth={2} waterLevel={1} />
        <Candle position={[0, 0.1, 0]} isLit={isLit} burningProgress={progress} />
        <GasJar position={[0, 0.1, 0]} isDown={jarDown} height={2} internalWaterLevel={oxygenConsumed} />
        
        {/* Helper arrow or indicator */}
        {!isLit && !jarDown && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text position={[0, 1.5, 0]} fontSize={0.2} color="#3182ce">1. Light Candle</Text>
          </Float>
        )}
        {isLit && !jarDown && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text position={[0, 1.5, 0]} fontSize={0.2} color="#3182ce">2. Cover with Jar</Text>
          </Float>
        )}
      </Canvas>

      <div style={{ position: 'absolute', left: 20, top: 20, width: 320, background: 'rgba(255,255,255,0.95)', padding: 25, borderRadius: 15, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 10px', color: '#2d3748' }}>Air & Combustion</h2>
        <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: 20 }}>Demonstrating that air contains ~21% Oxygen which is needed for burning.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => setIsLit(true)} disabled={isLit || progress > 0} 
            style={{ padding: '12px', background: isLit ? '#cbd5e0' : '#f6ad55', color: '#fff', border: 'none', borderRadius: 8, cursor: isLit ? 'default' : 'pointer', fontWeight: 'bold' }}>
            LIGHT CANDLE
          </button>
          
          <button onClick={() => setJarDown(true)} disabled={!isLit || jarDown}
            style={{ padding: '12px', background: !isLit || jarDown ? '#cbd5e0' : '#4a5568', color: '#fff', border: 'none', borderRadius: 8, cursor: (!isLit || jarDown) ? 'default' : 'pointer', fontWeight: 'bold' }}>
            COVER WITH JAR
          </button>
          
          <button onClick={reset} style={{ padding: '12px', background: '#edf2f7', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#4a5568' }}>
            RESET EXPERIMENT
          </button>
        </div>

        {progress > 0 && (
          <div style={{ marginTop: 20, padding: 15, background: '#f0f4f8', borderRadius: 10 }}>
             <h4 style={{ margin: '0 0 8px', color: '#2c5282' }}>Observation:</h4>
             {isLit ? (
               <p style={{ margin: 0, fontSize: '0.9rem' }}>The candle is burning. As oxygen is used up, the water level rises to fill the space.</p>
             ) : (
               <p style={{ margin: 0, fontSize: '0.9rem' }}>The flame went out because all the **Oxygen** was consumed. Water rose to fill exactly ~21% of the jar.</p>
             )}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, maxWidth: 350, background: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 10, fontSize: '0.85rem' }}>
        <strong>Science Fact:</strong> Combustion is a chemical reaction between a fuel and an oxidant (Oxygen). When the oxygen in the trapped air is finished, the chemical reaction stops.
      </div>
    </div>
  );
}
