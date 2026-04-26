import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, FlaskConical } from 'lucide-react';

const SUBJECT_DATA = [
  { name: 'Physics', score: 60, experiments: 5, total: 8, color: '#8b5cf6', mastery: [
    { topic: 'Pendulum Motion', level: 90 },
    { topic: 'Forces & Motion', level: 72 },
    { topic: 'Pressure & Density', level: 38 },
    { topic: 'Simple Machines', level: 45 },
  ]},
  { name: 'Chemistry', score: 35, experiments: 3, total: 7, color: '#f59e0b', mastery: [
    { topic: 'Lab Safety', level: 95 },
    { topic: 'States of Matter', level: 60 },
    { topic: 'Acids & Bases', level: 28 },
    { topic: 'Separation Techniques', level: 42 },
  ]},
  { name: 'Biology', score: 85, experiments: 7, total: 9, color: '#10b981', mastery: [
    { topic: 'Living Things', level: 94 },
    { topic: 'Cell Structure', level: 88 },
    { topic: 'Ecosystems', level: 75 },
    { topic: 'Tropisms', level: 80 },
  ]},
];

function MasteryBar({ topic, level }) {
  const isWeak = level < 50;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600 flex items-center">
          {isWeak && <AlertTriangle className="w-3 h-3 text-amber-500 mr-1" />}
          {topic}
        </span>
        <span className={`text-xs font-bold ${isWeak ? 'text-amber-600' : 'text-gray-600'}`}>{level}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${level}%`,
            background: isWeak ? '#f59e0b' : level >= 80 ? '#10b981' : '#3b82f6'
          }}
        />
      </div>
    </div>
  );
}

function SubjectProgress({ subject }) {
  const weakAreas = subject.mastery.filter(m => m.level < 50);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{subject.name}</h3>
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-xs text-gray-500">
            <FlaskConical className="w-3 h-3 mr-1" />
            {subject.experiments}/{subject.total} labs
          </span>
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: `conic-gradient(${subject.color} ${subject.score * 3.6}deg, #e5e7eb 0deg)` }}
          >
            <span className="text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{subject.score}%</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        {subject.mastery.map(m => <MasteryBar key={m.topic} topic={m.topic} level={m.level} />)}
      </div>
      {weakAreas.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Needs Attention:</p>
          <p className="text-xs text-amber-800">{weakAreas.map(w => w.topic).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default function ProgressTracker() {
  const overallAvg = Math.round(SUBJECT_DATA.reduce((s, d) => s + d.score, 0) / SUBJECT_DATA.length);
  const totalLabs = SUBJECT_DATA.reduce((s, d) => s + d.experiments, 0);
  const totalPossibleLabs = SUBJECT_DATA.reduce((s, d) => s + d.total, 0);
  const allWeakAreas = SUBJECT_DATA.flatMap(s =>
    s.mastery.filter(m => m.level < 50).map(m => ({ ...m, subject: s.name }))
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📈 Progress Tracker</h1>
        <p className="text-gray-500 mt-1">Your complete academic performance overview.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-vibrant to-primary-blue text-white rounded-2xl p-6 shadow-vibrant">
          <p className="text-sm text-white/80 font-medium">Overall Average</p>
          <p className="text-5xl font-black mt-2">{overallAvg}%</p>
          <p className="text-sm text-white/70 mt-2">Across all subjects</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 font-medium">Labs Completed</p>
          <p className="text-4xl font-black text-gray-900 mt-2">{totalLabs}<span className="text-gray-400 text-2xl">/{totalPossibleLabs}</span></p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(totalLabs / totalPossibleLabs) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
          <p className="text-sm text-amber-600 font-medium flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" /> Weak Areas
          </p>
          <p className="text-4xl font-black text-amber-600 mt-2">{allWeakAreas.length}</p>
          <p className="text-sm text-gray-500 mt-2">Topics below 50%</p>
        </div>
      </div>

      {/* Weak Areas Summary */}
      {allWeakAreas.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" /> Priority Study Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allWeakAreas.map(area => (
              <div key={`${area.subject}-${area.topic}`} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{area.topic}</p>
                  <p className="text-xs text-gray-500">{area.subject}</p>
                </div>
                <span className="text-sm font-bold text-amber-600">{area.level}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SUBJECT_DATA.map(s => <SubjectProgress key={s.name} subject={s} />)}
      </div>
    </div>
  );
}
