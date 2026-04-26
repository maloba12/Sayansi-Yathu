import React, { useState } from 'react';
import { FlaskConical, CheckCircle, Star, Calendar, ChevronDown } from 'lucide-react';

const EXPERIMENT_HISTORY = [
  { id: 1, title: 'Pendulum Motion', subject: 'Physics', date: '2026-04-18', score: 92, steps: 5, status: 'complete', feedback: 'Excellent accuracy in your time measurements!' },
  { id: 2, title: 'Microscope Use', subject: 'Biology', date: '2026-04-15', score: 88, steps: 4, status: 'complete', feedback: 'Good specimen identification. Practice focusing at high magnification.' },
  { id: 3, title: 'Titration', subject: 'Chemistry', date: '2026-04-10', score: 74, steps: 6, status: 'complete', feedback: 'Endpoint detection was slightly off. Review neutralisation theory.' },
  { id: 4, title: 'Cell Types', subject: 'Biology', date: '2026-04-08', score: 95, steps: 3, status: 'complete', feedback: 'Excellent distinction between eukaryotic and prokaryotic cells.' },
  { id: 5, title: "Hooke's Law", subject: 'Physics', date: '2026-04-05', score: 81, steps: 5, status: 'complete', feedback: null },
];

const subjectColors = {
  Physics: { chip: 'bg-purple-100 text-purple-800', icon: '⚛️' },
  Chemistry: { chip: 'bg-amber-100 text-amber-800', icon: '🧪' },
  Biology: { chip: 'bg-emerald-100 text-emerald-800', icon: '🧬' },
};

function ScoreBadge({ score }) {
  const color = score >= 85 ? 'text-emerald-600' : score >= 65 ? 'text-amber-600' : 'text-red-600';
  return <span className={`text-2xl font-black ${color}`}>{score}%</span>;
}

function StarRating({ score }) {
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
  return (
    <div className="flex">
      {[1, 2, 3].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function ExperimentHistory() {
  const [expanded, setExpanded] = useState(null);

  const avgScore = Math.round(EXPERIMENT_HISTORY.reduce((s, e) => s + e.score, 0) / EXPERIMENT_HISTORY.length);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🧑‍🔬 Experiment History</h1>
        <p className="text-gray-500 mt-1">All your completed virtual lab sessions.</p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-black text-primary-vibrant">{EXPERIMENT_HISTORY.length}</p>
          <p className="text-sm text-gray-500 mt-1">Labs Completed</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-black text-emerald-600">{avgScore}%</p>
          <p className="text-sm text-gray-500 mt-1">Average Score</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-black text-amber-500">
            {EXPERIMENT_HISTORY.filter(e => e.score >= 90).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Excellent (90%+)</p>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {EXPERIMENT_HISTORY.map(exp => {
          const sc = subjectColors[exp.subject];
          const isOpen = expanded === exp.id;
          return (
            <div key={exp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : exp.id)}
              >
                <div className="text-2xl mr-4">{sc.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.chip}`}>
                      {exp.subject}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />{exp.date}
                    </span>
                    <StarRating score={exp.score} />
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <ScoreBadge score={exp.score} />
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center"><FlaskConical className="w-4 h-4 mr-1 text-primary-vibrant" />{exp.steps} steps completed</span>
                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-emerald-500" />Experiment complete</span>
                  </div>
                  {exp.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-blue-700 mb-1">Teacher Feedback:</p>
                      <p className="text-sm text-blue-800">{exp.feedback}</p>
                    </div>
                  )}
                  <button className="text-sm text-primary-vibrant font-semibold hover:underline">
                    Redo Experiment →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
