import React, { useState, useEffect } from 'react';
import { PlayCircle, Trophy, BrainCircuit, GraduationCap } from 'lucide-react';
import axios from 'axios';
import AITutorPanel from '../../components/common/AITutorPanel';

export default function StudentDashboard() {
  const [recommendedLabs, setRecommendedLabs] = useState([]);
  const [user, setUser] = useState({ name: 'Student' });
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [studentStats, setStudentStats] = useState({
    experiments_completed: 0, avg_score: 0
  });

  useEffect(() => {
    let userId = null;
    try {
      const storedData = localStorage.getItem('user_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.name) setUser(parsed);
        userId = parsed.id;
      }
    } catch (error) {
      console.error('Failed to parse user_data:', error);
    }

    // Fetch recommended labs from PHP backend
    const fetchLabs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/simulations/list.php');
        if (response.data && response.data.success) {
          const formattedLabs = response.data.simulations.slice(0, 4).map(dbLab => ({
            id: dbLab.simulation_type,
            title: dbLab.title,
            subject: dbLab.subject ? dbLab.subject.charAt(0).toUpperCase() + dbLab.subject.slice(1) : '',
            difficulty: dbLab.difficulty || 'Medium',
            time: '20 mins'
          }));
          setRecommendedLabs(formattedLabs);
        }
      } catch (error) {
        console.error('Failed to fetch simulations:', error);
      }
    };
    fetchLabs();

    // Fetch real student stats from Python analytics endpoint (REC-03)
    if (userId) {
      axios.get(`http://localhost:5000/api/analytics/student/${userId}`)
        .then(r => {
          if (r.data.success) setStudentStats(r.data.overall);
        })
        .catch(() => {}); // silently ignore if analytics not yet connected
    }
  }, []);

  return (
    <div className="relative p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Ready to continue your science journey?</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-vibrant text-white p-6 rounded-xl shadow-vibrant">
          <p className="font-medium text-white/80">Experiments Completed</p>
          <h3 className="text-3xl font-bold mt-2">{studentStats.experiments_completed}</h3>
          <p className="text-sm text-white/80 flex items-center mt-2">
            <Trophy className="w-4 h-4 mr-1 text-yellow-300" />
            Avg score: {studentStats.avg_score}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Current Assignment</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">Ohm's Law</h3>
            <p className="text-xs text-red-500 mt-1 font-medium">Due Tomorrow</p>
          </div>
          <button className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <PlayCircle className="w-6 h-6" />
          </button>
        </div>
        {/* ... More student stats ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended For You */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recommended Labs</h3>
            <button className="text-sm text-primary-vibrant font-medium hover:underline">View Library &rarr;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedLabs.map((lab) => (
              <div key={lab.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${lab.subject === 'Physics' ? 'bg-blue-100 text-blue-800' : 
                      lab.subject === 'Chemistry' ? 'bg-purple-100 text-purple-800' : 
                      'bg-emerald-100 text-emerald-800'}`}>
                    {lab.subject}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{lab.time}</span>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-primary-vibrant transition-colors">{lab.title}</h4>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{lab.difficulty}</span>
                  <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-primary-vibrant transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Stuck on a concept?</h3>
          <p className="text-white/80 text-sm mb-6">Your personal AI Science Tutor is available 24/7 to help you understand complex topics.</p>
          <button
            className="w-full py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => setIsTutorOpen(true)}
          >
            Ask AI Tutor
          </button>
        </div>
      </div>

      {/* AI Tutor Panel (mounted here, slides in from the right) */}
      <AITutorPanel
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        context={{ subject: 'general', level: 'secondary' }}
      />
    </div>
  );
}
