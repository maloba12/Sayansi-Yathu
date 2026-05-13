import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Trophy, 
  BrainCircuit, 
  Target, 
  Zap, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import axios from 'axios';
import AITutorPanel from '../../components/common/AITutorPanel';
import ExperimentCard from '../../components/common/ExperimentCard';

export default function StudentDashboard() {
  const [recommendedLabs, setRecommendedLabs] = useState([]);
  const [user, setUser] = useState({ name: 'Mpundu Maloba', grade: 'Grade 11' });
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [studentStats, setStudentStats] = useState({ experiments_completed: 0, avg_score: 0 });
  const [todayFocus, setTodayFocus] = useState([]);
  const [subjectMastery, setSubjectMastery] = useState([
    { label: 'Physics', progress: 0, color: 'bg-blue-500' },
    { label: 'Chemistry', progress: 0, color: 'bg-orange-500' },
    { label: 'Biology', progress: 0, color: 'bg-emerald-500' },
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem('user_data');
    let userId = 0;
    let studentGrade = 'Grade 11';

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        userId = parsed.id;
        studentGrade = parsed.profile?.grade_or_form || parsed.grade || parsed.level || 'Grade 11';
        setUser({
          name: parsed.name || 'Student',
          grade: studentGrade
        });
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const fetchDashboardData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:8000/api/student/dashboard_stats.php?user_id=${userId}`);
        if (response.data && response.data.success) {
          setStudentStats(response.data.stats);
          setTodayFocus(response.data.focus);
          
          if (response.data.mastery && response.data.mastery.length > 0) {
             const colors = { 'physics': 'bg-blue-500', 'chemistry': 'bg-orange-500', 'biology': 'bg-emerald-500' };
             const mappedMastery = response.data.mastery.map(m => ({
                label: m.subject.charAt(0).toUpperCase() + m.subject.slice(1),
                progress: parseInt(m.mastery),
                color: colors[m.subject.toLowerCase()] || 'bg-gray-500'
             }));
             setSubjectMastery(mappedMastery);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    const fetchLabs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/simulations/list.php');
        if (response.data && response.data.success) {
          const formattedLabs = response.data.simulations
            .filter(dbLab => {
              const labLevel = dbLab.grade_or_form || '';
              const sGrade = String(studentGrade).toLowerCase();
              const lLevel = String(labLevel).toLowerCase();
              
              // More robust filtering: 
              // Match "Grade 11" with "11", "G11", "Form 1" with "F1", etc.
              const extractNum = (str) => str.match(/\d+/) ? str.match(/\d+/)[0] : str;
              const sNum = extractNum(sGrade);
              const lNum = extractNum(lLevel);

              return lLevel.includes(sGrade) || 
                     sGrade.includes(lLevel) || 
                     (sNum === lNum && sNum !== '');
            })
            .map(dbLab => ({
              id: dbLab.id,
              simType: dbLab.simulation_type,
              title: dbLab.title,
              subject: dbLab.subject ? dbLab.subject.charAt(0).toUpperCase() + dbLab.subject.slice(1) : '',
              difficulty: dbLab.difficulty_level || 'Beginner',
              description: dbLab.description,
              duration: '20 min'
            }));
          setRecommendedLabs(formattedLabs);
        }
      } catch (error) {
        console.error('Failed to fetch simulations:', error);
      }
    };

    fetchDashboardData();
    fetchLabs();
  }, []);

  return (
    <div className="relative p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
             <span className="px-2 py-1 bg-primary-vibrant/10 text-primary-vibrant text-[10px] font-black uppercase tracking-widest rounded-lg">Student Profile</span>
             <div className="w-1 h-1 rounded-full bg-gray-300" />
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.grade} Science</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Warm welcome, {user.name.split(' ')[0]}! ✨</h1>
          <p className="text-gray-500 font-medium">Your personalized learning journey is 72% complete this term.</p>
        </div>
        
        <div className="flex space-x-4">
           <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                 <Trophy className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mastery Score</p>
                 <p className="text-xl font-black text-gray-900">{studentStats.avg_score}%</p>
              </div>
           </div>
           <div className="bg-primary-dark text-white p-4 rounded-3xl shadow-lg flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Zap className="w-6 h-6 text-primary-vibrant" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Labs Done</p>
                 <p className="text-xl font-black text-white">{studentStats.experiments_completed}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tasks & Recommendations */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Today's Focus */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
             <div className="w-full md:w-64 bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-vibrant/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative">
                   <Target className="w-10 h-10 text-primary-vibrant mb-4" />
                   <h2 className="text-2xl font-black leading-tight italic">Today's Focus</h2>
                   <p className="text-slate-400 text-xs mt-2 font-medium">Prioritize these tasks to maintain your academic momentum.</p>
                </div>
                <div className="relative mt-8 pt-8 border-t border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary-vibrant">Daily Streak</p>
                   <p className="text-lg font-black italic">8 Days Active</p>
                </div>
             </div>
             <div className="flex-1 p-8 space-y-4">
              {todayFocus.map((task, i) => (
                  <div key={i} className="flex items-center p-4 bg-gray-50 border border-transparent rounded-2xl hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all group cursor-pointer">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${task.urgent ? 'bg-red-100 text-red-600' : 'bg-white shadow-sm text-primary-vibrant'}`}>
                        {task.urgent ? <Zap className="w-5 h-5 fill-current" /> : <Calendar className="w-5 h-5" />}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center space-x-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{task.subject}</span>
                           <div className="w-1 h-1 rounded-full bg-gray-300" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{task.type}</span>
                        </div>
                        <p className="font-bold text-gray-900">{task.title}</p>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${task.urgent ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-200 text-gray-600'}`}>
                           {task.due}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 mt-2 group-hover:text-primary-vibrant group-hover:translate-x-1 transition-all" />
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Recommended Experiments */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Recommended for You 🧪</h2>
                <p className="text-sm text-gray-500 mt-1">Based on your recent interest in Mechanics and Electricity.</p>
              </div>
              <a href="#/student/lab" className="text-xs font-black uppercase tracking-widest text-primary-vibrant hover:underline underline-offset-8">Explore Library →</a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendedLabs.slice(0, 4).map(lab => (
                <ExperimentCard 
                  key={lab.id} 
                  experiment={lab} 
                  onStart={() => window.location.href = `/index_3d.html?type=${lab.simType}`}
                  onPreview={() => window.location.href = `/index_3d.html?type=${lab.simType}`}
                />
              ))}
              {recommendedLabs.length === 0 && (
                <div className="col-span-2 py-20 bg-gray-100 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                   <div className="w-12 h-12 rounded-full border-4 border-t-primary-vibrant animate-spin mb-4" />
                   <p className="text-sm font-bold uppercase tracking-widest">Optimizing Recommendations...</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Access & AI */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Quick Navigation Card */}
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-vibrant/20 rounded-full -ml-24 -mb-24 blur-3xl" />
              <h3 className="text-lg font-black italic mb-6">Quick Navigation</h3>
              
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'My Subjects', icon: Target, href: '#/student/subjects' },
                   { label: 'Assignments', icon: Bookmark, href: '#/student/assignments' },
                   { label: 'Progress', icon: Trophy, href: '#/student/progress' },
                   { label: 'Chat Hub', icon: MessageSquare, href: '#/student/messages' },
                 ].map(item => (
                   <a key={item.label} href={item.href} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 transition-all flex flex-col space-y-3 group/nav">
                      <item.icon className="w-5 h-5 text-primary-vibrant group-hover/nav:scale-110 transition-transform" />
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                   </a>
                 ))}
              </div>
              
              <button className="w-full mt-6 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all">
                 View Full Profile
              </button>
           </div>

           {/* AI Tutor Card */}
           <div className="bg-primary-vibrant rounded-3xl p-8 text-white shadow-2xl shadow-primary-vibrant/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <BrainCircuit className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-black italic leading-tight">Stuck on a concept?</h3>
              <p className="text-white/80 text-sm mt-2 leading-relaxed">Your AI Tutor is available 24/7 to help you master complex scientific principles.</p>
              
              <button 
                onClick={() => setIsTutorOpen(true)}
                className="w-full mt-8 py-4 bg-primary-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-black transition-all"
              >
                 Start Session Now
              </button>
           </div>

           {/* Performance Summary Widget */}
           <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Subject Mastery</h3>
              <div className="space-y-4">
                 {subjectMastery.map(subj => (
                    <div key={subj.label}>
                       <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-gray-500">{subj.label}</span>
                          <span className="text-gray-900">{subj.progress}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                          <div className={`h-full ${subj.color} rounded-full`} style={{ width: `${subj.progress}%` }} />
                       </div>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="flex items-center justify-center space-x-8 pt-8 opacity-40">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Server: Operational</span>
         </div>
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Engine: Pro Edition</span>
         </div>
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">CBC Version: 2026.4</span>
         </div>
      </div>

      {/* AI Tutor Panel */}
      <AITutorPanel
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        context={{ subject: 'general', level: 'secondary' }}
      />
    </div>
  );
}
