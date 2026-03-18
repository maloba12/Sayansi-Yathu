import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Text, Html } from '@react-three/drei';
import ExperimentShell from './ExperimentShell';

const STEPS = [
  { id: 'aim', label: 'Aim', color: '#3b82f6' },
  { id: 'hypo', label: 'Hypothesis', color: '#8b5cf6' },
  { id: 'method', label: 'Method', color: '#f59e0b' },
  { id: 'result', label: 'Result', color: '#10b981' },
  { id: 'conc', label: 'Conclusion', color: '#ef4444' },
];

const CORRECT_ORDER = ['aim', 'hypo', 'method', 'result', 'conc'];

function DraggableBlock({ step, index, position, onDrop, currentStepIndex }) {
  const isSelected = currentStepIndex === index;
  
  return (
    <group position={position}>
      <Box 
        args={[3, 0.8, 0.1]} 
        onClick={() => onDrop(step.id)}
        style={{ cursor: 'pointer' }}
      >
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : step.color} 
          emissive={isSelected ? '#1d4ed8' : '#000000'}
          emissiveIntensity={0.5}
        />
      </Box>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {step.label}
      </Text>
    </group>
  );
}

export default function ScientificMethod3D() {
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [status, setStatus] = useState('Arrange the steps in the correct scientific sequence.');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Shuffle steps for the student to arrange
    const shuffled = [...STEPS].sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
  }, []);

  const handleStepClick = (id) => {
    if (isComplete) return;

    if (userOrder.includes(id)) {
      setUserOrder(prev => prev.filter(item => item !== id));
      return;
    }

    const nextIndex = userOrder.length;
    if (id === CORRECT_ORDER[nextIndex]) {
      const newOrder = [...userOrder, id];
      setUserOrder(newOrder);
      if (newOrder.length === CORRECT_ORDER.length) {
        setIsComplete(true);
        setStatus('✅ Correct! You have followed the Scientific Investigation Workflow.');
      } else {
        setStatus(`Good! What comes after ${STEPS.find(s => s.id === id).label}?`);
      }
    } else {
      setStatus(`❌ Incorrect. ${STEPS.find(s => s.id === id).label} doesn't go there. Try again.`);
    }
  };

  const reset = () => {
    setUserOrder([]);
    setIsComplete(false);
    setShuffledSteps([...STEPS].sort(() => Math.random() - 0.5));
    setStatus('Arrange the steps in the correct scientific sequence.');
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '10px' }}>
        Click the blocks on the desk to place them on the whiteboard in the correct order.
      </p>
      
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6', minHeight: '60px' }}>
        <strong>Message:</strong> {status}
      </div>

      <button 
        onClick={reset}
        style={{ padding: '10px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        🔄 Reset Blocks
      </button>

      <div style={{ marginTop: '10px' }}>
        <h4 style={{ marginBottom: '8px' }}>Objective Checklist:</h4>
        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem' }}>
          {CORRECT_ORDER.map((id, i) => (
            <li key={id} style={{ color: userOrder.includes(id) ? '#22c55e' : '#64748b', fontWeight: userOrder.includes(id) ? 'bold' : 'normal' }}>
              {STEPS.find(s => s.id === id).label} {userOrder.includes(id) ? '✓' : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const theory = {
    formula: "Systematic Inquiry Workflow",
    values: [
      { label: "Steps Completed", value: `${userOrder.length} / 5` },
      { label: "Current Task", value: isComplete ? "Verification" : "Sequencing" }
    ]
  };

  return (
    <ExperimentShell title="Scientific Investigation Workflow" controls={controls} theory={theory}>
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Floor */}
        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} args={[30, 30]}>
          <meshStandardMaterial color="#f1f5f9" />
        </Plane>

        {/* Whiteboard */}
        <Box position={[0, 2, -1]} args={[8, 10, 0.2]}>
          <meshStandardMaterial color="white" />
        </Box>
        <Box position={[0, 2, -1.1]} args={[8.5, 10.5, 0.1]}>
          <meshStandardMaterial color="#475569" />
        </Box>
        <Text position={[0, 6.5, -0.8]} fontSize={0.5} color="#1e293b" fontWeight="bold">
          SCIENTIFIC METHOD
        </Text>

        {/* Placed Blocks on Whiteboard */}
        {userOrder.map((id, index) => {
          const step = STEPS.find(s => s.id === id);
          return (
            <group key={`board-${id}`} position={[0, 5 - index * 1.5, -0.8]}>
              <Box args={[4, 1, 0.1]}>
                <meshStandardMaterial color="#22c55e" />
              </Box>
              <Text position={[0, 0, 0.1]} fontSize={0.4} color="white">
                {step.label}
              </Text>
              {index < userOrder.length - 1 && (
                <Text position={[0, -0.75, 0.1]} fontSize={0.3} color="#475569">
                  ↓
                </Text>
              )}
            </group>
          );
        })}

        {/* Desk / Interaction Area */}
        <Box position={[0, -3.5, 5]} args={[12, 1, 6]}>
          <meshStandardMaterial color="#94a3b8" />
        </Box>

        {/* Blocks to Select */}
        <group position={[0, -2.8, 5]}>
          {shuffledSteps.map((step, index) => (
            <DraggableBlock 
              key={`desk-${step.id}`}
              step={step}
              index={index}
              position={[((index % 3) - 1) * 3.5, 0, Math.floor(index / 3) * 1.5]}
              onDrop={handleStepClick}
              currentStepIndex={userOrder.includes(step.id) ? -1 : 0}
            />
          ))}
        </group>

        <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
      </Canvas>
    </ExperimentShell>
  );
}
