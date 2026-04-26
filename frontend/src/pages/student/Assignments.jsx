import React, { useState } from 'react';
import { ClipboardList, Clock, CheckCircle, AlertCircle, ChevronRight, Upload } from 'lucide-react';

const MOCK_ASSIGNMENTS = [
  {
    id: 1, subject: 'Physics', title: 'Pendulum Lab Report', dueDate: '2026-04-25',
    status: 'pending', description: 'Complete the pendulum experiment and write a full lab report including your measurements, calculations, and conclusions.',
    feedback: null,
  },
  {
    id: 2, subject: 'Chemistry', title: 'Titration Results Submission', dueDate: '2026-04-23',
    status: 'submitted', description: 'Submit your measured results from the acid-base titration virtual experiment.',
    feedback: null,
  },
  {
    id: 3, subject: 'Biology', title: 'Cell Structure Drawing', dueDate: '2026-04-20',
    status: 'graded', description: 'Draw and label a plant cell and an animal cell based on the virtual microscope lab.',
    feedback: 'Excellent work! Clear labelling on both cells. Remember to include the cell wall thickness comparison.',
    grade: '87%',
  },
  {
    id: 4, subject: 'Physics', title: 'Forces & Motion Quiz', dueDate: '2026-04-30',
    status: 'pending', description: 'Complete the online quiz on Newton\'s Laws of Motion.',
    feedback: null,
  },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Pending' },
  submitted: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Submitted' },
  graded: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'Graded' },
};

const subjectColors = {
  Physics: 'bg-purple-100 text-purple-800',
  Chemistry: 'bg-amber-100 text-amber-800',
  Biology: 'bg-emerald-100 text-emerald-800',
};

function AssignmentCard({ assignment }) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[assignment.status];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className={`p-2 rounded-full border ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{assignment.title}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectColors[assignment.subject]}`}>
                {assignment.subject}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Due: {assignment.dueDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
          {assignment.grade && (
            <span className="text-lg font-bold text-emerald-600">{assignment.grade}</span>
          )}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${config.color}`}>
            {config.label}
          </span>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          <p className="text-sm text-gray-600">{assignment.description}</p>

          {assignment.feedback && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-xs font-bold text-emerald-700 mb-1">Teacher Feedback:</p>
              <p className="text-sm text-emerald-800">{assignment.feedback}</p>
            </div>
          )}

          {assignment.status === 'pending' && (
            <button className="flex items-center px-4 py-2 bg-primary-vibrant text-white text-sm font-semibold rounded-lg hover:bg-primary-blue transition-colors">
              <Upload className="w-4 h-4 mr-2" /> Submit Assignment
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Assignments() {
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Pending', 'Submitted', 'Graded'];
  const filtered = filter === 'All'
    ? MOCK_ASSIGNMENTS
    : MOCK_ASSIGNMENTS.filter(a => a.status === filter.toLowerCase());

  const counts = {
    pending: MOCK_ASSIGNMENTS.filter(a => a.status === 'pending').length,
    submitted: MOCK_ASSIGNMENTS.filter(a => a.status === 'submitted').length,
    graded: MOCK_ASSIGNMENTS.filter(a => a.status === 'graded').length,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📝 Assignments</h1>
        <p className="text-gray-500 mt-1">Track, submit, and review all your assignments here.</p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: counts.pending, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { label: 'Submitted', count: counts.submitted, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Graded', count: counts.graded, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border p-4 text-center ${item.color}`}>
            <p className="text-2xl font-bold">{item.count}</p>
            <p className="text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-primary-vibrant text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No assignments in this category.</p>
          </div>
        ) : filtered.map(a => <AssignmentCard key={a.id} assignment={a} />)}
      </div>
    </div>
  );
}
