import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, FileText, BarChart2, CheckCircle, Target, Sparkles, MessageCircle } from 'lucide-react';
import ChatPanel from '../../components/common/ChatPanel';

export default function AdminCommunication() {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [autoSummary, setAutoSummary] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchHeatmap();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/summary');
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateAutoSummary = async () => {
    try {
      setAutoSummary("Generating...");
      const res = await axios.get('http://localhost:5000/api/reports/auto-summary?period=monthly');
      if (res.data.success) {
        setAutoSummary(res.data.summary);
      }
    } catch (e) {
      setAutoSummary("Failed to generate summary.");
    }
  };

  const fetchHeatmap = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics/heatmap');
      if (res.data.success) {
        setHeatmapData(res.data.heatmap);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderHeatmap = () => {
    // Basic logic to group by class and subject
    const subjects = ['physics', 'chemistry', 'biology'];
    const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

    const getScore = (c, s) => {
      const row = heatmapData.find(item => item.class_name === c && item.subject === s);
      return row ? Number(row.avg_score).toFixed(0) : 0;
    };

    const getColor = (score) => {
      if (score >= 80) return 'bg-emerald-500 text-white';
      if (score >= 60) return 'bg-emerald-300 text-emerald-900';
      if (score > 0) return 'bg-amber-400 text-amber-900';
      return 'bg-gray-100 text-gray-400';
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-3 font-semibold text-gray-700 w-1/4">Class</th>
              {subjects.map(s => <th key={s} className="p-3 font-semibold text-gray-700 capitalize">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c} className="border-t border-gray-100">
                <td className="p-3 font-medium text-gray-900">{c}</td>
                {subjects.map(s => {
                  const score = getScore(c, s);
                  return (
                    <td key={s} className="p-3">
                      <div className={`p-4 rounded-xl flex flex-col items-center justify-center font-bold shadow-sm transition-transform hover:scale-[1.02] ${getColor(score)}`}>
                        {score > 0 ? `${score}%` : 'No Data'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication & Reports</h1>
          <p className="text-gray-500 mt-1">Review academic reporting and broadcast messages to staff.</p>
        </div>
        <button 
          onClick={() => setIsChatOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-primary-dark transition-colors gap-2 shadow-vibrant"
        >
          <MessageCircle className="w-4 h-4" /> Open Chat
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 flex items-center justify-center py-4 text-sm font-medium transition-colors ${activeTab === 'reports' ? 'text-primary-vibrant border-b-2 border-primary-vibrant' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText className="w-4 h-4 mr-2" /> Academic Reports
          </button>
          <button 
            className={`flex-1 flex items-center justify-center py-4 text-sm font-medium transition-colors ${activeTab === 'heatmap' ? 'text-primary-vibrant border-b-2 border-primary-vibrant' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('heatmap')}
          >
            <BarChart2 className="w-4 h-4 mr-2" /> Performance Heatmaps
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Submitted Reports</h3>
                <button onClick={generateAutoSummary} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium text-sm">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate AI Monthly Summary
                </button>
              </div>
              
              {autoSummary && (
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2"/> Monthly AI Insights</h4>
                  <p className="text-indigo-800 text-sm">{autoSummary}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((r, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{r.period_type}</span>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{r.class_id} - {r.subject}</h4>
                    <p className="text-sm text-gray-600">Experiments Conducted: <span className="font-bold text-primary-vibrant">{r.experiments_count}</span></p>
                    <p className="text-xs text-gray-400 mt-2">Submitted by Teacher ID: {r.teacher_id}</p>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-gray-500 text-sm">No reports submitted yet.</p>}
              </div>
            </div>
          )}

          {activeTab === 'heatmap' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Performance Heatmap</h3>
                <p className="text-gray-500 text-sm">Visualizing cross-sectional academic performance across subjects and forms.</p>
              </div>
              {renderHeatmap()}
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserId={999} // Static admin ID for demo
        role="Admin"
      />
    </div>
  );
}
