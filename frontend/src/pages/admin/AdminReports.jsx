import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, UserPlus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/summary')
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching admin summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-vibrant"></div>
      </div>
    );
  }

  const stats = data?.stats || { total_users: 0, total_students: 0, total_experiments: 0, total_interactions: 0 };
  const subjectData = data?.subject_usage || [];
  const recentUsers = data?.recent_users || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
        <p className="text-gray-500 mt-1">Detailed breakdown of platform usage and user growth.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.total_users.toLocaleString()} 
          icon={<Users className="w-5 h-5" />} 
          color="blue" 
          change="+5.2%"
        />
        <StatCard 
          title="Students" 
          value={stats.total_students.toLocaleString()} 
          icon={<UserPlus className="w-5 h-5" />} 
          color="emerald" 
          change="+8.1%"
        />
        <StatCard 
          title="Experiments" 
          value={stats.total_experiments.toLocaleString()} 
          icon={<BookOpen className="w-5 h-5" />} 
          color="amber" 
          change="0.0%"
        />
        <StatCard 
          title="Interactions" 
          value={stats.total_interactions.toLocaleString()} 
          icon={<Activity className="w-5 h-5" />} 
          color="indigo" 
          change="+12.4%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Popularity Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-vibrant" />
            Subject Popularity
          </h3>
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="subject" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="usage_count" radius={[4, 4, 0, 0]}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 mb-6 font-primary">Recent Registrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-3 text-sm font-semibold text-gray-600">User</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Role</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                        user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                        user.role === 'teacher' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, change }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-emerald-500 font-medium">{change}</span>
        <span className="text-gray-400 ml-2">vs last period</span>
      </div>
    </div>
  );
}
