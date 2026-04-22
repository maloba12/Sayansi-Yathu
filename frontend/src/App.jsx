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
import StudentDashboard from './pages/student/StudentDashboard';
import LabLibrary from './pages/student/LabLibrary';

const MainLayout = ({ children, role }) => (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar role={role} />
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
  const role = (storedUser.role || 'student').toLowerCase();

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={
          <MainLayout role="admin">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="security" element={<SecurityLogs />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="communication" element={<CommunicationHub role="admin" />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/teacher/*" element={
          <MainLayout role="teacher">
            <Routes>
              <Route path="/" element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="generator" element={<ContentGenerator />} />
              <Route path="sba" element={<TeacherSBAReports />} />
              <Route path="communication" element={<CommunicationHub role="teacher" />} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/student/*" element={
          <MainLayout role="student">
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="library" element={<LabLibrary />} />
            </Routes>
          </MainLayout>
        } />
        <Route path="/" element={<Navigate to={`/${role}`} />} />
      </Routes>
    </Router>
  );
}

export default App;
