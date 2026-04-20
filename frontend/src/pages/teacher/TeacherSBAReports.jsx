import React, { useState, useEffect } from 'react';
import { ClipboardList, Download, Users, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function TeacherSBAReports() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch students list
    axios.get('http://localhost:5000/api/analytics/class')
      .then(r => {
        if (r.data.success && r.data.at_risk_students) {
           // For demo, combine known students
           setStudents([
             { id: 1, name: 'Chanda Bwalya', grade: 'Form 1' },
             { id: 2, name: 'Lubasi Musonda', grade: 'Form 1' },
             { id: 3, name: 'Mutinta Moomba', grade: 'Form 1' }
           ]);
        }
      })
      .catch(e => console.error("Failed to fetch students", e));
  }, []);

  const fetchReport = (studentId) => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/analytics/sba?user_id=${studentId}`)
      .then(r => {
        if (r.data.success) {
          setReport(r.data.report);
        }
        setLoading(false);
      })
      .catch(e => {
        console.error("Report fetch error", e);
        setLoading(false);
      });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SBA Reports</h1>
          <p className="text-gray-500 mt-1">Automated School-Based Assessment aligned with ECZ/CBC strands.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-primary-dark transition-colors gap-2">
          <Download className="w-4 h-4" />
          Export All (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Selector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-vibrant" />
            Select Student
          </h3>
          <div className="space-y-2">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedStudent(s); fetchReport(s.id); }}
                className={`w-full text-left p-3 rounded-lg transition-all ${selectedStudent?.id === s.id ? 'bg-primary-vibrant text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <p className="font-semibold text-sm">{s.name}</p>
                <p className={`text-xs ${selectedStudent?.id === s.id ? 'text-white/80' : 'text-gray-500'}`}>{s.grade}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Report Display */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
          {!selectedStudent ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ClipboardList className="w-16 h-16 opacity-20" />
              <p>Select a student to view their SBA performance report.</p>
            </div>
          ) : loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-vibrant"></div>
            </div>
          ) : report ? (
            <div className="space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-500">Curriculum: CBC New (2024)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SBA Status</span>
                  <p className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Validated
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(report).map(([strand, data]) => (
                  <div key={strand} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{strand}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${data.average >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {data.average}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                      <div 
                        className={`h-1.5 rounded-full ${data.average >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${data.average}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Topics: {data.topics ? data.topics.join(', ') : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>

              {/* SBA Rubric Placeholder */}
              <div className="mt-8 p-4 bg-primary-vibrant/5 rounded-xl border border-primary-vibrant/10">
                <h4 className="text-sm font-bold text-primary-vibrant mb-2">Teacher Recommendations (AI Generated)</h4>
                <p className="text-xs text-gray-700 italic">
                  Student shows strong competency in {Object.keys(report)[0]}. Recommend progressing to Advanced simulation modes for electricity-related strands.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No report data found for this student.</p>
          )}
        </div>
      </div>
    </div>
  );
}
