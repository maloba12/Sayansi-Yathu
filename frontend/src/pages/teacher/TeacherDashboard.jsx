import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BrainCircuit, ArrowUpRight, MessageCircle, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AITutorPanel from '../../components/common/AITutorPanel';
import ChatPanel from '../../components/common/ChatPanel';
import { useNavigate } from 'react-router-dom';

const FALLBACK_PERFORMANCE = [
  { subject: 'Physics', average: 68 },
  { subject: 'Chemistry', average: 74 },
  { subject: 'Biology', average: 82 },
];

const FALLBACK_ACTIVITY = [
  { id: 1, student: 'Chanda Bwalya', action: 'Completed', target: 'Simple Pendulum', time: '2 hours ago', score: null },
  { id: 2, student: 'Lubasi Musonda', action: 'Attempted', target: "Ohm's Law", time: '4 hours ago', score: 32 },
  { id: 3, student: 'Mutinta Moomba', action: 'Started', target: 'Titration', time: '5 hours ago', score: null },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [isTutorOpen, setIsTutorOpen]   = useState(false);
  const [tutorContext, setTutorContext]  = useState({ subject: 'general', level: 'secondary' });
  const [performanceData, setPerformanceData] = useState(FALLBACK_PERFORMANCE);
  const [recentActivity, setRecentActivity]   = useState(FALLBACK_ACTIVITY);
  const [atRiskStudents, setAtRiskStudents]   = useState([]);
  const [systemAlert, setSystemAlert]         = useState(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ class_id: 'Form 1', subject: 'Physics', experiments_count: 0, period_type: 'monthly' });

  useEffect(() => {
    // Fetch real class analytics from Python backend (REC-03)
    axios.get('http://localhost:5000/api/analytics/class')
      .then(r => {
        if (r.data.success) {
          // Map subject_performance to recharts format
          if (r.data.subject_performance.length > 0) {
            setPerformanceData(r.data.subject_performance.map(s => ({
              subject: s.subject.charAt(0).toUpperCase() + s.subject.slice(1),
              average: s.average
            })));
          }
          // Map recent activity
          if (r.data.recent_activity.length > 0) {
            setRecentActivity(r.data.recent_activity.map((a, i) => ({
              id: i + 1,
              student: a.student,
              action: a.score >= 70 ? 'Completed' : 'Attempted',
              target: a.target,
              time: new Date(a.time).toLocaleString(),
              score: a.score
            })));
          }
          // At-risk students
          if (r.data.at_risk_students) setAtRiskStudents(r.data.at_risk_students);
        }
      })
      .catch(() => {}); // keep fallback data if analytics unavailable

    // Fetch AI-powered risk alerts (REC-07)
    // For demo, we are checking user_id 1 (a sample student linked to this teacher)
    axios.get('http://localhost:5000/api/ai/adaptive/risk?user_id=1')
      .then(r => {
        if (r.data.success && r.data.risk.is_at_risk) {
          setSystemAlert(`Early Warning: Student ID ${r.data.risk.user_id} is predicted to be at-risk (Low score probability: ${Math.round(r.data.risk.probability * 100)}%).`);
        }
      })
      .catch(e => console.error("Risk API error:", e));
  }, []);

  // Open AI tutor pre-loaded with student + subject context
  const openTutorForStudent = (studentName, subject) => {
    setTutorContext({
      subject: subject.toLowerCase(),
      level: 'secondary',
      note: `The student ${studentName} is struggling. Suggest targeted remediation.`
    });
    setIsTutorOpen(true);
  };

  return (
    <div className="relative p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500 mt-1">Class performance overview and AI assistants.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors gap-2"
          >
            <FileText className="w-4 h-4" /> Submit Report
          </button>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-primary-dark transition-colors gap-2 shadow-vibrant"
          >
            <MessageCircle className="w-4 h-4" /> Academic Chat
          </button>
        </div>
      </div>

      {/* REC-07 Early-Warning System Alert Banner */}
      {systemAlert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between animate-pulse">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 text-red-600 rounded-full mr-3">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-800">AI Early-Warning Alert</p>
              <p className="text-xs text-red-700">{systemAlert}</p>
            </div>
          </div>
          <button 
            className="text-xs font-bold text-red-600 hover:text-red-800 underline"
            onClick={() => openTutorForStudent('Student 1', 'general')}
          >
            Intervene with AI Tutor
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <h3 className="text-2xl font-bold text-gray-900">142</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg mr-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Assignments</p>
            <h3 className="text-2xl font-bold text-gray-900">4</h3>
          </div>
        </div>
        <div
          className="bg-white p-6 rounded-xl border border-primary-vibrant shadow-vibrant flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/teacher/generator')}
        >
          <div className="flex items-center">
            <div className="p-4 bg-primary-vibrant/10 text-primary-vibrant rounded-lg mr-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">AI Assignment Gen</p>
              <p className="text-xs text-primary-vibrant font-medium mt-1">Ready to create</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance Chart — live data */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Class Performance (Last 30 Days)</h3>
          <div className="flex-1 min-h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights: Students Needing Help */}
        <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <BrainCircuit className="w-5 h-5 text-amber-500 mr-2" />
              AI Insights: Intervention Needed
            </h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">3 Students</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Based on recent simulation data and quiz scores, these students are struggling with specific concepts.</p>
          
          <div className="space-y-3 flex-1 overflow-y-auto">
            {/* Show at-risk students from DB, fallback to static if empty */}
            {(atRiskStudents.length > 0 ? atRiskStudents : [
              { name: 'Lubasi Musonda', avg_score: 32, subject: 'Physics', note: "Ohm's Law" },
              { name: 'Taonga Phiri',   avg_score: 41, subject: 'Chemistry', note: 'Titration' }
            ]).map((student, i) => (
              <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                  <span className="text-xs font-medium text-amber-600">
                    {student.subject || 'Science'} · {student.avg_score}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {student.note || `Average score: ${student.avg_score}%. May need extra support.`}
                </p>
                <button
                  className="mt-2 text-xs font-medium text-primary-vibrant hover:underline"
                  onClick={() => openTutorForStudent(student.name, student.subject || 'general')}
                >
                  Ask AI Tutor for help →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Student Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Student Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary-vibrant/20 text-primary-vibrant flex items-center justify-center font-bold text-xs mr-3 shrink-0">
                  {activity.student.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.student}</span>{' '}
                    <span className="text-gray-600">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
                {activity.score !== null && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 ${
                    activity.score >= 70
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {activity.score}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tutor Panel for teachers */}
      <AITutorPanel
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        context={tutorContext}
      />
      
      {/* Collaboration Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserId={1} // Static teacher ID for demo
        role="Teacher"
      />

      {/* Report Submit Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Submit Lab Report</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">Class</label>
                <select className="w-full border rounded p-2" value={reportForm.class_id} onChange={e => setReportForm({...reportForm, class_id: e.target.value})}>
                  <option>Form 1</option>
                  <option>Form 2</option>
                  <option>Form 3</option>
                  <option>Form 4</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Subject</label>
                <select className="w-full border rounded p-2" value={reportForm.subject} onChange={e => setReportForm({...reportForm, subject: e.target.value})}>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Experiments Conducted</label>
                <input type="number" min="0" className="w-full border rounded p-2" value={reportForm.experiments_count} onChange={e => setReportForm({...reportForm, experiments_count: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Period</label>
                <select className="w-full border rounded p-2" value={reportForm.period_type} onChange={e => setReportForm({...reportForm, period_type: e.target.value})}>
                  <option value="monthly">Monthly</option>
                  <option value="term">Termly</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded" onClick={() => setIsReportModalOpen(false)}>Cancel</button>
              <button 
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center"
                onClick={async () => {
                   try {
                     await axios.post('http://localhost:5000/api/reports/submit', { ...reportForm, teacher_id: 1 });
                     alert("Report submitted successfully!");
                     setIsReportModalOpen(false);
                   } catch(e) {
                     alert("Failed to submit report");
                   }
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2"/> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
