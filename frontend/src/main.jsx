import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';

// Lazy-load experiment components for code splitting
const Pendulum3D = lazy(() => import('../components/Pendulum3D_Stable.jsx'));
const FreeFall3D = lazy(() => import('../components/FreeFall3D.jsx'));
const LinearMotion3D = lazy(() => import('../components/LinearMotion3D.jsx'));
const HookesLaw3D = lazy(() => import('../components/HookesLaw3D.jsx'));
const Friction3D = lazy(() => import('../components/Friction3D.jsx'));
const Circuit3D = lazy(() => import('../components/Circuit3D.jsx'));

// Phase 3 components
const Density3D = lazy(() => import('../components/Density3D.jsx'));
const Pressure3D = lazy(() => import('../components/Pressure3D.jsx'));
const CenterOfGravity3D = lazy(() => import('../components/CenterOfGravity3D.jsx'));
const Apparatus3D = lazy(() => import('../components/Apparatus3D.jsx'));
const StatesOfMatter3D = lazy(() => import('../components/StatesOfMatter3D.jsx'));
const Separation3D = lazy(() => import('../components/Separation3D.jsx'));
const AcidsBases3D = lazy(() => import('../components/AcidsBases3D.jsx'));

// Phase 4 components
const AirCombustion3D = lazy(() => import('../components/AirCombustion3D.jsx'));
const WaterPurification3D = lazy(() => import('../components/WaterPurification3D.jsx'));
const Cell3D = lazy(() => import('../components/Cell3D.jsx'));
const DNA3D = lazy(() => import('../components/DNA3D.jsx'));

// Read experiment type from URL query parameter (?type=pendulum)
function getSimType() {
  const params = new URLSearchParams(window.location.search);
  return params.get('type') || 'pendulum';
}

// Registry of available experiment components
const EXPERIMENT_COMPONENTS = {
  pendulum: Pendulum3D,
  free_fall: FreeFall3D,
  linear_motion: LinearMotion3D,
  hookes_law: HookesLaw3D,
  friction: Friction3D,
  circuit: Circuit3D,
  density: Density3D,
  pressure: Pressure3D,
  cog: CenterOfGravity3D,
  apparatus: Apparatus3D,
  states: StatesOfMatter3D,
  separation: Separation3D,
  litmus: AcidsBases3D,
  combustion: AirCombustion3D,
  water_purify: WaterPurification3D,
  cell: Cell3D,
  dna: DNA3D,
};

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
    }}>
      <div style={{
        width: '48px', height: '48px', border: '4px solid #475569',
        borderTopColor: '#3b82f6', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading simulation...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FallbackMessage({ type }) {
  const available = Object.keys(EXPERIMENT_COMPONENTS).join(', ');
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
      <h2 style={{ margin: '0 0 0.5rem', color: '#93c5fd' }}>
        Simulation Not Yet Available
      </h2>
      <p style={{ color: '#94a3b8', maxWidth: '400px', lineHeight: 1.6 }}>
        The <strong style={{ color: '#f1f5f9' }}>{type}</strong> 3D simulation
        component is under development. Check back soon!
      </p>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '1.5rem' }}>
        Available: {available}
      </p>
    </div>
  );
}

function App() {
  const simType = getSimType();
  const ExperimentComponent = EXPERIMENT_COMPONENTS[simType];

  if (!ExperimentComponent) {
    return <FallbackMessage type={simType} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ExperimentComponent />
    </Suspense>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
