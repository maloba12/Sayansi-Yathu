import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BookOpen, 
  Activity,
  GraduationCap,
  FlaskConical,
  BrainCircuit,
  LogOut,
  Shield,
  ClipboardList,
  MessageCircle
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const adminLinks = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/users', icon: Users, label: 'User Management' },
  {path: '/admin/security', icon: Shield, label: 'Security Logs' },
  { path: '/admin/reports', icon: Activity, label: 'System Reports' },
  { path: '/admin/labs', icon: FlaskConical, label: 'Lab Management' },
  { path: '/admin/communication', icon: MessageCircle, label: 'Communication' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' }
];

const teacherLinks = [
  { path: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/teacher/classes', icon: Users, label: 'My Classes' },
  { path: '/teacher/students', icon: GraduationCap, label: 'Students' },
  { path: '/teacher/assignments', icon: BookOpen, label: 'Assignments' },
  { path: '/teacher/sba', icon: ClipboardList, label: 'SBA Reports' },
  { path: '/teacher/labs', icon: FlaskConical, label: 'Virtual Lab' },
  { path: '/teacher/generator', icon: BrainCircuit, label: 'AI Generator' },
  { path: '/teacher/communication', icon: MessageCircle, label: 'Communication Hub' },
];

const hodLinks = [
  { path: '/hod', icon: LayoutDashboard, label: 'Performance', end: true },
  { path: '/hod/teachers', icon: Users, label: 'Teacher Activity' },
  { path: '/hod/curriculum', icon: ClipboardList, label: 'Curriculum Tracking' },
  { path: '/hod/reports', icon: Activity, label: 'Insights' },
];

const studentLinks = [
  { path: '/student', icon: LayoutDashboard, label: 'My Dashboard', end: true },
  { path: '/student/lab', icon: FlaskConical, label: 'Virtual Lab' },
  { path: '/student/subjects', icon: BookOpen, label: 'My Subjects' },
  { path: '/student/assignments', icon: ClipboardList, label: 'Assignments' },
  { path: '/student/progress', icon: GraduationCap, label: 'Progress Tracker' },
  { path: '/student/history', icon: Activity, label: 'Experiment History' },
  { path: '/student/notes', icon: Settings, label: 'Notes & Resources' },
  { path: '/student/messages', icon: MessageCircle, label: 'Messages' },
];

export default function Sidebar({ role, toggleTheme }) {
  const links = role === 'admin' ? adminLinks : role === 'hod' ? hodLinks : role === 'teacher' ? teacherLinks : studentLinks;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login.html';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <img src="/assets/logo.png" alt="Sayansi Yathu" className="h-8 w-8 object-contain mr-3" />
        <span className="font-bold text-xl text-primary-dark">Sayansi Yathu</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) => twMerge(clsx(
                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-primary-vibrant/10 text-primary-vibrant border-l-4 border-primary-vibrant' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-vibrant border-l-4 border-transparent'
                  ))}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button 
          onClick={toggleTheme}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-5 h-5 mr-3 flex items-center justify-center">🌓</div>
          Switch Theme
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
