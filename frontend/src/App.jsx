import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import ConsentModal from './components/common/ConsentModal';

import DashboardHome from './pages/admin/DashboardHome';
import UserManagement from './pages/admin/UserManagement';
import SecurityLogs from './pages/admin/SecurityLogs';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ContentGenerator from './pages/teacher/ContentGenerator';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherSBAReports from './pages/teacher/TeacherSBAReports';
import AdminReports from './pages/admin/AdminReports';
import CommunicationHub from './pages/communication/CommunicationHub';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLabManagement from './pages/admin/AdminLabManagement';
import StudentDashboard from './pages/student/StudentDashboard';
import LabLibrary from './pages/student/LabLibrary';
import HODDashboard from './pages/hod/HODDashboard';
import StudentManagement from './pages/teacher/StudentManagement';
import TeacherLabView from './pages/teacher/TeacherLabView';
import MySubjects from './pages/student/MySubjects';
import Assignments from './pages/student/Assignments';
import ProgressTracker from './pages/student/ProgressTracker';
import ExperimentHistory from './pages/student/ExperimentHistory';
import NotesResources from './pages/student/NotesResources';
import Messages from './pages/student/Messages';
import PhysicsGradeSelection from './pages/student/PhysicsGradeSelection';
import PhysicsTopicSelection from './pages/student/PhysicsTopicSelection';
import PhysicsExperimentDetail from './pages/student/PhysicsExperimentDetail';
import ChemistryGradeSelection from './pages/student/ChemistryGradeSelection';
import ChemistryTopicSelection from './pages/student/ChemistryTopicSelection';
import ChemistryExperimentDetail from './pages/student/ChemistryExperimentDetail';
import { useEffect, useState } from 'react';

const MainLayout = ({ children, role, toggleTheme }) => (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar role={role} toggleTheme={toggleTheme} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopNav role={role} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ConsentModal />
    </div>
  </div>
);
function App() {
  let storedUser = {};
  try {
    const item = localStorage.getItem('user_data');
    if (item) storedUser = JSON.parse(item);
  } catch (error) {
    console.error('Failed to parse user_data from LocalStorage:', error);
  }

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const role = (storedUser.role || 'student').toLowerCase();

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={
          <MainLayout role="admin" toggleTheme={toggleTheme}>
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="security" element={<SecurityLogs />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="communication" element={<CommunicationHub role="admin" />} />
              <Route path="labs" element={<AdminLabManagement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/hod/*" element={
          <MainLayout role="hod" toggleTheme={toggleTheme}>
            <Routes>
              <Route path="/" element={<HODDashboard />} />
              <Route path="teachers" element={<div>Teacher Activity Monitoring</div>} />
              <Route path="curriculum" element={<div>Curriculum Tracking</div>} />
              <Route path="reports" element={<div>Departmental Insights</div>} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/teacher/*" element={
          <MainLayout role="teacher" toggleTheme={toggleTheme}>
            <Routes>
              <Route path="/" element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="generator" element={<ContentGenerator />} />
              <Route path="sba" element={<TeacherSBAReports />} />
              <Route path="labs" element={<TeacherLabView />} />
              <Route path="communication" element={<CommunicationHub role="teacher" />} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/student/*" element={
          <MainLayout role="student" toggleTheme={toggleTheme}>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="lab" element={<LabLibrary />} />
              <Route path="subjects" element={<MySubjects />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="progress" element={<ProgressTracker />} />
              <Route path="history" element={<ExperimentHistory />} />
              <Route path="notes" element={<NotesResources />} />
              <Route path="messages" element={<Messages />} />
              <Route path="lab/physics" element={<PhysicsGradeSelection />} />
              <Route path="lab/physics/:grade" element={<PhysicsTopicSelection />} />
              <Route path="lab/physics/experiment/:id" element={<PhysicsExperimentDetail />} />
              <Route path="lab/chemistry" element={<ChemistryGradeSelection />} />
              <Route path="lab/chemistry/:grade" element={<ChemistryTopicSelection />} />
              <Route path="lab/chemistry/experiment/:id" element={<ChemistryExperimentDetail />} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/" element={<Navigate to={`/${role}`} />} />
      </Routes>
    </Router>
  );
}

export default App;
